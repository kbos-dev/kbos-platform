export function ManualReviewGateNotice() {
  return (
    <section className="kbos-card kbos-section">
      <div className="kbos-two-col">
        <div>
          <div className="kbos-kicker">Human Review Layer</div>

          <h2 className="kbos-section-title">
            Evidence can support judgment. It cannot replace it.
          </h2>
        </div>

        <p className="kbos-lede">
          KBOS is built around a simple boundary: operational evidence should
          become easier to inspect, but final institutional meaning must remain
          challengeable, reviewable, and human-governed.
        </p>
      </div>

      <div className="kbos-proof-grid">
        <div className="kbos-proof-card">
          <div className="kbos-proof-label">No autonomous authority</div>
          <p className="kbos-proof-text">
            KBOS does not approve, deny, diagnose, score, or govern by itself.
          </p>
        </div>

        <div className="kbos-proof-card">
          <div className="kbos-proof-label">Visible uncertainty</div>
          <p className="kbos-proof-text">
            Unknowns stay visible instead of being hidden behind confident
            system language.
          </p>
        </div>

        <div className="kbos-proof-card">
          <div className="kbos-proof-label">Challengeable evidence</div>
          <p className="kbos-proof-text">
            Evidence supports review. It does not become final truth.
          </p>
        </div>
      </div>
    </section>
  );
}
