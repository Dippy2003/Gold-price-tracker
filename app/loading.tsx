export default function Loading() {
  return (
    <main className="jewelry-page">
      <div className="jewelry-ambient" aria-hidden="true">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>
      <div className="jewelry-content" style={{ animation: "none" }}>
        <div
          style={{
            height: 140,
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
          className="animate-pulse"
        />
        <div className="price-grid">
          <div className="price-card animate-pulse" style={{ height: 150 }} />
          <div className="price-card animate-pulse" style={{ height: 150 }} />
          <div className="price-card animate-pulse" style={{ height: 150 }} />
        </div>
        <div
          className="animate-pulse"
          style={{
            height: 220,
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        />
      </div>
    </main>
  );
}
