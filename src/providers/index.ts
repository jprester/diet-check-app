import type { AnalysisResult, DietProfile, Settings } from '../types';
import { DIET_PROFILES, DEFAULT_DIET_ID } from '../types';

function getDietProfile(dietId: string): DietProfile {
  return DIET_PROFILES.find(d => d.id === dietId) || DIET_PROFILES.find(d => d.id === DEFAULT_DIET_ID)!;
}

function buildSystemPrompt(diet: DietProfile): string {
  const [label1, label2, label3] = diet.scoreLabels;
  return `${diet.systemPrompt}

JSON structure:
{
  "verdict": "good" | "ok" | "avoid",
  "verdictLabel": "short label e.g. Great choice / Eat with caution / Avoid",
  "verdictTitle": "one-line summary of what this food is",
  "score1": 0-10 (${label1} — 0=best, 10=worst),
  "score2": 0-10 (${label2} — 0=best, 10=worst),
  "score3": 0-10 (${label3} — 0=best, 10=worst),
  "analysis": "2-3 sentence plain-language explanation of why this is good, ok, or bad for this specific diet",
  "goodFactors": ["list", "of", "positive", "aspects"],
  "badFactors": ["list", "of", "concerns"],
  "tip": "One concrete ordering/eating tip to make this as diet-friendly as possible, or a better alternative if it should be avoided."
}`;
}

function getUserPrompt(diet: DietProfile, text?: string): string {
  return text
    ? `${diet.userPromptPrefix}: ${text}`
    : `${diet.userPromptPrefix}.`;
}

function parseResult(raw: string): AnalysisResult {
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);

  // Support legacy responses that use fatScore/carbScore/trigRisk
  if (parsed.fatScore !== undefined && parsed.score1 === undefined) {
    parsed.score1 = parsed.fatScore ?? 0;
    parsed.score2 = parsed.carbScore ?? 0;
    parsed.score3 = parsed.trigRisk ?? 0;
  }

  return parsed;
}

function buildMessages(provider: string, imageBase64: string | null, text: string, diet: DietProfile) {
  const prompt = getUserPrompt(diet, text || undefined);

  if (provider === 'anthropic') {
    const content: Array<Record<string, unknown>> = [];
    if (imageBase64) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
      });
    }
    content.push({ type: 'text', text: prompt });
    return [{ role: 'user', content }];
  }

  // OpenRouter uses OpenAI-style format
  const content: Array<Record<string, unknown>> = [];
  if (imageBase64) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
    });
  }
  content.push({ type: 'text', text: prompt });
  return [{ role: 'user', content }];
}

async function fetchMockResponse(): Promise<AnalysisResult> {
  const response = await fetch('/mock-responses.json');
  if (!response.ok) throw new Error(`Failed to load mock responses: ${response.status} ${response.statusText}`);
  const responses: AnalysisResult[] = await response.json();
  if (!Array.isArray(responses) || responses.length === 0) {
    throw new Error('Mock responses file is empty or invalid');
  }
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function analyzeFood(
  settings: Settings,
  imageBase64: string | null,
  text: string,
): Promise<AnalysisResult> {
  if (import.meta.env.VITE_MOCK_API === 'true') {
    return fetchMockResponse();
  }

  const diet = getDietProfile(settings.dietId);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

  const response = await fetch(`${baseUrl}/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      provider: settings.provider,
      model: settings.model,
      system: buildSystemPrompt(diet),
      messages: buildMessages(settings.provider, imageBase64, text, diet),
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return parseResult(data.response);
}
