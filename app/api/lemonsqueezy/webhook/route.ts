import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── LemonSqueezy event shapes ─────────────────────────────

interface LSMeta {
  event_name: string;
  custom_data?: { user_id?: string };
}

interface LSSubscriptionAttributes {
  status: string; // "active" | "cancelled" | "expired" | "past_due" | "on_trial" | "paused" | "unpaid"
  customer_id: number;
  variant_id: number;
  renews_at: string | null;
  ends_at: string | null;
  trial_ends_at: string | null;
  first_subscription_item?: {
    subscription_id: number;
  };
}

interface LSOrderAttributes {
  status: string;
  customer_id: number;
}

interface LSEvent {
  meta: LSMeta;
  data: {
    id: string;
    type: string;
    attributes: LSSubscriptionAttributes | LSOrderAttributes;
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  let event: LSEvent;
  try {
    event = JSON.parse(rawBody) as LSEvent;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const eventName = event.meta.event_name;
  const userId = event.meta.custom_data?.user_id;

  try {
    switch (eventName) {
      // ── Subscription created / activated → upgrade to Pro ──
      case "subscription_created":
      case "subscription_resumed":
      case "subscription_unpaused": {
        if (!userId) break;

        const attrs = event.data.attributes as LSSubscriptionAttributes;
        const periodEnd = attrs.renews_at
          ? new Date(attrs.renews_at)
          : attrs.trial_ends_at
            ? new Date(attrs.trial_ends_at)
            : null;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "pro",
            lsSubscriptionId: event.data.id,
            lsCustomerId: String(attrs.customer_id),
            lsVariantId: String(attrs.variant_id),
            lsCurrentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      // ── Subscription renewed → refresh period end ──────────
      case "subscription_updated": {
        const attrs = event.data.attributes as LSSubscriptionAttributes;
        const active = ["active", "on_trial"].includes(attrs.status);
        const periodEnd = attrs.renews_at ? new Date(attrs.renews_at) : null;

        await prisma.user.updateMany({
          where: { lsSubscriptionId: event.data.id },
          data: {
            plan: active ? "pro" : "free",
            lsCurrentPeriodEnd: active ? periodEnd : null,
            ...(!active && { lsSubscriptionId: null, lsVariantId: null }),
          },
        });
        break;
      }

      // ── Subscription cancelled / expired → downgrade ───────
      case "subscription_cancelled":
      case "subscription_expired":
      case "subscription_paused": {
        await prisma.user.updateMany({
          where: { lsSubscriptionId: event.data.id },
          data: {
            plan: "free",
            lsCurrentPeriodEnd: null,
            lsSubscriptionId: null,
            lsVariantId: null,
          },
        });
        break;
      }

      default:
        // Unhandled event — ignore silently
        break;
    }
  } catch (err) {
    console.error(`LemonSqueezy webhook error [${eventName}]:`, err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse("OK", { status: 200 });
}
