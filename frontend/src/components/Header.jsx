import { tokens } from "../styles";

export default function Header({ streak }) {
  return (
    <div style={styles.header}>
      <div>
        <div style={styles.logo}>CashCue</div>
        <div style={styles.tagline}>campus food tracker</div>
      </div>
      <div style={styles.streak}>
        🔥 {streak} day streak
      </div>
    </div>
  );
}

const styles = {
  header: {
    padding: "32px 20px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontFamily: tokens.fontDisplay,
    fontWeight: 800,
    fontSize: 26,
    background: "linear-gradient(135deg,#c084fc,#f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    fontSize: 12,
    color: tokens.muted,
    marginTop: 1,
  },
  streak: {
    background: tokens.surface2,
    border: `1px solid ${tokens.border2}`,
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: tokens.accent4,
  },
};
