import { useMemo, useState } from "react";

const CYAN = "#55DDE0";
const PINK = "#FF2DAA";

const VB_W = 600;
const VB_H = 240;
const PAD = { top: 16, right: 16, bottom: 30, left: 32 };

/**
 * Dependency-free responsive SVG grouped bar chart.
 * data: [{ label, published, draft }]
 */
const PublishingActivityChart = ({ data = [] }) => {
  const [hover, setHover] = useState(null);

  const { groups, yTicks } = useMemo(() => {
    if (!data.length) return { groups: [], yTicks: [], maxV: 0 };

    const max = Math.max(1, ...data.map((d) => Math.max(d.published, d.draft)));
    const innerW = VB_W - PAD.left - PAD.right;
    const innerH = VB_H - PAD.top - PAD.bottom;
    const groupW = innerW / data.length;
    const barW = Math.min(22, groupW * 0.28);

    const gs = data.map((d, i) => {
      const cx = PAD.left + groupW * i + groupW / 2;
      const pubH = (d.published / max) * innerH;
      const draftH = (d.draft / max) * innerH;
      return {
        ...d,
        cx,
        barW,
        pub: { x: cx - barW - 3, y: PAD.top + innerH - pubH, h: pubH },
        draft: { x: cx + 3, y: PAD.top + innerH - draftH, h: draftH },
      };
    });

    const ticks = Array.from({ length: 4 }, (_, i) => {
      const v = (max * i) / 3;
      return { y: PAD.top + innerH - (v / max) * innerH, value: Math.round(v) };
    });

    return { groups: gs, yTicks: ticks, maxV: max };
  }, [data]);

  if (!data.length) {
    return <p className="py-10 text-center text-sm text-base-content/50">No publishing activity yet.</p>;
  }

  const innerH = VB_H - PAD.top - PAD.bottom;

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-base-content/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: CYAN }} />
          Published
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: PINK }} />
          Draft
        </span>
      </div>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full text-base-content" role="img" aria-label="Publishing activity: published vs draft">
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
            <text x={PAD.left - 6} y={t.y + 3} textAnchor="end" className="fill-current text-[9px] opacity-50">
              {t.value}
            </text>
          </g>
        ))}

        <line x1={PAD.left} x2={VB_W - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} className="stroke-base-300" strokeWidth="1" />

        {groups.map((g, i) => (
          <g
            key={g.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover((h) => (h === i ? null : h))}
          >
            <rect x={g.pub.x - 4} y={PAD.top} width={g.barW + 8} height={innerH} fill="transparent" />
            <rect
              x={g.pub.x}
              y={g.pub.y}
              width={g.barW}
              height={Math.max(g.pub.h, 1)}
              rx="2"
              fill={CYAN}
              opacity={hover === null || hover === i ? 1 : 0.35}
            />
            <rect
              x={g.draft.x}
              y={g.draft.y}
              width={g.barW}
              height={Math.max(g.draft.h, 1)}
              rx="2"
              fill={PINK}
              opacity={hover === null || hover === i ? 1 : 0.35}
            />
            <text x={g.cx} y={VB_H - 8} textAnchor="middle" className="fill-current text-[9px] opacity-50">
              {g.label}
            </text>

            {hover === i && (
              <g style={{ pointerEvents: "none" }}>
                <text x={g.cx} y={Math.min(g.pub.y, g.draft.y) - 8} textAnchor="middle" className="fill-current text-[10px] font-semibold">
                  {g.published} / {g.draft}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default PublishingActivityChart;
