import { tokens } from "../styles";

export default function StatsRow({ todaySpent, dailyAvg, mealCount }) {
  const stats = [
    { value: `₹${todaySpent}`, label: "today",     color: tokens.accent },
    { value: `₹${dailyAvg}`,   label: "daily avg",  color: tokens.accent2 },
    { value: mealCount,         label: "meals",      color: tokens.accent5 },
  ];

  return (
    <div style={styles.row}>
      {stats.map(({ value, label, color }) => (
        <div key={label} style={styles.card}>
          <div style={{ ...styles.value, color }}>{value}</div>
          <div style={styles.label}>{label}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    margin: "14px 16px",
  },
  card: {
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 16,
    padding: "14px 12px",
    textAlign: "center",
  },
  value: {
    fontFamily: tokens.fontDisplay,
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: tokens.muted,
  },
};
