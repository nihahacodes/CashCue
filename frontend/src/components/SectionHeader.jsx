import React from "react";

import { tokens } from "../styles";

export default function SectionHeader({ title, action, onAction }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.title}>{title}</div>
      {action && (
        <button style={styles.action} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    padding: "20px 20px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: tokens.fontDisplay,
    fontSize: 17,
    fontWeight: 700,
    color: tokens.text,
  },
  action: {
    fontSize: 12,
    color: tokens.accent,
    cursor: "pointer",
    border: "none",
    background: "none",
    fontFamily: tokens.fontSans,
  },
};
