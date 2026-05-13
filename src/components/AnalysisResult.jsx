import ScoreGauge from './ScoreGauge';
import SectionCard from './SectionCard';

/**
 * AnalysisResult – renders the full analysis returned by Claude.
 */
export default function AnalysisResult({ result, onReset }) {
  const {
    overallScore,
    verdict,
    summary,
    sections = [],
    keywords = [],
    missingKeywords = [],
    quickWins = [],
  } = result;

  return (
    <div className="card">
      {/* Header row */}
      <div className="result-header">
        <ScoreGauge score={overallScore} verdict={verdict} />
        <div className="result-meta">
          <h2>Resume Analysis</h2>
          <p>Powered by Gemini AI · Just now</p>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-box">{summary}</div>

      {/* Section breakdown */}
      <div className="card-title">Section Breakdown</div>
      <div className="section-grid">
        {sections.map((s, i) => (
          <SectionCard key={i} section={s} />
        ))}
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="card-title">✅ Strong Keywords Found</div>
          <div className="keywords-wrap">
            {keywords.map((kw, i) => (
              <span key={i} className="keyword-tag">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {missingKeywords.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div className="card-title">⚠️ Missing Keywords</div>
          <div className="keywords-wrap">
            {missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="keyword-tag"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  color: 'var(--warning)',
                  borderColor: 'rgba(245,158,11,0.3)',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick wins */}
      {quickWins.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div className="card-title">⚡ Quick Wins</div>
          <ul className="quick-wins-list">
            {quickWins.map((win, i) => (
              <li key={i}>
                <span className="bullet">🔹</span>
                {win}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="reset-btn" onClick={onReset}>
        ← Analyse Another Resume
      </button>
    </div>
  );
}
