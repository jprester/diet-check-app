import type { Settings as SettingsType, LLMProvider, Theme } from "../types";
import { PROVIDER_MODELS } from "../types";

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (update: Partial<SettingsType>) => void;
  onClose: () => void;
}

export function Settings({ settings, onUpdate, onClose }: SettingsProps) {
  const providerConfig = PROVIDER_MODELS[settings.provider];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="settings-field">
          <label>LLM Provider</label>
          <div className="provider-buttons">
            {(Object.keys(PROVIDER_MODELS) as LLMProvider[]).map((p) => (
              <button
                key={p}
                className={`provider-btn ${settings.provider === p ? "active" : ""}`}
                onClick={() => onUpdate({ provider: p })}>
                {PROVIDER_MODELS[p].label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-field">
          <label>Model</label>
          <select value={settings.model} onChange={(e) => onUpdate({ model: e.target.value })}>
            {providerConfig.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-field">
          <label>Theme</label>
          <div className="provider-buttons">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.value}
                className={`provider-btn ${settings.theme === t.value ? "active" : ""}`}
                aria-pressed={settings.theme === t.value}
                onClick={() => onUpdate({ theme: t.value })}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <span className="settings-hint">API keys are managed securely on the server.</span>
      </div>
    </div>
  );
}
