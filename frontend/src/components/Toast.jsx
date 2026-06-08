import { tokens } from "../styles";

export default function Toast({ msg, type, visible }) {
  return (
    <div style={{
      ...styles.toast,
      opacity: visible ? 1 : 0,
      transform: `translateX(-50%) translateY(${visible ? 0 : -60}px)`,
      borderColor: type === "error" ? tokens.red : tokens.accent3,
      color:       type === "error" ? tokens.red : tokens.accent3,
      pointerEvents: visible ? "auto" : "none",
    }}>
      {msg}
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    top: 30,
    left: "50%",
    background: "#1e1e30",
    border: "1px solid",
    borderRadius: 16,
    padding: "14px 24px",
    fontSize: 14,
    fontWeight: 500,
    zIndex: 300,
    transition: "all .4s cubic-bezier(.4,0,.2,1)",
    whiteSpace: "nowrap",
    boxShadow: "0 8px 32px rgba(0,0,0,.4)",
    fontFamily: tokens.fontSans,
  },
};
