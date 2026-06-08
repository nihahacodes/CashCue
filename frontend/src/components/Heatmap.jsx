import { dayKey } from "../utils";
import { tokens } from "../styles";

const HEATMAP_COLORS = ["#1a1a26", "#3b1f6e", "#7c3aed", "#c084fc"];
const DAYS_SHOWN     = 28;
const DAY_LABELS     = ["S", "M", "T", "W", "T", "F", "S"];

function getHeatColor(value, max) {
  if (!value) return HEATMAP_COLORS[0];
  const ratio = value / max;
  if (ratio < 0.33) return HEATMAP_COLORS[1];
  if (ratio < 0.66) return HEATMAP_COLORS[2];
  return HEATMAP_COLORS[3];
}

export default function Heatmap({ expenses }) {
  const daily = expenses.reduce((acc, e) => {
    const key = dayKey(e.ts);
    acc[key] = (acc[key] || 0) + e.amount;
    return acc;
  }, {});

  const max = Math.max(...Object.values(daily), 1);

  const cells = Array.from({ length: DAYS_SHOWN }, (_, i) => {
    const d = new Date(Date.now() - (DAYS_SHOWN - 1 - i) * 86400000);
    d.setHours(0, 0, 0, 0);
    return { date: d, value: daily[d.getTime()] || 0 };
  });

  return (
    <div style={styles.card}>
      <div style={styles.title}>Daily spending — last {DAYS_SHOWN} days</div>

      <div style={styles.grid}>
        {cells.map(({ date, value }, i) => (
          <div
            key={i}
            title={`${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}: ₹${value}`}
            style={{ ...styles.cell, background: getHeatColor(value, max) }}
          />
        ))}
      </div>

      <div style={styles.dayLabels}>
        {DAY_LABELS.map((l, i) => <div key={i} style={styles.dayLabel}>{l}</div>)}
      </div>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div style={styles.legend}>
      <span style={styles.legendText}>Less</span>
      {HEATMAP_COLORS.map((c, i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
      ))}
      <span style={styles.legendText}>More</span>
    </div>
  );
}

const styles = {
  card: {
    margin: "0 16px 14px",
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 20,
    padding: 18,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 14,
    color: tokens.muted,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 5,
  },
  cell: {
    aspectRatio: 1,
    borderRadius: 5,
    cursor: "pointer",
    transition: "transform .15s",
  },
  dayLabels: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 5,
    marginTop: 6,
  },
  dayLabel: {
    textAlign: "center",
    fontSize: 9,
    color: tokens.muted,
  },
  legend: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    justifyContent: "flex-end",
  },
  legendText: {
    fontSize: 10,
    color: tokens.muted,
  },
};
