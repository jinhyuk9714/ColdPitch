import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

// Next.js 16 wraps route params in a Promise, but next-auth beta
// expects them synchronously. We work around this by passing
// the request directly to the handlers.
export async function GET(request: NextRequest) {
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  return handlers.POST(request);
}
