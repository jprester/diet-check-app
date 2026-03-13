import type { HistoryItem } from '../types';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export function HistoryList({ items, onSelect }: HistoryListProps) {
  if (items.length === 0) return null;

  return (
    <div className="history-section">
      <h3>Recent checks</h3>
      {items.map(item => {
        const badgeClass =
          item.verdict === 'good'
            ? 'verdict-good'
            : item.verdict === 'ok'
              ? 'verdict-ok'
              : 'verdict-avoid';
        return (
          <div key={item.id} className="history-item" onClick={() => onSelect(item)}>
            {item.thumb ? (
              <img src={item.thumb} className="history-thumb" alt="" />
            ) : (
              <div className="history-thumb">&#x1F37D;</div>
            )}
            <div className="history-info">
              <div className="history-name">{item.label}</div>
              <div className="history-meta">{item.time}</div>
            </div>
            <span className={`history-badge verdict-badge ${badgeClass}`}>
              {item.verdictLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
