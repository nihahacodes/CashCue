import { useRef, useEffect } from "react";
import { CATEGORIES } from "../constants";
import { tokens } from "../styles";

export default function DonutChart({ catTotals }) {
  const total    = Object.values(catTotals).reduce((s, v) => s + v, 0);
  const segments = CATEGORIES
    .filter(c => catTotals[c.name])
    .map(c => ({ color: c.color, value: catTotals[c.name], name: c.name }));

  return (
    <div style={styles.card}>
      <div style={styles.wrap}>
        <div style={styles.canvasWrap}>
          <DonutCanvas segments={segments} />
          <div style={styles.center}>
            <div style={styles.centerVal}>₹{total}</div>
            <div style={styles.centerLbl}>total</div>
          </div>
        </div>

        <div style={styles.legend}>
          {segments.length === 0
            ? <div style={styles.empty}>Add expenses<br />to see breakdown</div>
            : segments.map(seg => (
                <LegendItem key={seg.name} seg={seg} total={total} />
              ))
          }
        </div>
      </div>
    </div>
  );
}

function DonutCanvas({ segments }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 130, cx = W / 2, cy = W / 2, r = 52, inner = 36;

    ctx.clearRect(0, 0, W, W);

    if (!segments.length) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff0d";
      ctx.lineWidth = r - inner;
      ctx.stroke();
      return;
    }

    const total = segments.reduce((s, g) => s + g.value, 0);
    let angle = -Math.PI / 2;
    segments.forEach(seg => {
      const sweep = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, (r + inner) / 2, angle, angle + sweep);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = r - inner - 3;
      ctx.lineCap = "round";
      ctx.stroke();
      angle += sweep + 0.04;
    });
  }, [segments]);

  return (
    <canvas
      ref={ref}
      width={130}
      height={130}
      style={{ width: 130, height: 130 }}
    />
  );
}

function LegendItem({ seg, total }) {
  return (
    <div style={styles.legendRow}>
      <div style={{ ...styles.dot, background: seg.color }} />
      <div style={styles.legendName}>{seg.name}</div>
      <div style={{ ...styles.legendPct, color: seg.color }}>
        {Math.round((seg.value / total) * 100)}%
      </div>
    </div>
  );
}

const styles = {
  card: {
    margin: "0 16px",
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 20,
    padding: 20,
  },
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  canvasWrap: {
    position: "relative",
    width: 130,
    height: 130,
    flexShrink: 0,
  },
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    textAlign: "center",
    pointerEvents: "none",
  },
  centerVal: {
    fontFamily: tokens.fontDisplay,
    fontSize: 17,
    fontWeight: 800,
    color: tokens.text,
  },
  centerLbl: {
    fontSize: 10,
    color: tokens.muted,
  },
  legend: {
    flex: 1,
  },
  legendRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 0",
    fontSize: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    flexShrink: 0,
  },
  legendName: {
    flex: 1,
    padding: "0 8px",
    color: tokens.muted,
  },
  legendPct: {
    fontWeight: 600,
    fontSize: 12,
  },
  empty: {
    fontSize: 13,
    color: tokens.muted,
    textAlign: "center",
    padding: "10px 0",
    lineHeight: 1.6,
  },
};
