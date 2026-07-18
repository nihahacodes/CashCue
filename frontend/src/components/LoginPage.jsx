import { tokens } from "../styles";

export default function LoginPage({ onSignIn, error, loading }) {
  return (
    <div style={s.page}>
      {/* Ambient glows */}
      <div style={s.glow1} />
      <div style={s.glow2} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoEmoji}></div>
          <div style={s.logoText}>CashCue</div>
          <div style={s.logoSub}>campus food tracker</div>
        </div>

        {/* Illustration */}
        <div style={s.illustration}>
          {["🍛", "🧆", "☕", "🍱", "🥤", "🍿"].map((e, i) => (
            <div
              key={i}
              style={{
                ...s.floatingEmoji,
                animationDelay: `${i * 0.4}s`,
                top:  `${[10, 5, 60, 70, 15, 55][i]}%`,
                left: `${[5, 75, 80, 8, 40, 42][i]}%`,
                fontSize: [28, 24, 22, 26, 20, 24][i],
              }}
            >
              {e}
            </div>
          ))}
        </div>

        {/* Headline */}
        <div style={s.headline}>
          Track every bite,<br />own your budget 
        </div>
        <div style={s.subline}>
          Log canteen spending, spot patterns, stay on budget — all in one place.
        </div>

        {/* Features */}
       

        {/* Error */}
        {error && <div style={s.error}>{error}</div>}

        {/* Sign in button */}
        <button
          style={{ ...s.googleBtn, opacity: loading ? 0.7 : 1 }}
          onClick={onSignIn}
          disabled={loading}
        >
          <GoogleIcon />
          <span>{loading ? "Signing in…" : "Continue with Google"}</span>
        </button>

        <div style={s.disclaimer}>
          By continuing, your Google name and profile photo will be used. No passwords. No spam.
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-1.9 13.6-5.1l-6.3-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.6-2.9-11.3-7H6.3C9.7 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.3 5.2C41.1 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: tokens.fontSans,
    position: "relative",
    overflow: "hidden",
  },
  glow1: {
    position: "fixed", top: -150, left: -150, width: 500, height: 500,
    background: "radial-gradient(circle,rgba(192,132,252,.1) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  glow2: {
    position: "fixed", bottom: -150, right: -150, width: 400, height: 400,
    background: "radial-gradient(circle,rgba(244,114,182,.08) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    background: "#12121a",
    border: "1px solid #ffffff14",
    borderRadius: 28,
    padding: "36px 28px 28px",
    width: "100%",
    maxWidth: 400,
    position: "relative",
    zIndex: 1,
  },
  logoWrap:  { textAlign: "center", marginBottom: 24 },
  logoEmoji: { fontSize: 52, marginBottom: 8 },
  logoText:  {
    fontFamily: tokens.fontDisplay, fontSize: 32, fontWeight: 800,
    background: "linear-gradient(135deg,#c084fc,#f472b6)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  logoSub: { fontSize: 13, color: tokens.muted, marginTop: 2 },

  illustration: { position: "relative", height: 100, marginBottom: 8 },
  floatingEmoji: {
    position: "absolute",
    animation: "float 3s ease-in-out infinite alternate",
    userSelect: "none",
  },

  headline: {
    fontFamily: tokens.fontDisplay, fontSize: 26, fontWeight: 800,
    color: tokens.text, textAlign: "center", lineHeight: 1.3, marginBottom: 10,
  },
  subline: {
    fontSize: 13, color: tokens.muted, textAlign: "center",
    lineHeight: 1.6, marginBottom: 24,
  },

  features: { marginBottom: 24 },
  featureRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "8px 0", borderBottom: "1px solid #ffffff08",
  },
  featureIcon: { fontSize: 20, flexShrink: 0 },
  featureText: { fontSize: 14, color: tokens.text },

  error: {
    background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)",
    borderRadius: 10, padding: "10px 14px", fontSize: 13,
    color: tokens.red, marginBottom: 14, textAlign: "center",
  },

  googleBtn: {
    width: "100%", padding: "14px 20px",
    background: "#ffffff", border: "none", borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 12, cursor: "pointer", fontSize: 15, fontWeight: 600,
    color: "#1a1a2e", fontFamily: tokens.fontSans,
    boxShadow: "0 4px 20px rgba(0,0,0,.3)",
    transition: ".2s",
  },

  disclaimer: {
    fontSize: 11, color: "#5a567a", textAlign: "center",
    marginTop: 14, lineHeight: 1.6,
  },
};
