interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo-mark">&#x1FAC0;</div>
      <div className="logo-text">
        <span className="logo-title">TrigCheck</span>
        <span className="logo-sub">Triglyceride-Aware Diet Helper</span>
      </div>
      <button
        className="settings-btn"
        onClick={onSettingsClick}
        aria-label="Settings"
      >
        &#x2699;
      </button>
    </header>
  );
}
