export type Tone = 'casual' | 'professional' | 'bold';

export function buildPrompt(
  siteContent: string,
  myProduct: string,
  tone: Tone
): string {
  const toneGuide: Record<Tone, string> = {
    casual:
      'Write like a friendly peer. Use conversational language. Short sentences. No corporate jargon.',
    professional:
      'Write in a professional but warm tone. Clear and concise. Respectful of their time.',
    bold: 'Write with confidence and urgency. Lead with a provocative insight or statistic. Be direct.',
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
