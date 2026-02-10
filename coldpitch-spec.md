# ColdPitch — 프로젝트 스펙 문서

> "Paste a URL. Get a cold email. 30 seconds."

## 1. 제품 개요

### 한 줄 설명
상대방 회사 웹사이트 URL을 넣으면, AI가 사이트를 분석해서 맞춤 콜드이메일을 30초 안에 생성하는 웹 도구.

### 타겟 유저
- 솔로 파운더 / 인디해커
- 초기 스타트업 (세일즈팀 없음)
- 프리랜서
- **공통점:** 콜드이메일이 필요하지만, 기존 도구($49+)는 비싸고 복잡하다고 느끼는 사람들

### 경쟁 우위
| 항목 | 기존 도구 (Smartwriter, Lyne) | ColdPitch |
|---|---|---|
| 입력 | CSV + LinkedIn URL + 이름 + 회사명 | **URL 하나** |
| 셋업 시간 | 30분~1시간 | **0분** |
| 가격 | $49~$299/월 | **무료 3건/일, $9/월** |
| 출력 | 첫 줄만 | **전체 이메일 3개 변형** |
| 발송 기능 | 내장 (복잡) | **없음 (복사해서 직접 보냄)** |

---

## 2. 핵심 기능 (MVP)

### 2.1 메인 플로우
```
[유저 입력]
  ├─ 상대 회사 URL (필수): https://example.com
  ├─ 내 제품/서비스 한 줄 설명 (필수): "AI 챗봇 SaaS"
  └─ 이메일 톤 (선택): Casual / Professional / Bold

        ↓

[백엔드 처리]
  ├─ 1단계: URL 스크래핑 → 텍스트 추출 (회사 소개, 서비스, About 등)
  ├─ 2단계: AI 분석 → 회사가 뭐 하는지, 핵심 가치, 잠재 페인 포인트 파악
  └─ 3단계: AI 생성 → 맞춤 콜드이메일 3개 변형

        ↓

[결과 화면]
  ├─ 이메일 변형 3개 (탭 or 카드)
  ├─ 각 이메일: Subject Line + Body
  ├─ 복사 버튼 (원클릭)
  └─ "Regenerate" 버튼
```

### 2.2 무료/유료 구분
- **비로그인 무료:** 하루 3건 (IP 기반 or localStorage 카운트)
- **유료 ($9/월):** 무제한 생성, 히스토리 저장, 톤 커스텀
- **결제:** Stripe Checkout

### 2.3 유저 인증
- Google OAuth (NextAuth.js)
- 무료 유저는 로그인 불필요

---

## 3. 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **shadcn/ui** (UI 컴포넌트)

### Backend (Next.js API Routes)
- **cheerio** — HTML 파싱 (정적 사이트)
- **puppeteer** — JS 렌더링 필요한 사이트용 폴백 (선택, MVP에서는 cheerio만)
- **OpenAI API** — GPT-4o-mini (이메일 생성)

### 인프라
- **Vercel** — 배포 (무료 티어)
- **Stripe** — 결제
- **NextAuth.js** — Google OAuth
- **Vercel KV** or **Upstash Redis** — 무료 유저 일일 사용량 추적

### 환경 변수
```env
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
STRIPE_PRICE_ID=price_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## 4. 프로젝트 구조

```
coldpitch/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 랜딩페이지 + 메인 입력 폼
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts        # 핵심: URL 스크래핑 + AI 이메일 생성
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts    # Google OAuth
│   │   └── stripe/
│   │       ├── checkout/
│   │       │   └── route.ts    # Stripe 결제 세션 생성
│   │       └── webhook/
│   │           └── route.ts    # Stripe 웹훅 (구독 상태 업데이트)
│   ├── dashboard/
│   │   └── page.tsx            # 유료 유저: 히스토리, 설정
│   └── pricing/
│       └── page.tsx            # 가격 페이지
├── components/
│   ├── EmailForm.tsx           # URL + 설명 입력 폼
│   ├── EmailResult.tsx         # 생성된 이메일 3개 표시
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PricingCard.tsx
│   └── CopyButton.tsx
├── lib/
│   ├── scraper.ts              # URL → 텍스트 추출
│   ├── openai.ts               # OpenAI API 호출
│   ├── prompt.ts               # 이메일 생성 프롬프트
│   ├── rateLimit.ts            # 무료 유저 일일 제한
│   └── stripe.ts               # Stripe 헬퍼
├── .env.local
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 5. 핵심 API: /api/generate

