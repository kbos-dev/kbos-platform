import type { Metadata } from "next";
import { PublicNavigation } from "@/components/public-site/PublicNavigation";
import { PublicationFooter } from "@/components/public-site/PublicationFooter";
import { EfdrResults } from "@/components/bankforge/efdr/EfdrResults";

export const metadata: Metadata = {
  title: "Equipment Finance Review Results | KBOS",
  description:
    "Reviewable deterministic results for the BankForge Equipment Finance Decision Review simulation."
};

export default function EfdrResultsPage() {
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
            Equipment Finance Decision Review results
          </h1>

          <p className="kbos-lede">
            Review the deterministic recommendation, supporting
            reasons, submitted evidence, structure guidance, and
            explicit authority boundary. Stored content is verified
            through deterministic recomputation before display.
          </p>
        </section>

        <EfdrResults />

        <PublicationFooter />
      </div>
    </main>
  );
}