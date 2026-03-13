export interface AnalysisResult {
  verdict: 'good' | 'ok' | 'avoid';
  verdictLabel: string;
  verdictTitle: string;
  fatScore: number;
  carbScore: number;
  trigRisk: number;
  analysis: string;
  goodFactors: string[];
  badFactors: string[];
  tip: string;
}

export interface HistoryItem {
  id: string;
  label: string;
  verdict: 'good' | 'ok' | 'avoid';
  verdictLabel: string;
  time: string;
  thumb: string | null;
  result: AnalysisResult;
}

export type LLMProvider = 'anthropic' | 'openrouter';

export interface Settings {
  provider: LLMProvider;
  model: string;
}

export const PROVIDER_MODELS: Record<LLMProvider, { label: string; models: { id: string; label: string }[] }> = {
  anthropic: {
    label: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
    ],
  },
  openrouter: {
    label: 'OpenRouter',
    models: [
      { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { id: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
      { id: 'openai/gpt-4o', label: 'GPT-4o' },
      { id: 'meta-llama/llama-4-maverick', label: 'Llama 4 Maverick' },
    ],
  },
};