### Request
```json
POST /api/generate
{
  "url": "https://petshopcrm.com",
  "myProduct": "AI chatbot that handles customer support automatically",
  "tone": "professional"  // casual | professional | bold
}
```

### Response
```json
{
  "company": {
    "name": "PetShopCRM",
    "description": "CRM platform for pet stores",
    "keyPoints": ["booking management", "customer follow-ups", "small team"]
  },
  "emails": [
    {
      "id": 1,
      "label": "Pain Point Focus",
      "subject": "Quick question about PetShopCRM support",
      "body": "Hi [Name],\n\nI noticed PetShopCRM helps pet stores manage..."
    },
    {
      "id": 2,
      "label": "Value Proposition",
      "subject": "Idea for PetShopCRM customers",
      "body": "Hi [Name],\n\n..."
    },
    {
      "id": 3,
      "label": "Short & Direct",
      "subject": "70% fewer support tickets?",
      "body": "Hi [Name],\n\n..."
    }
  ]
}
```

### 처리 로직
```typescript
// /api/generate/route.ts 핵심 흐름
async function POST(req) {
  // 1. Rate limit 체크 (무료 유저 3건/일)
  // 2. URL 스크래핑
  const siteContent = await scrapeSite(url);  // cheerio
  // 3. AI 이메일 생성
  const emails = await generateEmails(siteContent, myProduct, tone);
  // 4. 응답
  return Response.json(emails);
}
```

---

## 6. 스크래핑 로직 (lib/scraper.ts)

```typescript
import * as cheerio from 'cheerio';

export async function scrapeSite(url: string): Promise<string> {
  // 1. 메인 페이지 fetch
  const html = await fetch(url).then(r => r.text());
  const $ = cheerio.load(html);

  // 2. 불필요한 요소 제거
  $('script, style, nav, footer, iframe, noscript').remove();

  // 3. 핵심 텍스트 추출
  const title = $('title').text();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const h1 = $('h1').map((_, el) => $(el).text()).get().join('. ');
  const bodyText = $('main, article, [role="main"], .content, #content, body')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000); // 토큰 절약을 위해 5000자 제한

  // 4. About 페이지도 시도
  let aboutText = '';
  try {
    const aboutUrl = new URL('/about', url).href;
    const aboutHtml = await fetch(aboutUrl).then(r => r.text());
    const $about = cheerio.load(aboutHtml);
    $about('script, style, nav, footer').remove();
    aboutText = $about('main, article, body').first().text()
      .replace(/\s+/g, ' ').trim().slice(0, 2000);
  } catch {}

  return `
    Website: ${url}
    Title: ${title}
    Description: ${metaDesc}
    Headlines: ${h1}
    Main Content: ${bodyText}
    About Page: ${aboutText}
  `.trim();
}
```

---

## 7. AI 프롬프트 (lib/prompt.ts)

```typescript
export function buildPrompt(
  siteContent: string,
  myProduct: string,
  tone: 'casual' | 'professional' | 'bold'
): string {
  const toneGuide = {
    casual: 'Write like a friendly peer. Use conversational language. Short sentences. No corporate jargon.',
    professional: 'Write in a professional but warm tone. Clear and concise. Respectful of their time.',
    bold: 'Write with confidence and urgency. Lead with a provocative insight or statistic. Be direct.'
  };

  return `You are an expert cold email copywriter who specializes in B2B outreach for indie hackers and solo founders.

## Your Task
Analyze the target company's website content below, then write 3 different cold email variations.

## Target Company Website Content
${siteContent}

## Sender's Product/Service
${myProduct}

## Tone
${toneGuide[tone]}

