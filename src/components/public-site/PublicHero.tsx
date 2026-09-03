export function PublicHero() {
  return (
    <section className="kbos-card kbos-hero">
      <div className="kbos-kicker">KBOS Operational Continuity Surface</div>

      <div className="kbos-hero-continuity-rail" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <h1 className="kbos-hero-title">
        Replayable operations. Bounded authority. Evidence people can challenge.
      </h1>

      <p className="kbos-lede">
        KBOS helps institutions show what happened, what evidence supports it,
        what remains uncertain, and where human review still controls the final
        judgment.
      </p>

      <div className="kbos-actions">
        <a href="/runtime-infrastructure" className="kbos-button-primary">
          Understand KBOS
        </a>

        <a href="/scenarios" className="kbos-button-secondary">
          See Review Examples
        </a>
      </div>

      <div className="kbos-proof-grid">
        <div className="kbos-proof-card">
          <div className="kbos-proof-label">30 Seconds</div>
          <h3>KBOS makes operations reviewable.</h3>
          <p className="kbos-proof-text">
            It keeps operational evidence visible so people can inspect what
            happened instead of trusting a black box.
          </p>
        </div>

        <div className="kbos-proof-card">
          <div className="kbos-proof-label">2 Minutes</div>
          <h3>Authority stays bounded.</h3>
          <p className="kbos-proof-text">
            KBOS does not approve, deny, diagnose, score, or govern. It supports
            review without replacing judgment.
          </p>
        </div>

        <div className="kbos-proof-card">
          <div className="kbos-proof-label">5 Minutes</div>
          <h3>Replay makes trust inspectable.</h3>
          <p className="kbos-proof-text">
            Events, boundaries, evidence, and handoffs can be reconstructed
            later so institutions can challenge the record.
          </p>
        </div>
      </div>
    </section>
  );
}
