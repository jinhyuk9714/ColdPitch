import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.customerPortalUrl) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ url: subscription.customerPortalUrl });
}
