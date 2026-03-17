import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, email: true, name: true },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  if (user.plan === "pro") {
    return NextResponse.json({ error: "Already on Pro plan" }, { status: 400 });
  }

  try {
    const url = await createCheckoutUrl({
      email: user.email ?? session.user.email,
      name: user.name ?? session.user.name ?? "",
      userId: session.user.id,
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("LemonSqueezy checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
