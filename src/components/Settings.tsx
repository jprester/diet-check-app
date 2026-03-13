import type { Settings as SettingsType, LLMProvider } from '../types';
import { PROVIDER_MODELS } from '../types';

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (update: Partial<SettingsType>) => void;
  onClose: () => void;
}

export function Settings({ settings, onUpdate, onClose }: SettingsProps) {
  const providerConfig = PROVIDER_MODELS[settings.provider];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="settings-field">
          <label>LLM Provider</label>
          <div className="provider-buttons">
            {(Object.keys(PROVIDER_MODELS) as LLMProvider[]).map(p => (
              <button
                key={p}
                className={`provider-btn ${settings.provider === p ? 'active' : ''}`}
                onClick={() => onUpdate({ provider: p })}
              >
                {PROVIDER_MODELS[p].label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-field">
          <label>Model</label>
          <select
            value={settings.model}
            onChange={e => onUpdate({ model: e.target.value })}
          >
            {providerConfig.models.map(m => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-field">
          <label>API Key</label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={e => onUpdate({ apiKey: e.target.value })}
            placeholder={`Enter your ${providerConfig.label} API key`}
          />
          <span className="settings-hint">
            Stored locally in your browser. Never sent to any server except the provider's API.
          </span>
        </div>
      </div>
    </div>
  );
}
