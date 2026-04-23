import Stripe from "stripe";

// ── Plan config ───────────────────────────────────────────

export const PLANS = {
  free: {
    name: "Free",
    aiLimit: 10, // per month
    templates: ["modern", "classic", "minimal"],
  },
  pro: {
    name: "Pro",
    aiLimit: Infinity,
    templates: "all",
  },
} as const;

// ── Stripe client ─────────────────────────────────────────

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// ── Create a Stripe Checkout session URL ──────────────────

export async function createCheckoutUrl({
  email,
  userId,
}: {
  email: string;
  userId: string;
}): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/api/stripe/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    allow_promotion_codes: true,
    metadata: { userId },
    subscription_data: { metadata: { userId } },
  });

  if (!session.url) throw new Error("Stripe session URL missing");
  return session.url;
}

// ── Create a Stripe Billing Portal session URL ────────────

export async function createPortalUrl(
  stripeCustomerId: string,
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${baseUrl}/dashboard/settings`,
  });

  return session.url;
}

// ── Verify Stripe webhook signature ──────────────────────

export function constructWebhookEvent(
  rawBody: string | Buffer,
  signature: string,
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}
