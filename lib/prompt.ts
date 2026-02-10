export type Tone = 'casual' | 'professional' | 'bold';

export function buildPrompt(
  siteContent: string,
  myProduct: string,
  tone: Tone
): string {
  // Check if sender provided any numbers/stats
  const hasStats = /\d/.test(myProduct);

  const toneGuide = {
    casual: `CASUAL — like a DM, not an email. Fragmented. Informal. Human.
Contractions required. Short punchy sentences. "Hey —" or "So..." openers OK.
End with a short question. Never a CTA.

EXAMPLE (match this vibe, don't copy):
  Subject: your new api
  Hey — saw you shipped a GraphQL endpoint but the docs still show REST examples only. We auto-gen docs from schema files. One of our users set it up in 10 min. Want me to send a sample?`,

    professional: `PROFESSIONAL — direct, warm, no fluff. First sentence = the point.
Respectful of their time. Specific, not generic. Ends with a soft ask.

EXAMPLE (match this vibe, don't copy):
  Subject: failed payments
  Your subscription tiers went live last month — but failed card retries still hit a generic error page. We auto-retry with smart timing and win back about 1 in 5 failed charges. Happy to show what it'd look like on your stack.`,

    bold: `BOLD — confrontational. Start by pointing out something they're doing wrong.
No compliments. No softening. Open with a problem, not a feature.
Pattern: "[Problem statement]. [Why it's costing them]. [What you do about it]. [Short closer]."
If your email could pass as "professional", it's not bold enough.

EXAMPLE (match this vibe, don't copy):
  Subject: your pricing is broken
  Flat pricing across all tiers? That's costing you money. Enterprise customers pay the same as solo devs — you haven't segmented. We build usage-based billing in a day. Blunt, but worth knowing.`
  };

  return `You write cold emails that get replies. Not spam. Not templates. Real emails a human would actually read.

## INPUT DATA

### Target company website:
${siteContent}

### Sender's product/service:
${myProduct}

### Tone:
${toneGuide[tone]}

## INSTRUCTIONS

### Step 1: Extract 3 DIFFERENT aspects from the target website
Before writing, find:
- Aspect A: One specific feature, tool, or product they built
- Aspect B: Who they sell to or how their business works
- Aspect C: Something they recently changed, a bold claim, or a visible gap

Put these in "keyPoints". Each email uses ONE different aspect.

### Step 2: Write 3 emails

**Email 1 "Observation" (Aspect A, max 80 words):**
Open directly with the feature itself — NOT with the company name. Never start with "[Company]'s [feature]..." — instead describe what you saw.
BAD opener: "Basecamp's project pages organize tasks well."
GOOD opener: "The project page layout puts tasks, docs, and chat in one view."
Then connect the sender's product in 1-2 sentences.

**Email 2 "Proof" (Aspect B, max 100 words):**
Lead with something concrete from the sender's product description. Then connect it to a pain point the target's customers probably face.${hasStats ? '' : '\n⚠️ The sender gave NO numbers. Do NOT invent any. Describe the problem qualitatively.'}

**Email 3 "One-liner" (Aspect C, max 40 words):**
The body has exactly 2 parts: (1) One sharp question about their site. (2) One teaser under 10 words.
The subject is 2-5 words. The body is the full message. NEVER put the message in the subject.

GOOD: subject: "after the meeting" / body: "Your scheduling handles the booking — but what happens to the notes after? We auto-sync them."
BAD: subject: (entire message here) / body: "" ← WRONG, body must contain the email text

### Step 3: Self-check before outputting

Scan each email. If ANY of these appear, rewrite:
- Words: impressive, excited, streamline, enhance, revolutionize, revolutionary, optimize, empower, leverage, game changer, seamless, ensuring
- Phrases: "I came across", "I noticed", "I see that", "nothing falls through the cracks", "imagine the impact", "Would you be open to", "Let's schedule", "Let's explore", "I'd love to", "As a leader in", "Best regards", "Looking forward to", "Let me know if", "help teams ship faster", "without the manual hassle"
- Patterns: opening with "[Company]'s ...", any fabricated number, any CTA asking for a call/meeting
- Subject line: must be lowercase, 2-5 words, specific. Never "quick thought" or "random idea"
- Last line: casual. Never formal. Never a CTA.

Also verify: Does each email use a DIFFERENT aspect from keyPoints? If not, fix it.

## OUTPUT
Return ONLY valid JSON. Every "body" MUST contain the full email text (never empty). Subject is always short (2-5 words).

{
  "company": {
    "name": "company name from website",
    "description": "what they do in under 15 words",
    "keyPoints": ["aspect A", "aspect B", "aspect C"]
  },
  "emails": [
    {"id": 1, "label": "Observation", "subject": "short subject", "body": "full email text here"},
    {"id": 2, "label": "Proof", "subject": "short subject", "body": "full email text here"},
    {"id": 3, "label": "One-liner", "subject": "short subject", "body": "question + teaser here"}
  ]
}`;
}
