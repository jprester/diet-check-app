import { useCallback } from "react";
import type { HistoryItem } from "../types";

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

function exportHistory(items: HistoryItem[]) {
  const exportData = items.map((item) => ({
    id: item.id,
    label: item.label,
    verdict: item.verdict,
    verdictLabel: item.verdictLabel,
    time: item.time,
    result: item.result,
    dietId: item.dietId,
  }));
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dietcheck-history-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function HistoryList({ items, onSelect }: HistoryListProps) {
  const handleExport = useCallback(() => exportHistory(items), [items]);

  if (items.length === 0) return null;

  return (
    <div className="history-section">
      <div className="history-header">
        <h3>Recent checks</h3>
        <button className="btn btn-sm btn-ghost" onClick={handleExport}>
          Export
        </button>
      </div>
      {items.map((item) => {
        const badgeClass =
          item.verdict === "good"
            ? "verdict-good"
            : item.verdict === "ok"
              ? "verdict-ok"
              : "verdict-avoid";
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
            <span className={`history-badge verdict-badge ${badgeClass}`}>{item.verdictLabel}</span>
          </div>
        );
      })}
    </div>
  );
}
