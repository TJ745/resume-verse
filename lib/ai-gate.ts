import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/stripe";

interface GateResult {
  allowed: boolean;
  isPro:   boolean;
  used:    number;
  limit:   number;
  reason?: string;
}

/**
 * Call at the top of every AI route after auth check.
 * Increments usage count for free users.
 * Returns { allowed, isPro, used, limit }.
 */
export async function checkAIUsage(userId: string): Promise<GateResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan:          true,
      aiUsageCount:  true,
      aiUsageResetAt: true,
    },
  });

  if (!user) return { allowed: false, isPro: false, used: 0, limit: 0, reason: "User not found" };

  const isPro = user.plan === "pro";

  if (isPro) {
    return { allowed: true, isPro: true, used: user.aiUsageCount, limit: Infinity };
  }

  // Reset monthly counter if past reset date
  const now = new Date();
  const resetAt = new Date(user.aiUsageResetAt);
  const needsReset =
    now.getFullYear() > resetAt.getFullYear() ||
    now.getMonth()    > resetAt.getMonth();

  if (needsReset) {
    await prisma.user.update({
      where: { id: userId },
      data:  { aiUsageCount: 0, aiUsageResetAt: now },
    });
    user.aiUsageCount = 0;
  }

  const limit = PLANS.free.aiLimit;

  if (user.aiUsageCount >= limit) {
    return {
      allowed: false,
      isPro:   false,
      used:    user.aiUsageCount,
      limit,
      reason:  `Free plan limit reached (${limit} AI uses/month). Upgrade to Pro for unlimited access.`,
    };
  }

  // Increment
  await prisma.user.update({
    where: { id: userId },
    data:  { aiUsageCount: { increment: 1 } },
  });

  return { allowed: true, isPro: false, used: user.aiUsageCount + 1, limit };
}