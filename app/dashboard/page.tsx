import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserTier } from "@/lib/subscription";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;
  const tier = await getUserTier(userId);

  // Get subscription info
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  // Get today's usage count
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayUsage = await prisma.emailHistory.count({
    where: {
      userId,
      createdAt: { gte: todayStart },
    },
  });

  // Get initial history
  const [items, total] = await Promise.all([
    prisma.emailHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.emailHistory.count({ where: { userId } }),
  ]);

  return (
    <DashboardClient
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
      tier={tier === "pro" ? "pro" : "free"}
      currentPeriodEnd={
        subscription?.currentPeriodEnd?.toISOString() ?? null
      }
      usage={todayUsage}
      limit={tier === "pro" ? Infinity : 5}
      initialHistory={{
        items: items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
        total,
        page: 1,
        totalPages: Math.ceil(total / 10),
      }}
    />
  );
}
