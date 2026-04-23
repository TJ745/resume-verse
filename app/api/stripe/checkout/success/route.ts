import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/dashboard?upgrade=success`;
  const errorUrl = `${baseUrl}/pricing?error=checkout_failed`;

  // ── 1. Validate session_id param ─────────────────────────
  if (!sessionId) {
    console.error("[checkout/success] Missing session_id param");
    return NextResponse.redirect(errorUrl);
  }

  try {
    // ── 2. Retrieve session from Stripe ──────────────────────
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    // ── 3. Guard: must be a paid subscription ────────────────
    if (session.payment_status !== "paid" && session.status !== "complete") {
      console.warn(
        `[checkout/success] Session ${sessionId} not paid: ${session.payment_status}`,
      );
      return NextResponse.redirect(errorUrl);
    }

    // ── 4. Get userId from metadata ───────────────────────────
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error(
        `[checkout/success] No userId in metadata for session ${sessionId}`,
      );
      return NextResponse.redirect(errorUrl);
    }

    // ── 5. Get subscription details ───────────────────────────
    const subscription =
      typeof session.subscription === "string"
        ? await stripe.subscriptions.retrieve(session.subscription)
        : (session.subscription as import("stripe").Stripe.Subscription);

    const subscriptionId = subscription?.id ?? null;
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : ((session.customer as import("stripe").Stripe.Customer)?.id ?? null);
    const priceId = subscription?.items?.data[0]?.price?.id ?? null;

    // Safe period-end extraction — Stripe 2025-04-30 moved this to items[0]
    const rawPeriodEnd =
      (subscription?.items?.data?.[0] as unknown as Record<string, unknown>)
        ?.current_period_end ??
      (subscription as unknown as Record<string, unknown>)?.current_period_end;
    const periodEnd =
      typeof rawPeriodEnd === "number" && rawPeriodEnd > 0
        ? new Date(rawPeriodEnd * 1000)
        : null;

    // ── 6. Upgrade user in DB ─────────────────────────────────
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

    console.log(`[checkout/success] Upgraded user ${userId} to Pro`);

    // ── 7. Redirect to dashboard with success banner ──────────
    return NextResponse.redirect(dashboardUrl);
  } catch (err) {
    console.error("[checkout/success] Error:", err);
    return NextResponse.redirect(errorUrl);
  }
}
