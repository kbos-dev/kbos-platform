const runtimeLayers = [
  "Governance",
  "Replay",
  "Registry",
  "Routing",
  "Isolation",
];

const platformSurfaces = [
  "Runtime shell",
  "Replay records",
  "Governance checks",
  "Operational traces",
  "Status surfaces",
];

const principles = [
  {
    title: "Replayable operations",
    body: "Every important action should leave enough evidence to understand what happened, why it happened, and what changed.",
  },
  {
    title: "Bounded execution",
    body: "KBOS favors explicit limits, visible state, and governed pathways over hidden automation or open-ended behavior.",
  },
  {
    title: "Recoverable systems",
    body: "Operational infrastructure should support review, recovery, and continuity when systems change or fail.",
  },
];

function KBOSMark({ active = false }: { active?: boolean }) {
  return (
    <svg
      className={active ? "kbos-mark kbos-mark-active" : "kbos-mark"}
      viewBox="0 0 256 256"
      aria-label="KBOS mark"
      role="img"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path className="mark-spine" d="M72 54 V112" />
        <path className="mark-spine" d="M72 144 V202" />
        <path className="mark-frame" d="M72 54 H116" />
        <path className="mark-frame" d="M72 202 H116" />
        <path className="mark-route" d="M103 128 H145" />
        <path className="mark-route" d="M145 128 L188 85" />
        <path className="mark-route" d="M145 128 L188 171" />
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            KBOS.dev
          </div>

          <h1>Governed Runtime Infrastructure</h1>

          <p className="hero-subtitle">
            Deterministic execution. Replayable operations. Operational
            visibility built into the runtime itself.
          </p>

          <p className="hero-note">
            Designed for systems that must remain observable, recoverable, and
            governed under real operational pressure.
          </p>

          <div className="hero-actions">
            <a href="#runtime" className="primary-link">
              View Runtime Shell
            </a>
            <a href="#architecture" className="secondary-link">
              Explore Architecture
            </a>
          </div>
        </div>

        <div className="runtime-card" aria-label="KBOS runtime preview">
          <div className="card-header">
            <span>runtime.governance</span>
            <span className="card-state">ACTIVE</span>
          </div>

          <div className="mark-stage">
            <KBOSMark active />
          </div>

          <div className="trace-log">
            <div>
              <span className="muted">trace_id</span>
              <span>kbos.route.0001</span>
            </div>
            <div>
              <span className="muted">authority</span>
              <span>governed</span>
            </div>
            <div>
              <span className="muted">state</span>
              <span className="blue">checkpoint resolved</span>
            </div>
          </div>
        </div>
      </section>

      <section id="runtime" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Operational Model</p>
          <h2>
            Built for systems that must stay visible through change, failure,
            and scale.
          </h2>
        </div>

        <div className="principle-grid inner-grid">
          {principles.map((item) => (
            <article className="principle-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Runtime Architecture</p>
          <h2>
            Authority, replay, routing, and isolation are treated as operating
            requirements.
          </h2>
        </div>

        <div className="layer-strip">
          {runtimeLayers.map((layer, index) => (
            <div className="layer-card" key={layer}>
              <span className="layer-index">0{index + 1}</span>
              <span>{layer}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Platform Surfaces</p>
          <h2>
            The interface stays downstream from runtime truth, receipts, and
            observable state.
          </h2>
        </div>

        <div className="forge-grid">
          {platformSurfaces.map((surface) => (
            <div className="forge-card" key={surface}>
              <KBOSMark />
              <span>{surface}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="console-panel">
        <div className="console-top">
          <span>KBOS runtime console</span>
          <span>monochrome identity / cobalt active state</span>
        </div>

        <pre>
{`> kbos run --trace
authority: governed
route: resolved
checkpoint: passed
receipt: written
status: observable`}
        </pre>
      </section>

      <footer>
        <span>KBOS</span>
        <span>Composed Infrastructure Intelligence</span>
      </footer>
    </main>
  );
}