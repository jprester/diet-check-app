import type { AnalysisResult, Settings } from '../types';
import { analyzeWithAnthropic } from './anthropic';
import { analyzeWithOpenAI } from './openai';
import { analyzeWithGoogle } from './google';

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

export function getUserPrompt(text?: string): string {
  return text
    ? `Analyze this food for my low-fat, low-carb, triglyceride-reduction diet: ${text}`
    : 'Analyze this food image for my low-fat, low-carb, triglyceride-reduction diet.';
}

export async function analyzeFood(
  settings: Settings,
  imageBase64: string | null,
  text: string,
): Promise<AnalysisResult> {
  switch (settings.provider) {
    case 'anthropic':
      return analyzeWithAnthropic(settings, imageBase64, text);
    case 'openai':
      return analyzeWithOpenAI(settings, imageBase64, text);
    case 'google':
      return analyzeWithGoogle(settings, imageBase64, text);
  }
}

export function parseResult(raw: string): AnalysisResult {
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
