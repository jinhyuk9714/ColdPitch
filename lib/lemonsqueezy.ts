import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

let initialized = false;

function init() {
  if (!initialized) {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });
    initialized = true;
  }
}

export async function createLemonCheckout(userId: string, userEmail?: string) {
  init();
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;

  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: userEmail ?? undefined,
      custom: { user_id: userId },
    },
    productOptions: {
      redirectUrl: `${process.env.AUTH_URL}/dashboard?checkout=success`,
    },
  });

  if (error) throw new Error(error.message);
  return data?.data.attributes.url;
}

export async function getLemonSubscription(subscriptionId: string) {
  init();
  const { data, error } = await getSubscription(subscriptionId);
  if (error) throw new Error(error.message);
  return data?.data;
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require("crypto") as typeof import("crypto");
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
