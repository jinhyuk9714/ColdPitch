import OpenAI from 'openai';
import { buildPrompt, Tone } from './prompt';

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface GenerateResult {
  company: {
    name: string;
    description: string;
    keyPoints: string[];
  };
  emails: Array<{
    id: number;
    label: string;
    subject: string;
    body: string;
  }>;
}

const BANNED_PATTERNS = [
  /\bimpressive\b/i,
  /\bexcited\b/i,
  /\bstreamlin(e|es|ing)\b/i,
  /\benhance[sd]?\b/i,
  /\brevolutioniz(e|es|ing)\b/i,
  /\brevolutionary\b/i,
  /\boptimiz(e|es|ing)\b/i,
  /\bempower\b/i,
  /\bleverage[sd]?\b/i,
  /\bgame.?changer\b/i,
  /\bseamless(ly)?\b/i,
  /\bensur(e|es|ing)\b/i,
  /falls? through the cracks/i,
  /slips? through the cracks/i,
  /I came across/i,
  /I noticed that/i,
  /Would you be open to/i,
  /Let's schedule/i,
  /Let's explore/i,
  /I'd love to/i,
  /Best regards/i,
  /Looking forward to/i,
  /drop mic/i,
];

const EMAIL_LABELS = ['Observation', 'Proof', 'One-liner'];

function findViolations(result: GenerateResult): string[] {
  const violations: string[] = [];
  for (const email of result.emails) {
    const text = `${email.subject} ${email.body}`;
    for (const pattern of BANNED_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        violations.push(`Email ${email.id}: contains "${match[0]}" — replace with a different word`);
      }
    }
    if (!email.body || email.body.trim() === '') {
      violations.push(`Email ${email.id}: body is empty — must contain the full email text`);
    }
  }
  return violations;
}

function normalizeResult(result: GenerateResult): GenerateResult {
  // Ensure all emails have required fields
  result.emails = result.emails.map((email, i) => ({
    id: email.id ?? i + 1,
    label: email.label ?? EMAIL_LABELS[i] ?? `Email ${i + 1}`,
    subject: email.subject ?? '',
    body: email.body ?? '',
  }));
  return result;
}

export async function generateEmails(
  siteContent: string,
  myProduct: string,
  tone: Tone
): Promise<GenerateResult> {
  const client = getClient();
  const prompt = buildPrompt(siteContent, myProduct, tone);

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  let result = normalizeResult(JSON.parse(content) as GenerateResult);
  const violations = findViolations(result);

  // If violations found, retry once with explicit correction
  if (violations.length > 0) {
    const fixPrompt = `Your output had these issues:\n${violations.join('\n')}\n\nRewrite the emails fixing those issues. Keep the company info, keyPoints, all labels (Observation/Proof/One-liner), and overall structure identical. Only change the specific words/phrases flagged above.\n\nReturn the complete JSON with all fields including id, label, subject, body for each email.`;

    const retryResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: content },
        { role: 'user', content: fixPrompt },
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const retryContent = retryResponse.choices[0].message.content;
    if (retryContent) {
      result = normalizeResult(JSON.parse(retryContent) as GenerateResult);
    }
  }

  return result;
}
