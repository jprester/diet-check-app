import type { AnalysisResult } from "../types";

function scoreColor(score: number): string {
  if (score <= 3) return "#1D9E75";
  if (score <= 6) return "#BA7517";
  return "#A32D2D";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="score-row">
      <span className="score-label">{label}</span>
      <div className="score-track">
        <div
          className="score-fill"
          style={{ width: `${score * 10}%`, background: scoreColor(score) }}
        />
      </div>
      <span className="score-num" style={{ color: scoreColor(score) }}>
        {score}/10
      </span>
    </div>
  );
}

interface ResultCardProps {
  result: AnalysisResult;
  scoreLabels?: [string, string, string];
}

export function ResultCard({ result, scoreLabels = ["Fat", "Carbs", "Risk"] }: ResultCardProps) {
  const verdictClass =
    result.verdict === "good"
      ? "verdict-good"
      : result.verdict === "ok"
        ? "verdict-ok"
        : "verdict-avoid";

  return (
    <div className="result-card">
      <div className="result-header">
        <div className={`verdict-badge ${verdictClass}`}>{result.verdictLabel}</div>
        <div className="verdict-title">{result.verdictTitle}</div>
      </div>

      <div className="score-bar-wrap">
        <ScoreBar label={scoreLabels[0]} score={result.score1} />
        <ScoreBar label={scoreLabels[1]} score={result.score2} />
        <ScoreBar label={scoreLabels[2]} score={result.score3} />
      </div>

      <div className="result-body">
        <h4>Analysis</h4>
        <p>{result.analysis}</p>

        <h4>Key factors</h4>
        <div className="tag-list">
          {result.goodFactors.map((f, i) => (
            <span key={`g${i}`} className="tag tag-good">
              {f}
            </span>
          ))}
          {result.badFactors.map((f, i) => (
            <span key={`b${i}`} className="tag tag-bad">
              {f}
            </span>
          ))}
        </div>

        <div className="tips-box">
          <strong>Tip</strong>
          {result.tip}
        </div>
      </div>
    </div>
  );
}
