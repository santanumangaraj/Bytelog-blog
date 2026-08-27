import { useMemo, useState } from "react";

const CYAN = "#55DDE0";
const PINK = "#FF2DAA";
const AMBER = "#F5B942";
const SLATE = "#94A3B8";

const COLOR_BY_STATUS = {
  Published: CYAN,
  Draft: PINK,
  Archived: SLATE,
  Pending: AMBER,
};

const SIZE = 220;
const CENTER = SIZE / 2;
const R_OUTER = 92;
const R_INNER = 60;

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const donutSlicePath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const p1 = polarToCartesian(cx, cy, rOuter, endAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p3 = polarToCartesian(cx, cy, rInner, startAngle);
  const p4 = polarToCartesian(cx, cy, rInner, endAngle);
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
};

/**
 * Dependency-free responsive SVG donut chart.
 * data: [{ status, count }]
 */
const StatusDistributionChart = ({ data = [] }) => {
  const [hover, setHover] = useState(null);

  const { slices, total } = useMemo(() => {
    const totalCount = data.reduce((sum, d) => sum + d.count, 0);
    if (!totalCount) return { slices: [], total: 0 };

    let angle = 0;
    const s = data.map((d) => {
      const sweep = (d.count / totalCount) * 360;
      const slice = {
        ...d,
        startAngle: angle,
        endAngle: angle + sweep,
        pct: Math.round((d.count / totalCount) * 100),
        color: COLOR_BY_STATUS[d.status] ?? SLATE,
      };
      angle += sweep;
      return slice;
    });
    return { slices: s, total: totalCount };
  }, [data]);

  if (!total) {
    return <p className="py-10 text-center text-sm text-base-content/50">No blogs to distribute yet.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="text-base-content" role="img" aria-label="Blog status distribution">
          {slices.map((s, i) => (
            <path
              key={s.status}
              d={donutSlicePath(CENTER, CENTER, R_OUTER, R_INNER, s.startAngle, s.endAngle)}
              fill={s.color}
              opacity={hover === null || hover === i ? 1 : 0.35}
              stroke="var(--fallback-b1,transparent)"
              className="stroke-base-100 transition-opacity"
              strokeWidth="2"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-barlow text-2xl font-bold text-base-content">
              {(hover != null ? slices[hover].count : total).toLocaleString()}
            </p>
            <p className="text-[10px] tracking-wide text-base-content/50 uppercase">
              {hover != null ? slices[hover].status : "Total blogs"}
            </p>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {slices.map((s, i) => (
          <li
            key={s.status}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            className={`flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-sm transition-colors ${
              hover === i ? "bg-base-200" : ""
            }`}
          >
            <span className="inline-block size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="min-w-[70px] text-base-content/80">{s.status}</span>
            <span className="font-semibold text-base-content">{s.count}</span>
            <span className="text-xs text-base-content/50">({s.pct}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusDistributionChart;
