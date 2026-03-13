import type { AnalysisResult, Settings } from '../types';
import { SYSTEM_PROMPT, getUserPrompt, parseResult } from './index';

export async function analyzeWithOpenAI(
  settings: Settings,
  imageBase64: string | null,
  text: string,
): Promise<AnalysisResult> {
  const userContent: Array<Record<string, unknown>> = [];

  if (imageBase64) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
    });
  }

  userContent.push({ type: 'text', text: getUserPrompt(text || undefined) });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content;
  return parseResult(raw);
}
