import { useState } from "react";
import { CATEGORIES } from "../constants";
import { groupExpensesByDate } from "../utils";
import ExpenseRow from "./ExpenseRow";
import { tokens } from "../styles";

const FILTERS = [
  { key: "all", label: "All" },
  ...CATEGORIES.map(c => ({ key: c.name, label: `${c.emoji} ${c.name}` })),
];

export default function ExpenseFeed({ expenses, onDelete }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? expenses
    : expenses.filter(e => e.category === filter);

  const grouped = groupExpensesByDate(filtered);

  return (
    <>
      {/* Filter tabs */}
      <div style={styles.tabs}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{ ...styles.tab, ...(filter === f.key ? styles.tabActive : {}) }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div style={styles.feed}>
        {grouped.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          grouped.map((item, i) =>
            item.type === "label" ? (
              <div key={`label-${item.lbl}-${i}`} style={styles.dateLabel}>{item.lbl}</div>
            ) : (
              <ExpenseRow key={String(item.id)} item={item} onDelete={onDelete} />
            )
          )
        )}
      </div>
    </>
  );
}

function EmptyState({ filter }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyEmoji}>🍽️</div>
      <div style={{ fontSize: 14, color: tokens.muted }}>
        {filter === "all"
          ? <>No meals logged yet!<br /><strong style={{ color: tokens.text }}>Hit + to add your first bite</strong></>
          : `No ${filter} entries yet!`}
      </div>
    </div>
  );
}

const styles = {
  tabs: {
    display: "flex",
    gap: 8,
    padding: "0 16px 14px",
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  tab: {
    flexShrink: 0,
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 20,
    padding: "7px 16px",
    fontSize: 13,
    cursor: "pointer",
    color: tokens.muted,
    fontFamily: tokens.fontSans,
    transition: ".2s",
    whiteSpace: "nowrap",
  },
  tabActive: {
    background: "rgba(192,132,252,.15)",
    borderColor: tokens.accent,
    color: tokens.accent,
    fontWeight: 600,
  },
  feed: {
    padding: "0 16px",
  },
  dateLabel: {
    padding: "10px 4px 6px",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: tokens.muted,
  },
  empty: {
    textAlign: "center",
    padding: "40px 20px",
    color: tokens.muted,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
};
