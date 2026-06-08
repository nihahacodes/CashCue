export default function AmbientBackground() {
  return (
    <>
      <div style={{
        position: "fixed", top: -200, left: -200,
        width: 600, height: 600,
        background: "radial-gradient(circle,rgba(192,132,252,.07) 0%,transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -200, right: -200,
        width: 500, height: 500,
        background: "radial-gradient(circle,rgba(244,114,182,.06) 0%,transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
    </>
  );
}
