import { PublicNavigation } from "@/components/public-site/PublicNavigation";
import { DoctrineStrip } from "@/components/public-site/DoctrineStrip";
import { PublicHero } from "@/components/public-site/PublicHero";
import { RuntimeInfrastructureOverview } from "@/components/public-site/RuntimeInfrastructureOverview";
import { ManualReviewGateNotice } from "@/components/public-site/ManualReviewGateNotice";
import { BoundaryBlock } from "@/components/public-site/BoundaryBlock";
import { PublicationFooter } from "@/components/public-site/PublicationFooter";

export default function HomePage() {
  return (
    <main className="kbos-public-main">
      <PublicNavigation />
      <DoctrineStrip />

      <div className="kbos-atmosphere" />

      <div className="kbos-shell">
        <PublicHero />

        <RuntimeInfrastructureOverview />

        <section className="kbos-card kbos-section">
          <div className="kbos-kicker">First Product Application</div>

          <h2 className="kbos-section-title">
            Equipment Finance Decision Review is the first public BankForge product experience.
          </h2>

          <p className="kbos-lede">
            After the platform, proof, runtime, and scenario corridors, KBOS now shows
            its first bounded commercial application: structured equipment finance review
            focused on financeability, risk visibility, remediation pathways, and human review.
          </p>

          <div className="kbos-actions">
            <a href="/products/equipment-finance-decision-review" className="kbos-button-primary">
              View Equipment Finance Review
            </a>
            <a href="/proof-and-replay" className="kbos-button-secondary">
              See Proof + Replay First
            </a>
          </div>
        </section>

        <ManualReviewGateNotice />

        <BoundaryBlock />

        <PublicationFooter />
      </div>
    </main>
  );
}
