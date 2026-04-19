import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPortalUrl } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true, plan: true },
  });

  if (!user?.stripeCustomerId || user.plan !== "pro") {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 },
    );
  }

  try {
    const url = await createPortalUrl(user.stripeCustomerId);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json(
      { error: "Failed to get billing portal" },
      { status: 500 },
    );
  }
}
