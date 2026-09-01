import Image from "next/image";

export function PublicationFooter() {
  return (
    <footer className="kbos-card kbos-section kbos-footer-signature">
      <div className="kbos-footer-trust-rail" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="kbos-footer-grid">
        <div>
          <Image
            src="/brand/m08/M08_PRIMARY_LOGO_LIGHT.png"
            alt="KBOS"
            width={188}
            height={71}
            className="kbos-footer-logo"
          />

          <p className="kbos-lede">
            KBOS is a public operational visibility platform for replayable,
            reviewable, human-governed continuity work. It helps institutions
            inspect evidence and preserve uncertainty without turning the
            system into an authority.
          </p>

          <div className="kbos-footer-truth-line">
            Replayable operations. Bounded evidence. Human review remains in control.
          </div>
        </div>

        <div className="kbos-boundary-box kbos-footer-boundary-box">
          <div className="kbos-proof-label">Boundary Lock</div>

          <ul className="kbos-boundary-list">
            <li>No autonomous governance.</li>
            <li>No surveillance scoring.</li>
            <li>No medical or compliance authority.</li>
            <li>Human review remains required.</li>
          </ul>
        </div>
      </div>

      <div className="kbos-footer-bottom">
        Evidence supports review. Evidence does not determine final truth.
      </div>
    </footer>
  );
}
