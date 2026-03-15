import type { AnalysisResult, Settings } from '../types';

export const SYSTEM_PROMPT = `You are a clinical dietitian specialized in lipid disorders, particularly high triglycerides.
The user is on a strict low-fat, low-carb diet to reduce elevated triglyceride levels.
Analyze any food, dish, menu item, or product they show or describe and respond ONLY with a JSON object — no preamble, no markdown fences.

JSON structure:
{
  "verdict": "good" | "ok" | "avoid",
  "verdictLabel": "short label e.g. Great choice / Eat with caution / Avoid",
  "verdictTitle": "one-line summary of what this food is",
  "fatScore": 0-10 (0=very low fat, 10=very high fat),
  "carbScore": 0-10 (0=very low carb, 10=very high carb),
  "trigRisk": 0-10 (0=helps lower triglycerides, 10=strongly raises them),
  "analysis": "2-3 sentence plain-language explanation of why this is good, ok, or bad for triglycerides specifically",
  "goodFactors": ["list", "of", "positive", "aspects"],
  "badFactors": ["list", "of", "concerns"],
  "tip": "One concrete ordering/eating tip to make this as diet-friendly as possible, or a better alternative if it should be avoided."
}`;

function getUserPrompt(text?: string): string {
  return text
    ? `Analyze this food for my low-fat, low-carb, triglyceride-reduction diet: ${text}`
    : 'Analyze this food image for my low-fat, low-carb, triglyceride-reduction diet.';
}

function parseResult(raw: string): AnalysisResult {
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function buildMessages(provider: string, imageBase64: string | null, text: string) {
  const prompt = getUserPrompt(text || undefined);

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
      system: SYSTEM_PROMPT,
      messages: buildMessages(settings.provider, imageBase64, text),
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
