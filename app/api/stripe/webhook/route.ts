import { prisma } from "@/lib/prisma";
import { stripe, constructWebhookEvent } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe requires the raw body — disable body parsing
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(rawBody, signature);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return new NextResponse(`Webhook error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      // ── Subscription created → upgrade user to Pro ────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (!userId || !subscriptionId) break;

        // Fetch full subscription to get price + period end
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? null;
        const periodEnd = new Date(subscription.current_period_end * 1000);

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "pro",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      // ── Subscription renewed → refresh period end ─────────
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (!subscriptionId) break;

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = new Date(subscription.current_period_end * 1000);

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            plan: "pro",
            stripeCurrentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      // ── Payment failed → keep Pro but flag expiry ─────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (!subscriptionId) break;

        // Don't downgrade immediately — Stripe will retry.
        // Log for monitoring.
        console.warn(`Payment failed for subscription ${subscriptionId}`);
        break;
      }

      // ── Subscription cancelled / deleted → downgrade ──────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan: "free",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }

      // ── Subscription updated (e.g. plan change) ───────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = ["active", "trialing"].includes(subscription.status);
        const periodEnd = new Date(subscription.current_period_end * 1000);
        const priceId = subscription.items.data[0]?.price.id ?? null;

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan: isActive ? "pro" : "free",
            stripePriceId: isActive ? priceId : null,
            stripeCurrentPeriodEnd: isActive ? periodEnd : null,
            ...(!isActive && { stripeSubscriptionId: null }),
          },
        });
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error(`Stripe webhook handler error [${event.type}]:`, err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse("OK", { status: 200 });
}
