import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: {
      plan:                  true,
      aiUsageCount:          true,
      stripeCurrentPeriodEnd: true,
    },
  });

  return NextResponse.json({
    plan:            user?.plan ?? "free",
    aiUsageCount:    user?.aiUsageCount ?? 0,
    periodEnd:       user?.stripeCurrentPeriodEnd ?? null,
  });
}