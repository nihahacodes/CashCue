import React from "react";
import { tokens } from "../styles";

function getBarColor(pct) {
  if (pct > 85) return "#f87171";
  if (pct > 60) return "#facc15";
  return "#34d399";
}

export default function BudgetCard({ monthSpent, budget, onEditBudget }) {
  const remaining = Math.max(0, budget - monthSpent);
  const pct       = Math.min(100, Math.round((monthSpent / budget) * 100));
  const barColor  = getBarColor(pct);

  return (
    <div style={styles.card}>
      <button style={styles.editBtn} onClick={onEditBudget}>✏️ Budget</button>

      <div style={styles.label}>Monthly Budget</div>

      <div style={styles.amount}>
        <span style={styles.rupeeSign}>₹</span>
        {monthSpent}
      </div>

      <div style={styles.subtitle}>of ₹{budget} spent this month</div>

      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${pct}%`, background: `linear-gradient(90deg,${barColor},${barColor}aa)` }} />
      </div>

      <div style={styles.meta}>
        <span>₹{remaining} left</span>
        <strong style={{ color: tokens.text }}>{pct}% used</strong>
      </div>
    </div>
  );
}

const styles = {
  card: {
    margin: "0 16px",
    background: "linear-gradient(135deg,#1a1032,#12101f)",
    border: `1px solid ${tokens.border2}`,
    borderRadius: 24,
    padding: 28,
    position: "relative",
    overflow: "hidden",
  },
  editBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "#ffffff0d",
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    padding: "6px 12px",
    fontSize: 12,
    color: tokens.muted,
    cursor: "pointer",
    fontFamily: tokens.fontSans,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: tokens.muted,
    marginBottom: 6,
  },
  amount: {
    fontFamily: tokens.fontDisplay,
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: 4,
    color: tokens.text,
  },
  rupeeSign: {
    fontSize: 22,
    fontWeight: 400,
    color: tokens.muted,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.muted,
    marginBottom: 18,
  },
  barTrack: {
    background: "#ffffff0d",
    borderRadius: 99,
    height: 8,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 1s cubic-bezier(.4,0,.2,1)",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: tokens.muted,
    marginTop: 8,
  },
};
