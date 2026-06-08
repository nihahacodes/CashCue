import { useState } from "react";
import { CATEGORIES, CANTEENS } from "../constants";
import { tokens } from "../styles";

export default function AddExpenseModal({ onClose, onAdd }) {
  const [amount,  setAmount]  = useState("");
  const [name,    setName]    = useState("");
  const [cat,     setCat]     = useState("Lunch");
  const [canteen, setCanteen] = useState("Main Canteen");
  const [shake,   setShake]   = useState(false);

  const handleSubmit = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0 || !name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onAdd({ id: Date.now(), amount: amt, name: name.trim(), category: cat, canteen, ts: Date.now() });
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.handle} />
        <div style={styles.title}>Add a bite 🍴</div>

        {/* Amount preview */}
        <div style={{ ...styles.amtDisplay, animation: shake ? "shake 0.4s ease" : undefined }}>
          ₹{parseInt(amount) || 0}
        </div>

        <FormField label="Amount (₹)">
          <input
            style={styles.input}
            type="number"
            placeholder="e.g. 80"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
          />
        </FormField>

        <FormField label="What did you eat?">
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. Masala Dosa, Biryani…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </FormField>

        <FormField label="Canteen">
          <div style={styles.canteenGrid}>
            {CANTEENS.map(c => (
              <button
                key={c.name}
                onClick={() => setCanteen(c.name)}
                style={{ ...styles.canteenBtn, ...(canteen === c.name ? styles.canteenBtnSel : {}) }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                <div style={{ fontSize: 11, opacity: .6 }}>{c.sub}</div>
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Meal time">
          <div style={styles.catGrid}>
            {CATEGORIES.map(c => (
              <button
                key={c.name}
                onClick={() => setCat(c.name)}
                style={{
                  ...styles.catBtn,
                  ...(cat === c.name ? { ...styles.catBtnSel, borderColor: c.color, color: c.color } : {}),
                }}
              >
                <span style={{ display: "block", fontSize: 22, marginBottom: 4 }}>{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>
        </FormField>

        <button style={styles.submitBtn} onClick={handleSubmit}>
          Log it! 🔥
        </button>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.72)",
    backdropFilter: "blur(8px)",
    zIndex: 200,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  modal: {
    background: "#16162a",
    border: `1px solid ${tokens.border2}`,
    borderRadius: "28px 28px 0 0",
    width: "100%",
    maxWidth: 460,
    padding: "24px 20px 40px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  handle: {
    width: 40,
    height: 4,
    background: tokens.border2,
    borderRadius: 2,
    margin: "0 auto 24px",
  },
  title: {
    fontFamily: tokens.fontDisplay,
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 20,
    textAlign: "center",
    color: tokens.text,
  },
  amtDisplay: {
    fontFamily: tokens.fontDisplay,
    fontSize: 52,
    fontWeight: 800,
    textAlign: "center",
    margin: "10px 0 20px",
    background: "linear-gradient(135deg,#c084fc,#f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    minHeight: 64,
  },
  label: {
    display: "block",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: tokens.muted,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    width: "100%",
    background: "#ffffff08",
    border: `1px solid ${tokens.border2}`,
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 15,
    color: tokens.text,
    fontFamily: tokens.fontSans,
    outline: "none",
  },
  canteenGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
  },
  canteenBtn: {
    background: "#ffffff08",
    border: `1px solid ${tokens.border}`,
    borderRadius: 12,
    padding: 10,
    textAlign: "left",
    cursor: "pointer",
    color: tokens.muted,
    fontFamily: tokens.fontSans,
    transition: ".2s",
  },
  canteenBtnSel: {
    background: "rgba(244,114,182,.15)",
    borderColor: tokens.accent2,
    color: tokens.accent2,
  },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  catBtn: {
    background: "#ffffff08",
    border: `1px solid ${tokens.border}`,
    borderRadius: 12,
    padding: "10px 6px",
    textAlign: "center",
    cursor: "pointer",
    color: tokens.muted,
    fontSize: 12,
    fontFamily: tokens.fontSans,
    transition: ".2s",
  },
  catBtnSel: {
    background: "rgba(192,132,252,.15)",
  },
  submitBtn: {
    width: "100%",
    padding: 16,
    border: "none",
    borderRadius: 16,
    background: "linear-gradient(135deg,#c084fc,#f472b6)",
    color: "#fff",
    fontFamily: tokens.fontDisplay,
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 20,
  },
};
