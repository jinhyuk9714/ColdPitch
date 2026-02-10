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

export async function generateEmails(
  siteContent: string,
  myProduct: string,
  tone: Tone
): Promise<GenerateResult> {
  const prompt = buildPrompt(siteContent, myProduct, tone);

  const response = await getClient().chat.completions.create({
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

  return JSON.parse(content) as GenerateResult;
}
