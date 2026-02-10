import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { getUserTier } from "@/lib/subscription";
import { scrapeSite } from "@/lib/scraper";
import { generateEmails } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { Tone } from "@/lib/prompt";

export async function POST(request: NextRequest) {
  // 1. Get session (optional)
  const session = await auth();
  const userId = session?.user?.id;

  // 2. Extract IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  // 3. Get tier and check rate limit
  const tier = await getUserTier(userId);
  const { success, remaining, limit } = await rateLimit({ ip, userId, tier });

  if (!success) {
    const message =
      tier === "anonymous"
        ? "Daily limit reached (3/day). Sign in for more or upgrade to Pro for unlimited."
        : "Daily limit reached (5/day). Upgrade to Pro for unlimited access.";
    return NextResponse.json(
      { error: message },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Limit": String(limit),
        },
      }
    );
  }

  // 4. Parse and validate body
  let body: { url?: string; myProduct?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { url, myProduct, tone } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  if (!myProduct || typeof myProduct !== "string") {
    return NextResponse.json(
      { error: "Product description is required" },
      { status: 400 }
    );
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL format" },
      { status: 400 }
    );
  }

  // Validate tone
  const validTones: Tone[] = ["casual", "professional", "bold"];
  const selectedTone: Tone = validTones.includes(tone as Tone)
    ? (tone as Tone)
    : "professional";

  // 5. Scrape site
  let siteContent: string;
  try {
    siteContent = await scrapeSite(url);
  } catch (error) {
    console.error("[scrape error]", error);
    return NextResponse.json(
      {
        error:
          "Failed to access the website. Please check the URL and try again.",
      },
      { status: 422 }
    );
  }

  // 6. Generate emails
  try {
    const result = await generateEmails(siteContent, myProduct, selectedTone);

    // 7. Save history for logged-in users
    if (userId) {
      await prisma.emailHistory.create({
        data: {
          userId,
          targetUrl: url,
          myProduct,
          tone: selectedTone,
          companyName: result.company.name,
          companyDescription: result.company.description,
          result: JSON.stringify(result),
        },
      });
    }

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Limit": String(limit),
      },
    });
  } catch (error) {
    console.error("[generate error]", error);
    return NextResponse.json(
      { error: "Failed to generate emails. Please try again." },
      { status: 500 }
    );
  }
}
