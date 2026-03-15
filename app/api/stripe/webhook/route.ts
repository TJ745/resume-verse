import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Stripe requires raw body — disable Next.js body parsing
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {

      // ── Checkout completed → activate Pro ─────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId       = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId      = subscription.items.data[0]?.price.id;
        const periodEnd    = new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000);

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan:                  "pro",
            stripeSubscriptionId:  subscriptionId,
            stripePriceId:         priceId,
            stripeCurrentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      // ── Invoice paid → renew period ───────────────────
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId   = typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

        if (!subId) break;

        const subscription = await stripe.subscriptions.retrieve(subId);
        const periodEnd    = new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000);

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subId },
          data:  {
            plan:                  "pro",
            stripeCurrentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      // ── Subscription cancelled / expired → downgrade ──
      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Only downgrade if status is not active/trialing
        const active = ["active", "trialing"].includes(subscription.status);

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data:  {
            plan:                  active ? "pro" : "free",
            stripeCurrentPeriodEnd: active
              ? new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000)
              : null,
            ...(!active && { stripeSubscriptionId: null, stripePriceId: null }),
          },
        });
        break;
      }

      default:
        // Unhandled event — ignore
        break;
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse("OK", { status: 200 });
}