import crypto from "crypto";

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

// ── LemonSqueezy API base ─────────────────────────────────

const LS_API = "https://api.lemonsqueezy.com/v1";

function lsHeaders() {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY!}`,
  };
}

// ── Create a checkout URL ─────────────────────────────────

export async function createCheckoutUrl({
  email,
  name,
  userId,
}: {
  email: string;
  name: string;
  userId: string;
}): Promise<string> {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email,
          name,
          custom: { user_id: userId },
        },
        product_options: {
          redirect_url: `${baseUrl}/dashboard?upgrade=success`,
          receipt_link_url: `${baseUrl}/dashboard?upgrade=success`,
        },
        checkout_options: {
          button_color: "#c84b2f",
        },
        preview: false,
        test_mode: process.env.NODE_ENV !== "production",
      },
      relationships: {
        store: {
          data: { type: "stores", id: storeId },
        },
        variant: {
          data: { type: "variants", id: variantId },
        },
      },
    },
  };

  const res = await fetch(`${LS_API}/checkouts`, {
    method: "POST",
    headers: lsHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LemonSqueezy checkout failed: ${err}`);
  }

  const json = await res.json();
  return json.data.attributes.url as string;
}

// ── Get customer portal URL ───────────────────────────────

export async function getCustomerPortalUrl(
  lsSubscriptionId: string,
): Promise<string> {
  const res = await fetch(`${LS_API}/subscriptions/${lsSubscriptionId}`, {
    headers: lsHeaders(),
  });

  if (!res.ok) throw new Error("Could not fetch subscription");

  const json = await res.json();
  // LemonSqueezy subscriptions include a customer portal URL in their links
  const portalUrl = json.data?.attributes?.urls?.customer_portal as
    | string
    | undefined;

  if (!portalUrl) throw new Error("No customer portal URL found");

  return portalUrl;
}

// ── Verify webhook signature ──────────────────────────────

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "hex"),
      Buffer.from(signature, "hex"),
    );
  } catch {
    return false;
  }
}
