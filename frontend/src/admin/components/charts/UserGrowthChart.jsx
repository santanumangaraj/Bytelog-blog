import { useId, useMemo, useState } from "react";

const CYAN = "#55DDE0";

const VB_W = 600;
const VB_H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 36 };

/**
 * Dependency-free responsive SVG line chart.
 * data: [{ label, users }] — ordered oldest -> newest.
 */
const UserGrowthChart = ({ data = [] }) => {
  const gradientId = useId();
  const [hover, setHover] = useState(null);

  const { points, yTicks, xLabels } = useMemo(() => {
    if (!data.length) return { points: [], yTicks: [], xLabels: [] };

    const values = data.map((d) => d.users);
    const maxV = Math.max(...values);
    const minV = Math.min(0, Math.min(...values));
    const span = maxV - minV || 1;

    const innerW = VB_W - PAD.left - PAD.right;
    const innerH = VB_H - PAD.top - PAD.bottom;

    const pts = data.map((d, i) => {
      const x = PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
      const y = PAD.top + innerH - ((d.users - minV) / span) * innerH;
      return { x, y, ...d };
    });

    const ticks = Array.from({ length: 4 }, (_, i) => {
      const v = minV + (span * i) / 3;
      const y = PAD.top + innerH - ((v - minV) / span) * innerH;
      return { y, value: Math.round(v) };
    });

    // Thin out x labels so they don't collide on wide datasets (e.g. 90d).
    const labelEvery = Math.ceil(data.length / 7);
    const xLbls = pts.filter((_, i) => i % labelEvery === 0 || i === pts.length - 1);

    return { points: pts, yTicks: ticks, xLabels: xLbls };
  }, [data]);

  if (!data.length) {
    return <p className="py-10 text-center text-sm text-base-content/50">No growth data available.</p>;
  }

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${VB_H - PAD.bottom} L${points[0].x},${VB_H - PAD.bottom} Z`;

  const active = hover != null ? points[hover] : null;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full text-base-content" role="img" aria-label="User growth over time">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.35" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* grid + y labels */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={VB_W - PAD.right}
              y1={t.y}
              y2={t.y}
              className="stroke-base-300"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x={PAD.left - 8} y={t.y + 3} textAnchor="end" className="fill-current text-[9px] opacity-50">
              {t.value}
            </text>
          </g>
        ))}

        {/* x labels */}
        {xLabels.map((p) => (
          <text
            key={p.label}
            x={p.x}
            y={VB_H - 8}
            textAnchor="middle"
            className="fill-current text-[9px] opacity-50"
          >
            {p.label}
          </text>
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i}>
            {/* generous invisible hit target for hover, independent of the visible dot size */}
            <rect
              x={p.x - (VB_W / points.length) / 2}
              y={PAD.top}
              width={VB_W / points.length}
              height={VB_H - PAD.top - PAD.bottom}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={hover === i ? 4.5 : 3}
              fill={CYAN}
              stroke="var(--fallback-b1,#fff)"
              className="stroke-base-100"
              strokeWidth="1.5"
              style={{ pointerEvents: "none" }}
            />
          </g>
        ))}

        {active && (
          <line
            x1={active.x}
            x2={active.x}
            y1={PAD.top}
            y2={VB_H - PAD.bottom}
            className="stroke-base-content/20"
            strokeWidth="1"
          />
        )}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-base-300 bg-base-100 px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: `${(active.x / VB_W) * 100}%`,
            top: `${(active.y / VB_H) * 100}%`,
          }}
        >
          <p className="font-semibold text-base-content">{active.users.toLocaleString()} users</p>
          <p className="text-base-content/50">{active.label}</p>
        </div>
      )}
    </div>
  );
};

export default UserGrowthChart;
