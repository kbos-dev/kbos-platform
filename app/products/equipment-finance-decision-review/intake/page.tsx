import type { Metadata } from "next";
import Link from "next/link";
import { PublicNavigation } from "@/components/public-site/PublicNavigation";
import { PublicationFooter } from "@/components/public-site/PublicationFooter";
import { EfdrIntakeForm } from "@/components/bankforge/efdr/EfdrIntakeForm";

export const metadata: Metadata = {
  title: "Equipment Finance Review Intake | KBOS",
  description:
    "Validated simulation intake for the BankForge Equipment Finance Decision Review."
};

const boundaries = [
  "Simulation only",
  "Decision support only",
  "Human review required",
  "No lending authority",
  "No underwriting authority",
  "No credit approval authority"
];

export default function EfdrIntakePage() {
  return (
    <main className="kbos-public-main">
      <PublicNavigation />

      <div className="kbos-atmosphere" />

      <div className="kbos-shell">
        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">
            BankForge EFDR
          </div>

          <h1 className="kbos-section-title">
            Equipment Finance Decision Review intake
          </h1>

          <p className="kbos-lede">
            Submit a bounded set of transaction facts for a
            deterministic, explainable review. This workflow produces
            simulation-only decision support and does not make a
            lending or credit decision.
          </p>

          <div className="kbos-actions">
            <Link
              href="/products/equipment-finance-decision-review"
              className="kbos-button-secondary"
            >
              Review product overview
            </Link>
          </div>
        </section>

        <EfdrIntakeForm />

        <section className="kbos-boundary-section">
          <div>
            <div className="kbos-kicker">
              Authority Boundary
            </div>

            <h2>
              Evidence supports review. Human authority remains in
              control.
            </h2>
          </div>

          <div className="kbos-boundary-grid">
            {boundaries.map((boundary) => (
              <div key={boundary}>{boundary}</div>
            ))}
          </div>
        </section>

        <PublicationFooter />
      </div>
    </main>
  );
}