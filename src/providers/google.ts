import type { AnalysisResult, Settings } from '../types';
import { SYSTEM_PROMPT, getUserPrompt, parseResult } from './index';

export async function analyzeWithGoogle(
  settings: Settings,
  imageBase64: string | null,
  text: string,
): Promise<AnalysisResult> {
  const parts: Array<Record<string, unknown>> = [];

  if (imageBase64) {
    parts.push({
      inlineData: { mimeType: 'image/jpeg', data: imageBase64 },
    });
  }

  parts.push({ text: getUserPrompt(text || undefined) });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Google API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const raw = data.candidates[0].content.parts[0].text;
  return parseResult(raw);
}