## Rules
1. Each email must reference SPECIFIC details from the company's website (not generic)
2. Keep each email under 150 words
3. Include a clear, non-pushy call-to-action
4. Use [Name] as placeholder for recipient name
5. Subject lines must be under 60 characters
6. Never use "I hope this email finds you well" or similar clichés
7. Focus on the VALUE you bring to THEIR specific situation
8. Each variation should use a different angle:
   - Email 1: Pain Point Focus (identify a specific challenge they likely face)
   - Email 2: Value Proposition (lead with a concrete benefit)
   - Email 3: Short & Direct (under 80 words, get straight to the point)

## Output Format
Return ONLY valid JSON (no markdown, no backticks):
{
  "company": {
    "name": "detected company name",
    "description": "one-line summary of what they do",
    "keyPoints": ["point1", "point2", "point3"]
  },
  "emails": [
    {
      "id": 1,
      "label": "Pain Point Focus",
      "subject": "subject line here",
      "body": "email body here"
    },
    {
      "id": 2,
      "label": "Value Proposition",
      "subject": "subject line here",
      "body": "email body here"
    },
    {
      "id": 3,
      "label": "Short & Direct",
      "subject": "subject line here",
      "body": "email body here"
    }
  ]
}`;
}
```

---

## 8. OpenAI API 호출 (lib/openai.ts)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmails(
  siteContent: string,
  myProduct: string,
  tone: 'casual' | 'professional' | 'bold'
) {
  const prompt = buildPrompt(siteContent, myProduct, tone);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}
```

---

## 9. 랜딩페이지 구조

### Hero Section
```
[ColdPitch 로고]

Paste a URL.
Get a cold email.
30 seconds.

AI가 상대 회사 웹사이트를 분석해서
맞춤 콜드이메일을 즉시 생성합니다.

[URL 입력 폼] ← 여기에 바로 입력 가능
[내 제품 설명 입력]
[Generate ▶ 버튼]
```

### 결과 섹션
```
┌──────────────────────────────────┐
│ 🏢 PetShopCRM                    │
│ CRM platform for pet stores      │
│ Key: booking, follow-ups, small  │
└──────────────────────────────────┘

[Pain Point] [Value Prop] [Short & Direct]  ← 탭 전환

┌──────────────────────────────────┐
│ Subject: Quick question about... │
│                                  │
│ Hi [Name],                       │
│                                  │
│ I noticed PetShopCRM helps pet   │
│ stores manage customer...        │
│                                  │
│              [📋 Copy] [🔄 Redo] │
└──────────────────────────────────┘
```

### 추가 섹션
- How it works (3단계 설명)
- Pricing (무료 vs $9/월)
- FAQ

---

## 10. 디자인 가이드

### 색상
- Primary: #6366F1 (Indigo-500)
- Background: #0F172A (Slate-900) — 다크 테마
- Card: #1E293B (Slate-800)
- Text: #F8FAFC (Slate-50)
- Accent: #22D3EE (Cyan-400)

### 폰트
- Headings: Inter (Bold)
- Body: Inter (Regular)
- Code/Email: JetBrains Mono or monospace

### 느낌
- 다크 모드 기본
- 깔끔하고 미니멀
- 인디해커 감성 (Linear, Vercel 스타일)

---

## 11. 1주일 타임라인

| Day | 작업 | 산출물 |
|-----|------|--------|
| 1 | 프로젝트 셋업 + 랜딩페이지 | Next.js 프로젝트 + 히어로/폼 UI |
| 2 | 스크래핑 + AI 생성 API | /api/generate 완성 |
| 3 | 결과 UI + 복사 기능 | 전체 플로우 동작 |
| 4 | Stripe 결제 + 사용량 제한 | 무료/유료 구분 |
| 5 | UI 다듬기 + 프롬프트 튜닝 | 이메일 품질 개선 |
| 6 | Vercel 배포 + 테스트 | 라이브 URL |
| 7 | Reddit 런칭 | r/SideProject, r/SaaS 포스트 |

---

## 12. 런칭 후 우선순위

1. 유저 피드백 → 프롬프트 개선
2. LinkedIn 프로필 URL 지원 추가
3. 이메일 히스토리 저장 (유료)
4. Chrome Extension (URL 바에서 바로 생성)
5. 시퀀스 생성 (초기 + 팔로업 2~3개)
