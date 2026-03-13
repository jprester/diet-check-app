import { useState, useCallback } from 'react';
import type { AnalysisResult, HistoryItem } from './types';
import { PROVIDER_MODELS } from './types';
import { useSettings } from './hooks/useSettings';
import { analyzeFood } from './providers';
import { compressImage } from './utils/imageUtils';
import { Header } from './components/Header';
import { PhotoCapture } from './components/PhotoCapture';
import { TextInput } from './components/TextInput';
import { ResultCard } from './components/ResultCard';
import { HistoryList } from './components/HistoryList';
import { Settings } from './components/Settings';

export default function App() {
  const { settings, setSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleImageSelected = useCallback(async (file: File) => {
    try {
      const { base64, dataUrl } = await compressImage(file);
      setImageBase64(base64);
      setImageDataUrl(dataUrl);
    } catch {
      setError('Failed to process image');
    }
  }, []);

  const clearImage = useCallback(() => {
    setImageBase64(null);
    setImageDataUrl(null);
  }, []);

  const analyze = useCallback(async () => {
    const text = textInput.trim();
    if (!imageBase64 && !text) {
      setError('Please upload a photo or describe the food.');
      return;
    }

    if (!settings.apiKey) {
      setShowSettings(true);
      setError('Please enter your API key in settings.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeFood(settings, imageBase64, text);
      setResult(analysisResult);

      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        label: analysisResult.verdictTitle || text || 'Food item',
        verdict: analysisResult.verdict,
        verdictLabel: analysisResult.verdictLabel,
        time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
        thumb: imageDataUrl,
        result: analysisResult,
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [textInput, imageBase64, imageDataUrl, settings]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setResult(item.result);
  }, []);

  const providerLabel = PROVIDER_MODELS[settings.provider].label;
  const hasApiKey = settings.apiKey.length > 0;

  return (
    <>
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main>
        <div className="intro">
          <h2>What are you eating?</h2>
          <p>
            Snap a photo of a meal, menu, or product label — or just describe it.
            Get instant advice for your triglyceride-lowering diet.
          </p>
        </div>

        <div className="status-chips">
          <span className="context-chip">
            Low-fat &middot; Low-carb &middot; Triglyceride reduction
          </span>
          <span className={`context-chip ${hasApiKey ? 'chip-ok' : 'chip-warn'}`}>
            {providerLabel} {hasApiKey ? '(connected)' : '(no key)'}
          </span>
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
          onClick={analyze}
        >
          {loading ? (
            <>
              <span className="spinner" /> Analyzing...
            </>
          ) : (
            'Analyze for my diet'
          )}
        </button>

        {result && <ResultCard result={result} />}

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
