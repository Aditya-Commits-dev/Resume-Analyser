/**
 * ScoreGauge – SVG arc gauge that visualises the overall resume score.
 */
export default function ScoreGauge({ score, verdict }) {
  const radius = 70;
  const stroke = 10;
  const cx = 90, cy = 90;

  // Arc spans 220° (from 160° to 20° clockwise)
  const startAngle = 160;
  const totalAngle = 220;
  const endAngle   = startAngle + (totalAngle * score) / 100;

  function polar(angle, r) {
    const rad = (angle * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function arcPath(start, end, r) {
    const [x1, y1] = polar(start, r);
    const [x2, y2] = polar(end,   r);
    const large     = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  // Colour ramp
  let colour = '#ef4444';
  if (score >= 75) colour = '#22c55e';
  else if (score >= 55) colour = '#f59e0b';
  else if (score >= 35) colour = '#f97316';

  const verdictColour = {
    Excellent: '#22c55e',
    Strong:    '#4ade80',
    Good:      '#f59e0b',
    Fair:      '#f97316',
    'Needs Work': '#ef4444',
  }[verdict] || '#8b91b5';

  return (
    <div className="gauge-wrap">
      <svg
        className="gauge-svg"
        viewBox="0 0 180 110"
        width={220}
        height={135}
      >
        {/* Track */}
        <path
          d={arcPath(startAngle, startAngle + totalAngle, radius)}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress */}
        {score > 0 && (
          <path
            d={arcPath(startAngle, endAngle, radius)}
            fill="none"
            stroke={colour}
            strokeWidth={stroke}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${colour}88)` }}
          />
        )}
        {/* Score text */}
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          className="gauge-score-text"
          fontSize="28"
          fontWeight="800"
          fill="var(--text)"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          className="gauge-label-text"
          fontSize="11"
          fill="var(--text-muted)"
        >
          / 100
        </text>
      </svg>

      <div className="gauge-verdict" style={{ color: verdictColour }}>
        {verdict}
      </div>
    </div>
  );
}
