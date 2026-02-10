# ColdPitch — Claude Code 초기 프롬프트

아래 프롬프트를 Claude Code에 그대로 복붙하세요.

---

## 프롬프트 시작

```
ColdPitch라는 SaaS 웹앱을 만들어줘. "URL을 넣으면 AI가 맞춤 콜드이메일을 생성하는 도구"야.

## 기술 스택
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- OpenAI API (gpt-4o-mini)
- cheerio (웹 스크래핑)
- Stripe (결제)
- NextAuth.js (Google OAuth)

## 핵심 기능

### 1. 메인 페이지 (app/page.tsx)
랜딩페이지 겸 메인 도구. 다크테마 (배경 #0F172A, 카드 #1E293B, 텍스트 #F8FAFC, 포인트색 #6366F1 인디고).

Hero 섹션:
- 헤드라인: "Paste a URL. Get a cold email. 30 seconds."
- 서브: "AI analyzes their website and crafts personalized cold emails instantly."
- 바로 아래에 입력 폼 배치 (별도 페이지 이동 없이 바로 사용)

입력 폼 (components/EmailForm.tsx):
- URL 입력 (필수, placeholder: "https://their-company.com")
- 내 제품 설명 (필수, placeholder: "e.g. AI chatbot that handles customer support")
- 톤 선택 (Casual / Professional / Bold) - 버튼 3개 토글
- [Generate Cold Email] 버튼 (인디고 색, 로딩 시 스피너)

결과 영역 (components/EmailResult.tsx):
- 상단: 분석된 회사 정보 카드 (이름, 한 줄 설명, 키포인트 태그)
- 탭 3개: "Pain Point" / "Value Prop" / "Short & Direct"
- 각 탭: Subject Line + Email Body 표시
- [📋 Copy] 버튼 (클릭 시 "Copied!" 피드백)
- [🔄 Regenerate] 버튼

추가 섹션 (스크롤 아래):
- "How it works" (3단계: Paste URL → AI Analyzes → Get Emails)
- Pricing (Free: 3/day, Pro $9/mo: unlimited)
- 간단한 FAQ 3~4개

### 2. API: /api/generate (app/api/generate/route.ts)
POST 요청. body: { url, myProduct, tone }

처리 흐름:
1. Rate limit 체크 (IP 기반, 무료 유저 하루 3건)
2. cheerio로 URL 스크래핑:
   - script, style, nav, footer, iframe 제거
   - title, meta description, h1, main body 텍스트 추출 (5000자 제한)
   - /about 페이지도 시도 (실패해도 OK)
3. OpenAI API 호출 (gpt-4o-mini):
   - response_format: { type: 'json_object' }
   - temperature: 0.8
   - 프롬프트: 타겟 회사 분석 + 콜드이메일 3개 변형 생성
4. JSON 파싱해서 응답

응답 형태:
{
  "company": { "name": "", "description": "", "keyPoints": [] },
  "emails": [
    { "id": 1, "label": "Pain Point Focus", "subject": "", "body": "" },
    { "id": 2, "label": "Value Proposition", "subject": "", "body": "" },
    { "id": 3, "label": "Short & Direct", "subject": "", "body": "" }
  ]
}

### 3. AI 프롬프트 (lib/prompt.ts)
콜드이메일 생성 프롬프트. 핵심 규칙:
- 이메일마다 반드시 웹사이트에서 발견한 구체적 디테일 포함
- 각 이메일 150단어 이내
- Subject line 60자 이내
- "I hope this email finds you well" 같은 클리셰 금지
- 수신자 이름은 [Name] 플레이스홀더
- 3개 변형: Pain Point / Value Prop / Short & Direct
- 톤 가이드: casual(친구처럼), professional(격식 있지만 따뜻), bold(자신감 + 직접적)

### 4. Rate Limiting (lib/rateLimit.ts)
- 간단하게 in-memory Map으로 IP별 일일 카운트
- 무료 유저: 3건/일
- 유료 유저: 무제한
- 자정에 리셋

### 5. 프로젝트 구조
coldpitch/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   └── pricing/
│       └── page.tsx
├── components/
│   ├── EmailForm.tsx
│   ├── EmailResult.tsx
│   ├── Header.tsx
│   ├── HowItWorks.tsx
│   ├── PricingSection.tsx
│   └── FAQ.tsx
├── lib/
│   ├── scraper.ts
│   ├── openai.ts
│   ├── prompt.ts
│   └── rateLimit.ts
├── .env.local
├── package.json
└── tailwind.config.ts

## 디자인 스타일
- Linear/Vercel 느낌의 미니멀 다크 테마
- 색상: 배경 slate-900, 카드 slate-800, 포인트 indigo-500, 액센트 cyan-400
- 폰트: Inter (기본 sans-serif 사용)
- 이메일 결과 영역만 monospace 폰트
- 부드러운 그림자, rounded-xl, 적절한 애니메이션 (fade-in)
- 모바일 반응형

## MVP 우선순위 (Stripe/Auth는 나중에)
1단계로 먼저 이것만 만들어줘:
- 랜딩페이지 UI 전체
- /api/generate API (스크래핑 + AI 생성)
- 결과 표시 + 복사 기능
- 환경변수는 OPENAI_API_KEY만 있으면 동작

Stripe 결제, Google OAuth, 대시보드는 2단계에서 추가할 거야.
프로젝트 생성부터 시작해줘.
```

---

## 사용 방법

1. 터미널에서 `claude` 실행
2. 위 프롬프트 전체를 복붙
3. Claude Code가 프로젝트 생성 + 코드 작성 시작
4. `.env.local`에 `OPENAI_API_KEY` 추가
5. `npm run dev`로 로컬 테스트
6. 동작 확인 후 `vercel` 명령어로 배포

## 2단계 추가 프롬프트 (MVP 완성 후)

```
ColdPitch에 다음 기능을 추가해줘:

1. NextAuth.js로 Google OAuth 로그인 추가
2. Stripe Checkout으로 $9/월 구독 결제
3. 로그인 유저의 이메일 생성 히스토리 저장 (Vercel KV 또는 로컬 JSON)
4. /dashboard 페이지: 히스토리 목록 + 구독 상태 표시
5. Rate limit을 로그인 상태와 연동:
   - 비로그인: 3건/일 (IP 기반)
   - 무료 로그인: 5건/일
   - Pro 구독: 무제한
```

## 3단계 추가 프롬프트 (런칭 후)

```
ColdPitch에 다음을 추가해줘:

1. LinkedIn 프로필 URL도 지원 (회사 URL 외에 개인 LinkedIn URL 입력 가능)
2. 이메일 시퀀스 생성: 초기 이메일 + 3일 후 팔로업 + 7일 후 최종 팔로업
3. Chrome Extension: 현재 보고 있는 웹사이트에서 버튼 하나로 ColdPitch 호출
```
