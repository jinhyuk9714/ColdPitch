import { prisma } from "./prisma";

export type Tier = "anonymous" | "free" | "pro";

const LIMITS: Record<Tier, number> = {
  anonymous: 3,
  free: 5,
  pro: Infinity,
};

export async function rateLimit({
  ip,
  userId,
  tier,
}: {
  ip: string;
  userId?: string;
  tier: Tier;
}): Promise<{ success: boolean; remaining: number; limit: number }> {
  if (tier === "pro") {
    return { success: true, remaining: Infinity, limit: Infinity };
  }

  const key = userId ?? ip;
  const limit = LIMITS[tier];
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const count = await prisma.usageLog.count({
    where: { key, date: today },
  });

  if (count >= limit) {
    return { success: false, remaining: 0, limit };
  }

  await prisma.usageLog.create({
    data: { key, date: today },
  });

  return { success: true, remaining: limit - count - 1, limit };
}
