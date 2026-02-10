import { prisma } from "./prisma";
import type { Tier } from "./rateLimit";

export async function getUserTier(userId?: string): Promise<Tier> {
  if (!userId) return "anonymous";

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (
    subscription?.status === "active" &&
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd > new Date()
  ) {
    return "pro";
  }

  return "free";
}
