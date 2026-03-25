import { useState, useCallback } from "react";
import type { AnalysisResult, HistoryItem } from "./types";
import { PROVIDER_MODELS, DIET_PROFILES, DEFAULT_DIET_ID } from "./types";
import { useSettings } from "./hooks/useSettings";
import { useHistory } from "./hooks/useHistory";
import { analyzeFood } from "./providers";
import { compressImage } from "./utils/imageUtils";
import { Header } from "./components/Header";
import { DietSelector } from "./components/DietSelector";
import { PhotoCapture } from "./components/PhotoCapture";
import { TextInput } from "./components/TextInput";
import { ResultCard } from "./components/ResultCard";
import { HistoryList } from "./components/HistoryList";
import { Settings } from "./components/Settings";

function normalizeLegacyResult(r: AnalysisResult): AnalysisResult {
  const legacy = r as AnalysisResult & {
    fatScore?: number;
    carbScore?: number;
    trigRisk?: number;
  };
  if (legacy.fatScore !== undefined && legacy.score1 === undefined) {
    return {
      ...r,
      score1: legacy.fatScore,
      score2: legacy.carbScore ?? 0,
      score3: legacy.trigRisk ?? 0,
    };
  }
  return r;
}

export default function App() {
  const { settings, setSettings } = useSettings();
  const { history, addItem } = useHistory();
  const [showSettings, setShowSettings] = useState(false);

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resultDietId, setResultDietId] = useState<string>(DEFAULT_DIET_ID);

  const diet =
    DIET_PROFILES.find((d) => d.id === settings.dietId) ||
    DIET_PROFILES.find((d) => d.id === DEFAULT_DIET_ID)!;

  const handleImageSelected = useCallback(async (file: File) => {
    try {
      const { base64, dataUrl } = await compressImage(file);
      setImageBase64(base64);
      setImageDataUrl(dataUrl);
      setError(null);
    } catch {
      setError("Failed to process image");
    }
  }, []);

  const clearImage = useCallback(() => {
    setImageBase64(null);
    setImageDataUrl(null);
  }, []);

  const analyze = useCallback(async () => {
    const text = textInput.trim();
    if (!imageBase64 && !text) {
      setError("Please upload a photo or describe the food.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeFood(settings, imageBase64, text);
      setResult(analysisResult);
      setResultDietId(settings.dietId);

      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        label: analysisResult.verdictTitle || text || "Food item",
        verdict: analysisResult.verdict,
        verdictLabel: analysisResult.verdictLabel,
        time: new Date().toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        thumb: imageDataUrl,
        result: analysisResult,
        dietId: settings.dietId,
      };
      addItem(historyItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [textInput, imageBase64, imageDataUrl, settings, addItem]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setResult(normalizeLegacyResult(item.result));
    setResultDietId(item.dietId || DEFAULT_DIET_ID);
  }, []);

  const providerLabel = PROVIDER_MODELS[settings.provider].label;
  const displayDiet = DIET_PROFILES.find((d) => d.id === resultDietId) || diet;

  return (
    <>
      <Header subtitle={diet.subtitle} onSettingsClick={() => setShowSettings(true)} />

      <main>
        <div className="intro">
          <h2>What are you eating?</h2>
          <p>
            Snap a photo of a meal, menu, or product label — or just describe it. Get instant
            dietary advice.
          </p>
        </div>

        <DietSelector
          selectedDietId={settings.dietId}
          onChange={(dietId) => setSettings({ dietId })}
        />

        <div className="status-chips">
          <span className="context-chip">{(result ? displayDiet : diet).chipText}</span>
          <span className="context-chip chip-ok">{providerLabel}</span>
        </div>

        <PhotoCapture
          imageDataUrl={imageDataUrl}
          onImageSelected={handleImageSelected}
          onClear={clearImage}
        />

        <TextInput value={textInput} onChange={setTextInput} />

        {error && <div className="error-msg">{error}</div>}

        <button
          className="btn btn-primary"
          disabled={loading || (!imageBase64 && !textInput.trim())}
          onClick={analyze}>
          {loading ? (
            <>
              <span className="spinner" /> Analyzing...
            </>
          ) : (
            "Analyze for my diet"
          )}
        </button>

        {result && <ResultCard result={result} scoreLabels={displayDiet.scoreLabels} />}

        <HistoryList items={history} onSelect={handleHistorySelect} />
      </main>

      {showSettings && (
        <Settings
          settings={settings}
          onUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
