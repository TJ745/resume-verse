import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  free: {
    name:      "Free",
    aiLimit:   10,      // per month
    templates: ["modern", "classic", "minimal"],
  },
  pro: {
    name:      "Pro",
    aiLimit:   Infinity,
    templates: "all",
  },
} as const;