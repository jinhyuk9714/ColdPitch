# ColdPitch

**Paste a URL. Get a cold email. In seconds.**

AI-powered cold email generator that analyzes a target company's website and crafts 3 personalized outreach emails with different angles.

> Live: [coldpitch.site](https://coldpitch.site)

---

## Features

- **AI-Powered Email Generation** — Scrapes the target website, analyzes content, and generates 3 unique cold emails (Observation, Proof, One-liner)
- **Tone Selection** — Casual, Professional, or Bold styles
- **Google OAuth** — One-click sign in with Auth.js v5
- **Freemium Model** — Anonymous (3/day), Free users (5/day), Pro (unlimited) via Lemon Squeezy subscriptions
- **Generation History** — Logged-in users can view and reuse past results
- **SEO Optimized** — Dynamic OG images, sitemap, robots.txt, full meta tags

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Auth | Auth.js v5 (next-auth beta) + Google OAuth |
| Database | PostgreSQL (Neon) + Prisma ORM |
| AI | OpenAI GPT-4o |
| Scraping | Cheerio (server-side HTML parsing) |
| Payments | Lemon Squeezy (subscription webhooks) |
| Deployment | Vercel (serverless) |
| Domain | Gabia (coldpitch.site) |

## Architecture

```
app/
├── api/
│   ├── auth/[...nextauth]/   # Auth.js endpoints
│   ├── generate/              # Email generation (scrape → AI → response)
│   ├── history/               # User's past generations
│   └── lemon/                 # Checkout + webhook + portal
├── dashboard/                 # User dashboard (history, subscription)
├── page.tsx                   # Landing page
├── layout.tsx                 # Root layout + SEO metadata
├── opengraph-image.tsx        # Dynamic OG image (Edge Runtime)
├── robots.ts                  # robots.txt
└── sitemap.ts                 # sitemap.xml

components/
├── EmailForm.tsx              # URL + product input form
├── EmailResult.tsx            # Generated email cards
├── Header.tsx                 # Navigation bar
├── PricingSection.tsx         # Pricing plans
├── HowItWorks.tsx             # 3-step explanation
├── FAQ.tsx                    # Frequently asked questions
├── HistoryList.tsx            # Past generation list
├── SubscriptionCard.tsx       # Pro plan management
└── Providers.tsx              # Session provider wrapper

lib/
├── scraper.ts                 # Website scraping (main + /about page)
├── prompt.ts                  # AI prompt engineering (9 rules)
├── openai.ts                  # OpenAI API integration
├── auth.ts                    # Auth.js configuration
├── rateLimit.ts               # DB-based rate limiting
├── lemonsqueezy.ts            # Payment integration
├── subscription.ts            # Subscription status helpers
└── prisma.ts                  # Prisma client singleton
```

## Database Schema

```
User ──┬── Account (OAuth)
       ├── Session
       ├── Subscription (1:1, Lemon Squeezy)
       └── EmailHistory (1:N)

UsageLog (rate limiting by userId or IP + date)
```

## How It Works

1. User pastes a target company URL + describes their product
2. Server scrapes the target website (main page + /about)
3. Scraped content + product description → GPT-4o with engineered prompt
4. AI generates 3 emails with different angles:
   - **Observation** — References a specific feature from their site
   - **Proof** — Leads with sender's credibility, connects to target's pain point
   - **One-liner** — Single sharp question + teaser

## Rate Limiting

| Tier | Daily Limit |
|------|------------|
| Anonymous | 3 |
| Free (logged in) | 5 |
| Pro (subscriber) | Unlimited |

Rate limiting is DB-based (not in-memory) for serverless compatibility.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- OpenAI API key
- Google OAuth credentials
- Lemon Squeezy account (for payments)

### Setup

```bash
git clone https://github.com/jinhyuk9714/ColdPitch.git
cd ColdPitch
npm install
```

Create `.env.local`:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="openssl rand -base64 32"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
OPENAI_API_KEY="sk-..."
LEMONSQUEEZY_API_KEY="..."
LEMONSQUEEZY_STORE_ID="..."
LEMONSQUEEZY_VARIANT_ID="..."
LEMONSQUEEZY_WEBHOOK_SECRET="..."
```

```bash
npx prisma db push
npm run dev
```

## License

MIT
