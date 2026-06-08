import { useState } from "react";
import { CAT_MAP, CATEGORIES } from "../constants";
import { timeAgo } from "../utils";
import { tokens } from "../styles";

export default function ExpenseRow({ item, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const cat = CAT_MAP[item.category] || CATEGORIES[1];

  return (
    <div
      style={{ ...styles.row, borderLeftColor: cat.color, background: hovered ? tokens.surface2 : tokens.surface }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(h => !h)}
    >
      <div style={{ ...styles.emoji, background: cat.bg }}>{cat.emoji}</div>

      <div style={styles.info}>
        <div style={styles.name}>{item.name}</div>
        <div style={styles.meta}>
          <span style={styles.tag}>{item.canteen}</span>
          <span>{item.category}</span>
        </div>
      </div>

      <div style={styles.right}>
        <div style={{ ...styles.amount, color: cat.color }}>₹{item.amount}</div>
        <div style={styles.time}>{timeAgo(item.ts)}</div>
      </div>

      {hovered && (
        <button
          style={styles.deleteBtn}
          onClick={e => { e.stopPropagation(); onDelete(item.id); }}
        >
          remove
        </button>
      )}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 14,
    border: `1px solid ${tokens.border}`,
    borderLeft: "3px solid",
    borderRadius: 16,
    marginBottom: 10,
    cursor: "pointer",
    transition: "background .2s",
    position: "relative",
    overflow: "hidden",
    animation: "slideUp .3s ease",
  },
  emoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: 600,
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: tokens.text,
  },
  meta: {
    fontSize: 12,
    color: tokens.muted,
    marginTop: 2,
    display: "flex",
    gap: 8,
  },
  tag: {
    background: "#ffffff0d",
    borderRadius: 6,
    padding: "1px 6px",
  },
  right: {
    textAlign: "right",
    flexShrink: 0,
    paddingRight: 80,
  },
  amount: {
    fontFamily: tokens.fontDisplay,
    fontWeight: 700,
    fontSize: 16,
  },
  time: {
    fontSize: 11,
    color: tokens.muted,
    marginTop: 2,
  },
  deleteBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(248,113,113,.15)",
    border: "1px solid rgba(248,113,113,.3)",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 11,
    color: tokens.red,
    cursor: "pointer",
    fontFamily: tokens.fontSans,
    animation: "slideUp .2s ease",
    zIndex: 1,
  },
};
