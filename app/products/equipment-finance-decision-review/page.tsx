import { PublicNavigation } from "@/components/public-site/PublicNavigation";
import { PublicationFooter } from "@/components/public-site/PublicationFooter";

const outcomes = [
  {
    label: "APPROVE",
    text: "The transaction demonstrates acceptable financeability characteristics."
  },
  {
    label: "RESTRUCTURE",
    text: "The transaction may become financeable through reasonable remediation."
  },
  {
    label: "DECLINE",
    text: "The transaction does not currently demonstrate acceptable financeability and no reasonable remediation path is visible."
  }
];

const methodology = [
  "Eligibility Review",
  "Business Viability Review",
  "Credit Posture Review",
  "Equipment Quality Review",
  "Structure Analysis",
  "Documentation Sufficiency Review",
  "Risk Aggregation",
  "Remediation Analysis"
];

const deliverables = [
  "Executive Summary",
  "Risk Assessment Report",
  "Restructure Analysis when applicable",
  "Full Decision Report"
];

const boundaries = [
  "Simulation-only evaluation",
  "Decision support only",
  "Human review required",
  "No loan approval authority",
  "No underwriting authority",
  "No loan origination authority",
  "No automatic financing decisions",
  "No customer scoring",
  "No compliance replacement"
];

export default function EquipmentFinanceDecisionReviewPage() {
  return (
    <main className="kbos-public-main">
      <PublicNavigation />

      <div className="kbos-atmosphere" />

      <div className="kbos-shell">
        <section className="kbos-card kbos-banking-hero">
          <div className="kbos-kicker">BankForge Product</div>

          <h1 className="kbos-hero-title">
            Determine whether a deal is financeable  and how to improve it if it is not.
          </h1>

          <p className="kbos-lede">
            Equipment Finance Decision Review is a structured, evidence-backed review for evaluating
            whether an equipment financing transaction is financeable and whether reasonable
            restructuring could improve the deal before decline is recommended.
          </p>

          <div className="kbos-actions">
            <a href="/products/equipment-finance-decision-review/intake" className="kbos-button-primary">
              Start Equipment Finance Review
            </a>
            <a href="/banking-runtime" className="kbos-button-secondary">
              View Banking Runtime
            </a>
          </div>
        </section>

        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">Who It Is For</div>
          <h2 className="kbos-section-title">
            Built for teams that need explainable financeability review.
          </h2>

          <div className="kbos-proof-columns">
            {[
              "Commercial lenders",
              "Equipment finance professionals",
              "Brokers",
              "Equipment vendors",
              "Business owners seeking equipment financing"
            ].map((item) => (
              <div key={item} className="kbos-proof-column-card">{item}</div>
            ))}
          </div>
        </section>

        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">The Financeability Question</div>
          <h2 className="kbos-section-title">
            Is this transaction financeable, and under what structure?
          </h2>

          <p className="kbos-lede">
            The review analyzes borrower quality, credit posture, equipment quality,
            transaction structure, documentation sufficiency, and overall risk to produce
            a clear recommendation.
          </p>
        </section>

        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">Decision Outputs</div>
          <h2 className="kbos-section-title">
            Three simulation-only decision-support outcomes. No automatic decisions.
          </h2>

          <div className="kbos-replay-flow">
            {outcomes.map((item) => (
              <article key={item.label} className="kbos-replay-step">
                <div className="kbos-proof-label">{item.label}</div>
                <h3>{item.label}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="kbos-boundary-section">
          <div>
            <div className="kbos-kicker">Restructure Before Decline</div>
            <h2>BankForge looks for reasonable remediation before recommending decline.</h2>
          </div>

          <div className="kbos-boundary-grid">
            <div>Financeability risks</div>
            <div>Structure weaknesses</div>
            <div>Documentation gaps</div>
            <div>Credit considerations</div>
            <div>Remediation opportunities</div>
          </div>
        </section>

        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">Methodology Overview</div>
          <h2 className="kbos-section-title">
            Financeability is determined through comprehensive evaluation, not isolated factors.
          </h2>

          <div className="kbos-replay-flow">
            {methodology.map((item, index) => (
              <article key={item} className="kbos-replay-step">
                <div className="kbos-replay-step-number">{String(index + 1).padStart(2, "0")}</div>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">Sample Deliverables</div>
          <h2 className="kbos-section-title">
            What a review can return.
          </h2>

          <div className="kbos-proof-columns">
            {deliverables.map((item) => (
              <div key={item} className="kbos-proof-column-card">{item}</div>
            ))}
          </div>
        </section>

        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">Proof + Trust</div>
          <h2 className="kbos-section-title">
            Evidence-backed findings. Explainable recommendations. Contestable review.
          </h2>

          <p className="kbos-lede">
            The review is designed to make risk, structure, documentation, and remediation
            reasoning easier to inspect. Evidence supports review. Evidence does not replace
            human authority.
          </p>
        </section>

        <section className="kbos-boundary-section">
          <div>
            <div className="kbos-kicker">Boundary Lock</div>
            <h2>BankForge provides decision-support analysis. It does not approve financing.</h2>
          </div>

          <div className="kbos-boundary-grid">
            {boundaries.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </section>

        <section id="request-review-preview" className="kbos-card kbos-section kbos-banking-trust-close">
          <div className="kbos-kicker">Implemented Review Workflow</div>
          <h2 className="kbos-section-title">
            Start with structured intake, then receive a bounded decision-support result.
          </h2>

          <p className="kbos-lede">
            The implemented MVP collects business, equipment, and financing-request inputs,
            validates them, runs a deterministic simulation-only evaluation, and presents an
            explainable result for human review. It does not perform real underwriting, issue
            credit approval or a loan commitment, originate financing, or exercise
            autonomous institutional decision authority. Final authority remains with a
            human reviewer or a separately authorized institution.
          </p>
        </section>

        <PublicationFooter />
      </div>
    </main>
  );
}
