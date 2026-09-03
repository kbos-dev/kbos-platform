export function RuntimeInfrastructureOverview() {
  return (
    <section className="kbos-card kbos-section">
      <div className="kbos-two-col">
        <div>
          <div className="kbos-kicker">Runtime Continuity Infrastructure</div>

          <h2 className="kbos-section-title">
            A governed visibility layer for operations that need review.
          </h2>
        </div>

        <p className="kbos-lede">
          KBOS organizes operational evidence, replay context, uncertainty, and
          human review gates into one inspectable continuity surface. It helps
          institutions understand what happened without pretending software can
          approve, diagnose, govern, or decide by itself.
        </p>
      </div>

      <div className="kbos-proof-grid">
        <div className="kbos-proof-card">
          <div className="kbos-proof-label">Replay Signature</div>
          <h3>Operational events stay reconstructable.</h3>
          <p className="kbos-proof-text">
            Runtime activity can be traced through linked evidence, receipts,
            and continuity context after the moment has passed.
          </p>
        </div>

        <div className="kbos-proof-card">
          <div className="kbos-proof-label">Boundary Signature</div>
          <h3>Uncertainty remains visible.</h3>
          <p className="kbos-proof-text">
            KBOS keeps conclusions bounded, challengeable, and open to human
            review instead of flattening uncertainty into false certainty.
          </p>
        </div>

        <div className="kbos-proof-card">
          <div className="kbos-proof-label">Review Signature</div>
          <h3>Authority stays with the institution.</h3>
          <p className="kbos-proof-text">
            The platform supports visibility and review. It does not approve,
            deny, diagnose, score, surveil, or govern on its own.
          </p>
        </div>
      </div>
    </section>
  );
}
