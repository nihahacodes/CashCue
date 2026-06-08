import { NAV_ITEMS } from "../constants";
import { tokens } from "../styles";

export default function BottomNav({ active, onNav }) {
  return (
    <div style={styles.nav}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onNav(item.id)}
          style={{ ...styles.item, color: active === item.id ? tokens.accent : tokens.muted }}
        >
          <span style={styles.icon}>{item.icon}</span>
          <span style={{ ...styles.label, color: active === item.id ? tokens.accent : tokens.muted }}>
            {item.label}
          </span>
          {active === item.id && <div style={styles.dot} />}
        </button>
      ))}
    </div>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(18,18,26,.95)",
    backdropFilter: "blur(20px)",
    borderTop: `1px solid ${tokens.border}`,
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0 20px",
    zIndex: 99,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    cursor: "pointer",
    transition: "color .2s",
    padding: "0 20px",
    background: "none",
    border: "none",
    fontFamily: tokens.fontSans,
    position: "relative",
  },
  icon:  { fontSize: 20 },
  label: { fontSize: 10, transition: "color .2s" },
  dot:   {
    position: "absolute",
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: tokens.accent,
  },
};
