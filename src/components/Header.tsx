interface HeaderProps {
  subtitle?: string;
  onSettingsClick: () => void;
}

export function Header({ subtitle = 'AI Diet Helper', onSettingsClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo-mark">&#x1FAC0;</div>
      <div className="logo-text">
        <span className="logo-title">DietCheck</span>
        <span className="logo-sub">{subtitle}</span>
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
