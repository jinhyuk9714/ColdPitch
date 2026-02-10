export type Tone = 'casual' | 'professional' | 'bold';

export function buildPrompt(
  siteContent: string,
  myProduct: string,
  tone: Tone
): string {
  const toneGuide = {
    casual: `
      - Write like texting a smart friend you respect
      - Use "I" and "you", contractions allowed
      - One short question at the end, no formal CTA
      - Example closing: "Curious if this resonates?" or "Worth exploring?"`,
    professional: `
      - Warm but direct. No corporate fluff
      - Respect their time — get to the point in sentence 1
      - End with a low-friction ask (not "schedule a call")
      - Example closing: "Happy to share a 2-min demo if useful."`,
    bold: `
      - Lead with a provocative observation or contrarian take
      - Challenge their current approach (respectfully)
      - Be specific and opinionated
      - Example closing: "If I'm wrong, ignore this. If not, reply and I'll show you."`
  };

  return `You are a world-class cold email copywriter. You write emails that actually get replies — not emails that get deleted.

## CONTEXT
You will analyze a target company's website content, then write 3 cold emails from someone who wants to sell them a product/service.

## TARGET COMPANY WEBSITE
${siteContent}

## WHAT THE SENDER IS SELLING
${myProduct}

## TONE
${toneGuide[tone]}

## CRITICAL RULES

### Rule 1: SPECIFICITY IS EVERYTHING
Your email MUST reference at least 2 specific details ONLY findable on their website. Not generic industry observations.

BAD (generic): "Managing design assets across teams can be challenging."
GOOD (specific): "I saw Figma just shipped multi-edit for components — that's a huge unlock for design systems teams."

BAD: "Your platform helps businesses grow."
GOOD: "I noticed your case study with Acme Corp mentions 40% faster onboarding."

### Rule 2: BANNED PHRASES (instant spam filter)
NEVER use any of these — they trigger spam filters and make the reader's eyes glaze over:
- "I hope this email finds you well"
- "Would you be open to a quick chat"
- "Let's schedule a time"
- "I'd love to connect"
- "I came across your company"
- "I was impressed by"
- "Streamline your [anything]"
- "Enhance your [anything]"  
- "Revolutionize your [anything]"
- "Take your [X] to the next level"
- "In today's fast-paced world"
- "As a leader in [industry]"
- "Synergy", "leverage", "optimize", "empower"
- "Best regards" (use just your name or "– [Your Name]")

### Rule 3: LENGTH
- Pain Point email: MAX 80 words body
- Value Prop email: MAX 100 words body
- Short & Direct email: MAX 50 words body
- Subject lines: MAX 5 words. Lowercase. No clickbait.

### Rule 4: EACH EMAIL MUST BE GENUINELY DIFFERENT
- Email 1 "Observation": Start with something specific you noticed on their site that hints at a problem. Connect your product as a natural solution. Do NOT pitch — just spark curiosity.
- Email 2 "Proof": Lead with a concrete result (number, stat, outcome) your product achieved for a similar company. Then connect it to their specific situation.
- Email 3 "One-liner": 2-3 sentences max. Ask one sharp question that makes them think. No pitch, no explanation.

### Rule 5: SUBJECT LINES THAT GET OPENED
- Lowercase, casual, 2-5 words
- Should feel like it's from a colleague, not a salesperson
- Examples: "quick figma thought", "re: your pricing page", "noticed something", "random idea"

### Rule 6: NATURAL ENDING
- Never end with a formal CTA paragraph
- Last line should feel like a natural conversation ending
- Good: "Curious if you've thought about this?" / "Worth a look?" / "Happy to share more if useful."
- Bad: "Would you be available for a 15-minute call next Tuesday?"

## OUTPUT FORMAT
Return ONLY valid JSON. No markdown, no backticks, no explanation.

{
  "company": {
    "name": "exact company name from website",
    "description": "what they do in under 15 words",
    "keyPoints": ["specific thing 1 from site", "specific thing 2", "specific thing 3"]
  },
  "emails": [
    {
      "id": 1,
      "label": "Observation",
      "subject": "lowercase 2-5 word subject",
      "body": "email body here (max 80 words)"
    },
    {
      "id": 2,
      "label": "Proof",
      "subject": "lowercase 2-5 word subject",
      "body": "email body here (max 100 words)"
    },
    {
      "id": 3,
      "label": "One-liner",
      "subject": "lowercase 2-5 word subject",
      "body": "email body here (max 50 words)"
    }
  ]
}`;
}