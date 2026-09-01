"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type EfdrReviewRecommendation,
  type EfdrReviewRecord
} from "../../../lib/bankforge/efdr/contract";
import {
  EFDR_INTAKE_ROUTE,
  EFDR_REVIEW_SESSION_KEY
} from "../../../lib/bankforge/efdr/reviewHandoff";
import {
  restoreEfdrReviewRecord
} from "../../../lib/bankforge/efdr/reviewRecord";
import styles from "./EfdrResults.module.css";

type ReviewState =
  | {
      readonly status: "loading";
    }
  | {
      readonly status: "ready";
      readonly record: EfdrReviewRecord;
    }
  | {
      readonly status: "unavailable";
      readonly message: string;
    };

const recommendationLabels: Record<
  EfdrReviewRecommendation,
  string
> = {
  ADVANCE_TO_HUMAN_REVIEW:
    "Advance to human review",
  RESTRUCTURE_BEFORE_REVIEW:
    "Restructure before review",
  DO_NOT_ADVANCE_WITHOUT_MATERIAL_CHANGE:
    "Do not advance without material change"
};

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function EfdrResults() {
  const router = useRouter();

  const [state, setState] = useState<ReviewState>({
    status: "loading"
  });

  useEffect(() => {
    try {
      const serializedRecord =
        window.sessionStorage.getItem(
          EFDR_REVIEW_SESSION_KEY
        );

      const restored =
        restoreEfdrReviewRecord(serializedRecord);

      if (!restored.ok) {
        setState({
          status: "unavailable",
          message: restored.message
        });
        return;
      }

      setState({
        status: "ready",
        record: restored.record
      });
    } catch {
      setState({
        status: "unavailable",
        message:
          "The review record could not be safely read in this browser."
      });
    }
  }, []);

  const clearAndRestart = (): void => {
    try {
      window.sessionStorage.removeItem(
        EFDR_REVIEW_SESSION_KEY
      );
    } finally {
      router.replace(EFDR_INTAKE_ROUTE);
    }
  };

  if (state.status === "loading") {
    return (
      <section
        className={`kbos-card kbos-section ${styles.stateCard}`}
        aria-live="polite"
      >
        <div className="kbos-kicker">
          Verification in progress
        </div>

        <h2 className="kbos-section-title">
          Checking the review record
        </h2>

        <p className={styles.stateText}>
          The stored result is being recomputed and checked before
          anything is displayed.
        </p>
      </section>
    );
  }

  if (state.status === "unavailable") {
    return (
      <section
        className={`kbos-card kbos-section ${styles.stateCard}`}
        role="alert"
      >
        <div className="kbos-kicker">
          Result unavailable
        </div>

        <h2 className="kbos-section-title">
          This review failed closed.
        </h2>

        <p className={styles.stateText}>
          {state.message} No recommendation was restored or treated
          as authoritative.
        </p>

        <div className={`kbos-actions ${styles.actions}`}>
          <Link
            href={EFDR_INTAKE_ROUTE}
            className="kbos-button-primary"
          >
            Start a new review
          </Link>

          <Link
            href="/products/equipment-finance-decision-review"
            className="kbos-button-secondary"
          >
            Return to product overview
          </Link>
        </div>
      </section>
    );
  }

  const { stableContent, metadata } = state.record;
  const { metrics, normalizedInput } = stableContent;

  return (
    <div className={styles.stack}>
      <section
        className={`kbos-card kbos-section ${styles.recommendation}`}
        data-band={metrics.riskBand}
      >
        <div className="kbos-kicker">
          Simulation Result
        </div>

        <div className={styles.recommendationLabel}>
          {recommendationLabels[stableContent.recommendation]}
        </div>

        <p className="kbos-lede">
          This is a deterministic decision-support recommendation
          for human review. It is not a financing approval, credit
          decision, underwriting action, or lending authorization.
        </p>

        <div className={styles.context}>
          <div className={styles.contextCard}>
            <span className={styles.label}>
              Review context
            </span>
            <span className={styles.value}>
              {normalizedInput.legalBusinessName}
            </span>
            <p>
              {normalizedInput.equipmentDescription}
            </p>
          </div>

          <div className={`${styles.contextCard} ${styles.recordMeta}`}>
            <div>
              <span className={styles.label}>
                Review ID
              </span>
              <span className={styles.value}>
                {metadata.reviewId}
              </span>
            </div>

            <div>
              <span className={styles.label}>
                Created
              </span>
              <span className={styles.value}>
                {metadata.createdAt}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="kbos-card kbos-section">
        <div className="kbos-kicker">
          Review Metrics
        </div>

        <h2 className="kbos-section-title">
          The submitted structure at a glance
        </h2>

        <div className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <span className={styles.label}>
              Financed
            </span>
            <span className={styles.metricValue}>
              {formatPercent(metrics.financedPercent)}
            </span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.label}>
              Down payment
            </span>
            <span className={styles.metricValue}>
              {formatPercent(metrics.downPaymentPercent)}
            </span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.label}>
              Existing debt load
            </span>
            <span className={styles.metricValue}>
              {formatPercent(
                metrics.existingDebtLoadPercent
              )}
            </span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.label}>
              Review risk band
            </span>
            <span className={styles.metricValue}>
              {metrics.riskBand}
            </span>
          </div>
        </div>
      </section>

      <section className="kbos-card kbos-section">
        <div className="kbos-kicker">
          Explainable Reasons
        </div>

        <h2 className="kbos-section-title">
          Why this recommendation was produced
        </h2>

        <ol className={styles.list}>
          {stableContent.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ol>
      </section>

      <section className="kbos-card kbos-section">
        <div className="kbos-kicker">
          Review Evidence
        </div>

        <h2 className="kbos-section-title">
          Evidence used in the bounded evaluation
        </h2>

        <div className={styles.evidenceGrid}>
          {stableContent.evidence.map((item) => (
            <article
              key={item.label}
              className={styles.evidenceItem}
            >
              <span className={styles.label}>
                {item.label}
              </span>
              <span className={styles.value}>
                {item.value}
              </span>
              <p>{item.relevance}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kbos-card kbos-section">
        <div className="kbos-kicker">
          Structure Guidance
        </div>

        <h2 className="kbos-section-title">
          Reviewable remediation and next-step guidance
        </h2>

        <div className={styles.structureSummary}>
          <span className={styles.structurePill}>
            Requested:{" "}
            {formatMoney(
              stableContent.structureGuidance.requestedAmount
            )}
          </span>

          <span className={styles.structurePill}>
            Down payment:{" "}
            {formatMoney(
              stableContent.structureGuidance.downPayment
            )}
          </span>

          <span className={styles.structurePill}>
            Financed:{" "}
            {formatPercent(
              stableContent.structureGuidance.financedPercent
            )}
          </span>
        </div>

        <ul className={styles.list}>
          {stableContent.structureGuidance.guidance.map(
            (guidance) => (
              <li key={guidance}>{guidance}</li>
            )
          )}
        </ul>
      </section>

      <section className="kbos-card kbos-section">
        <div className={styles.boundary}>
          <strong>
            Simulation-only authority boundary
          </strong>
          <p>{stableContent.disclaimer}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="kbos-button-primary"
            onClick={clearAndRestart}
          >
            Clear record and start again
          </button>

          <Link
            href="/products/equipment-finance-decision-review"
            className="kbos-button-secondary"
          >
            Return to product overview
          </Link>
        </div>
      </section>
    </div>
  );
}