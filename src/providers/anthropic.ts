import type { AnalysisResult, Settings } from '../types';
import { SYSTEM_PROMPT, getUserPrompt, parseResult } from './index';

export async function analyzeWithAnthropic(
  settings: Settings,
  imageBase64: string | null,
  text: string,
): Promise<AnalysisResult> {
  const userContent: Array<Record<string, unknown>> = [];

  if (imageBase64) {
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
    });
  }

  userContent.push({ type: 'text', text: getUserPrompt(text || undefined) });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const raw = data.content.map((b: { text?: string }) => b.text || '').join('');
  return parseResult(raw);
}
