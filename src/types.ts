export interface AnalysisResult {
  verdict: "good" | "ok" | "avoid";
  verdictLabel: string;
  verdictTitle: string;
  score1: number;
  score2: number;
  score3: number;
  analysis: string;
  goodFactors: string[];
  badFactors: string[];
  tip: string;
}

export interface HistoryItem {
  id: string;
  label: string;
  verdict: "good" | "ok" | "avoid";
  verdictLabel: string;
  time: string;
  thumb: string | null;
  result: AnalysisResult;
  dietId?: string;
}

export type LLMProvider = "anthropic" | "openrouter";
export type Theme = "light" | "dark" | "system";

export interface Settings {
  provider: LLMProvider;
  model: string;
  theme: Theme;
  dietId: string;
}

export interface DietProfile {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  chipText: string;
  scoreLabels: [string, string, string];
  systemPrompt: string;
  userPromptPrefix: string;
}

export const DIET_PROFILES: DietProfile[] = [
  {
    id: "triglyceride",
    name: "Triglyceride Reduction",
    emoji: "🫀",
    subtitle: "Triglyceride-Aware Diet Helper",
    description: "Low-fat, low-carb focus to reduce elevated triglyceride levels.",
    chipText: "Low-fat · Low-carb · Triglyceride reduction",
    scoreLabels: ["Fat", "Carbs", "Trig risk"],
    systemPrompt: `You are a clinical dietitian specialized in lipid disorders, particularly high triglycerides.
The user is on a strict low-fat, low-carb diet to reduce elevated triglyceride levels.
Analyze any food, dish, menu item, or product they show or describe and respond ONLY with a JSON object — no preamble, no markdown fences.`,
    userPromptPrefix: "Analyze this food for my low-fat, low-carb, triglyceride-reduction diet",
  },
  {
    id: "keto",
    name: "Keto / Low-Carb",
    emoji: "🥑",
    subtitle: "Keto & Low-Carb Diet Helper",
    description: "High-fat, very low-carb diet for ketosis and metabolic health.",
    chipText: "High-fat · Very low-carb · Ketosis",
    scoreLabels: ["Net carbs", "Fat quality", "Keto fit"],
    systemPrompt: `You are a nutrition expert specialized in ketogenic and low-carbohydrate diets.
The user follows a strict keto diet (under 20-30g net carbs/day) to maintain nutritional ketosis.
Analyze any food, dish, menu item, or product they show or describe and respond ONLY with a JSON object — no preamble, no markdown fences.`,
    userPromptPrefix: "Analyze this food for my ketogenic low-carb diet",
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    emoji: "🫒",
    subtitle: "Mediterranean Diet Helper",
    description: "Whole foods, healthy fats, and plant-forward eating for longevity.",
    chipText: "Whole foods · Healthy fats · Plant-forward",
    scoreLabels: ["Whole food", "Healthy fats", "Med score"],
    systemPrompt: `You are a nutrition expert specialized in the Mediterranean diet and lifestyle.
The user follows a Mediterranean diet emphasizing whole grains, legumes, fruits, vegetables, olive oil, fish, and moderate wine — while limiting red meat, processed foods, and refined sugars.
Analyze any food, dish, menu item, or product they show or describe and respond ONLY with a JSON object — no preamble, no markdown fences.`,
    userPromptPrefix: "Analyze this food for my Mediterranean diet",
  },
  {
    id: "diabetic",
    name: "Diabetic-Friendly",
    emoji: "🩸",
    subtitle: "Diabetic-Friendly Diet Helper",
    description: "Blood sugar management through low-glycemic, balanced eating.",
    chipText: "Low-glycemic · Blood sugar · Balanced carbs",
    scoreLabels: ["Glycemic load", "Carb impact", "Sugar risk"],
    systemPrompt: `You are a clinical dietitian specialized in diabetes management and glycemic control.
The user manages diabetes (type 2) through diet and needs to keep blood sugar stable. They focus on low-glycemic foods, controlled carbohydrate intake, and balanced meals.
Analyze any food, dish, menu item, or product they show or describe and respond ONLY with a JSON object — no preamble, no markdown fences.`,
    userPromptPrefix: "Analyze this food for my diabetic-friendly, blood-sugar-management diet",
  },
  {
    id: "heart-healthy",
    name: "Heart-Healthy",
    emoji: "❤️",
    subtitle: "Heart-Healthy Diet Helper",
    description: "Low sodium, low saturated fat for cardiovascular wellness.",
    chipText: "Low sodium · Low sat-fat · Heart wellness",
    scoreLabels: ["Sat fat", "Sodium", "Heart risk"],
    systemPrompt: `You are a clinical dietitian specialized in cardiovascular health and heart-healthy nutrition.
The user follows a heart-healthy diet to reduce cardiovascular risk — limiting saturated fat, trans fat, sodium, and cholesterol while emphasizing fiber, omega-3s, and plant-based foods.
Analyze any food, dish, menu item, or product they show or describe and respond ONLY with a JSON object — no preamble, no markdown fences.`,
    userPromptPrefix: "Analyze this food for my heart-healthy, cardiovascular wellness diet",
  },
  {
    id: "general",
    name: "General Healthy",
    emoji: "🥗",
    subtitle: "General Nutrition Helper",
    description: "Balanced nutrition, whole foods, and mindful eating.",
    chipText: "Balanced · Whole foods · Mindful eating",
    scoreLabels: ["Nutrition", "Processing", "Health score"],
    systemPrompt: `You are a general nutrition expert focused on balanced, whole-food eating.
The user wants to eat healthier overall — focusing on nutritional balance, minimally processed foods, adequate protein, fiber, vitamins, and minerals while limiting excess sugar, sodium, and ultra-processed ingredients.
Analyze any food, dish, menu item, or product they show or describe and respond ONLY with a JSON object — no preamble, no markdown fences.`,
    userPromptPrefix: "Analyze this food for a balanced, healthy diet",
  },
];

export const DEFAULT_DIET_ID = "triglyceride";

export const PROVIDER_MODELS: Record<
  LLMProvider,
  { label: string; models: { id: string; label: string }[] }
> = {
  anthropic: {
    label: "Anthropic",
    models: [
      { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
      { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
    ],
  },
  openrouter: {
    label: "OpenRouter",
    models: [
      { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "anthropic/claude-sonnet-4", label: "Claude Sonnet 4" },
      { id: "openai/gpt-4o", label: "GPT-4o" },
      { id: "meta-llama/llama-4-maverick", label: "Llama 4 Maverick" },
    ],
  },
};
