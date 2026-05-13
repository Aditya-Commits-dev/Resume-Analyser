/**
 * SectionCard – displays the score, feedback, and improvement tips for a single resume section.
 */
export default function SectionCard({ section }) {
  const { name, score, feedback, improvements = [] } = section;

  const badgeClass =
    score >= 75 ? 'high' :
    score >= 50 ? 'mid'  : 'low';

  return (
    <div className="section-card">
      <div className="section-card-header">
        <span className="section-card-title">{name}</span>
        <span className={`score-badge ${badgeClass}`}>{score}/100</span>
      </div>

      <p className="section-feedback">{feedback}</p>

      {improvements.length > 0 && (
        <ul className="improvements-list">
          {improvements.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
