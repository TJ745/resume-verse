import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { stripeCustomerId: true, email: true, name: true, plan: true },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  if (user.plan === "pro") {
    return NextResponse.json({ error: "Already on Pro plan" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Create or reuse Stripe customer
  let customerId = user.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? session.user.email,
      name:  user.name  ?? session.user.name  ?? undefined,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data:  { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer:             customerId,
    mode:                 "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price:    process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId: session.user.id },
    },
    success_url: `${baseUrl}/dashboard?upgrade=success`,
    cancel_url:  `${baseUrl}/pricing?upgrade=cancelled`,
    metadata: { userId: session.user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}