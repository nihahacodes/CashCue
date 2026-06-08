import { todayKey, dayKey } from "../utils";
import { tokens } from "../styles";

export default function InsightBanner({ expenses, budget }) {
  const { icon, content } = getInsight(expenses, budget);

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>{icon}</span>
      <div style={styles.text}>{content}</div>
    </div>
  );
}

function getInsight(expenses, budget) {
  if (!expenses.length) {
    return {
      icon: "💡",
      content: (
        <span>
          <strong style={{ color: tokens.accent3 }}>Pro tip:</strong> Log every meal to unlock spending insights!
        </span>
      ),
    };
  }

  const todaySpent = expenses
    .filter(e => dayKey(e.ts) === todayKey())
    .reduce((sum, e) => sum + e.amount, 0);

  if (!todaySpent) {
    return {
      icon: "😴",
      content: "Nothing logged today — don't skip meals! Your body > budget 💪",
    };
  }

  const pct = Math.round((todaySpent / budget) * 100 * 30);
  if (pct > 15) {
    return {
      icon: "⚠️",
      content: (
        <span>
          <strong style={{ color: tokens.accent4 }}>Heads up!</strong>{" "}
          ₹{todaySpent} today — {pct}% of daily budget. Pace yourself 🧘
        </span>
      ),
    };
  }

  const topCat = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  return {
    icon: "📊",
    content: (
      <span>
        Biggest spend: <strong style={{ color: tokens.accent3 }}>{topCat[0]}</strong>{" "}
        (₹{topCat[1]}). No regrets 😋
      </span>
    ),
  };
}

const styles = {
  banner: {
    margin: "10px 16px",
    background: "linear-gradient(135deg,rgba(52,211,153,.1),rgba(96,165,250,.07))",
    border: "1px solid rgba(52,211,153,.22)",
    borderRadius: 16,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 13,
    color: tokens.text,
  },
  icon: {
    fontSize: 22,
    flexShrink: 0,
  },
  text: {
    lineHeight: 1.5,
  },
};
