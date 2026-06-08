export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0a0a0f; }

  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input::placeholder { color: #5a567a; }

  ::-webkit-scrollbar { display: none; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-8px); }
    75%       { transform: translateX(8px); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes float {
    from { transform: translateY(0px) rotate(-4deg); }
    to   { transform: translateY(-12px) rotate(4deg); }
  }
`;

export const tokens = {
  bg:        "#0a0a0f",
  surface:   "#12121a",
  surface2:  "#1a1a26",
  border:    "#ffffff14",
  border2:   "#ffffff22",
  text:      "#f0eeff",
  muted:     "#8884a8",
  accent:    "#c084fc",
  accent2:   "#f472b6",
  accent3:   "#34d399",
  accent4:   "#fb923c",
  accent5:   "#60a5fa",
  red:       "#f87171",
  fontSans:  "'Space Grotesk', sans-serif",
  fontDisplay: "'Syne', sans-serif",
};
