import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCustomerPortalUrl } from "@/lib/lemonsqueezy";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lsSubscriptionId: true, plan: true },
  });

  if (!user?.lsSubscriptionId || user.plan !== "pro") {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 },
    );
  }

  try {
    const url = await getCustomerPortalUrl(user.lsSubscriptionId);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("LemonSqueezy portal error:", err);
    return NextResponse.json(
      { error: "Failed to get billing portal" },
      { status: 500 },
    );
  }
}
