import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createLemonCheckout } from "@/lib/lemonsqueezy";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = await createLemonCheckout(
      session.user.id,
      session.user.email ?? undefined
    );
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[lemon checkout error]", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
