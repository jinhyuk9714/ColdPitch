import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";

interface LemonWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: { user_id?: string };
  };
  data: {
    id: string;
    attributes: {
      status: string;
      customer_id: number;
      variant_id: number;
      renews_at: string | null;
      urls: {
        customer_portal: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const isValid = verifyWebhookSignature(
    rawBody,
    signature,
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  );

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload: LemonWebhookPayload = JSON.parse(rawBody);
  const { event_name, custom_data } = payload.meta;
  const { attributes } = payload.data;
  const subscriptionId = String(payload.data.id);

  switch (event_name) {
    case "subscription_created": {
      const userId = custom_data?.user_id;
      if (!userId) break;

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          lemonSubscriptionId: subscriptionId,
          lemonCustomerId: String(attributes.customer_id),
          lemonVariantId: String(attributes.variant_id),
          status: attributes.status,
          currentPeriodEnd: attributes.renews_at
            ? new Date(attributes.renews_at)
            : null,
          customerPortalUrl: attributes.urls.customer_portal,
        },
        create: {
          userId,
          lemonSubscriptionId: subscriptionId,
          lemonCustomerId: String(attributes.customer_id),
          lemonVariantId: String(attributes.variant_id),
          status: attributes.status,
          currentPeriodEnd: attributes.renews_at
            ? new Date(attributes.renews_at)
            : null,
          customerPortalUrl: attributes.urls.customer_portal,
        },
      });
      break;
    }

    case "subscription_updated":
    case "subscription_cancelled":
    case "subscription_expired": {
      await prisma.subscription.updateMany({
        where: { lemonSubscriptionId: subscriptionId },
        data: {
          status: attributes.status,
          currentPeriodEnd: attributes.renews_at
            ? new Date(attributes.renews_at)
            : null,
          customerPortalUrl: attributes.urls.customer_portal,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
