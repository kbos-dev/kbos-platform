"use client";

import {
  type FormEvent,
  useState
} from "react";
import { useRouter } from "next/navigation";
import {
  type EfdrReviewRecord
} from "../../../lib/bankforge/efdr/contract";
import {
  evaluateEfdrIntake
} from "../../../lib/bankforge/efdr/evaluation";
import {
  EFDR_RESULTS_ROUTE,
  EFDR_REVIEW_SESSION_KEY
} from "../../../lib/bankforge/efdr/reviewHandoff";
import styles from "./EfdrIntakeForm.module.css";

function readNumber(
  formData: FormData,
  field: string
): unknown {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return value;
  }

  return Number(trimmed);
}

export function EfdrIntakeForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<readonly string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const input = {
      legalBusinessName:
        formData.get("legalBusinessName"),
      equipmentDescription:
        formData.get("equipmentDescription"),
      equipmentCost:
        readNumber(formData, "equipmentCost"),
      requestedAmount:
        readNumber(formData, "requestedAmount"),
      downPayment:
        readNumber(formData, "downPayment"),
      monthlyRevenue:
        readNumber(formData, "monthlyRevenue"),
      existingMonthlyDebt:
        readNumber(formData, "existingMonthlyDebt"),
      timeInBusinessYears:
        readNumber(formData, "timeInBusinessYears"),
      creditPosture:
        formData.get("creditPosture")
    };

    const evaluation = evaluateEfdrIntake(input);

    if (!evaluation.ok) {
      setErrors(
        evaluation.issues.map((issue) => issue.message)
      );
      setIsSubmitting(false);
      return;
    }

    try {
      if (
        typeof globalThis.crypto?.randomUUID !== "function"
      ) {
        throw new Error(
          "Secure review identifier generation is unavailable."
        );
      }

      const record: EfdrReviewRecord = {
        stableContent: evaluation.stableContent,
        metadata: {
          reviewId: globalThis.crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }
      };

      window.sessionStorage.setItem(
        EFDR_REVIEW_SESSION_KEY,
        JSON.stringify(record)
      );

      router.push(EFDR_RESULTS_ROUTE);
    } catch {
      setErrors([
        "The simulated review could not be prepared in this browser. No result was submitted or authorized."
      ]);
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="kbos-card kbos-section"
      aria-labelledby="efdr-intake-title"
    >
      <div className="kbos-kicker">
        Validated Simulation Intake
      </div>

      <h2
        id="efdr-intake-title"
        className="kbos-section-title"
      >
        Enter the transaction facts for deterministic review.
      </h2>

      <p className="kbos-lede">
        Every field is validated before evaluation. Invalid,
        incomplete, unknown, or internally inconsistent inputs are
        rejected without producing a recommendation.
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        {errors.length > 0 && (
          <div
            className={styles.errorSummary}
            role="alert"
            aria-live="assertive"
          >
            <h3>The review could not proceed.</h3>
            <ul className={styles.errorList}>
              {errors.map((error, index) => (
                <li key={`${index}-${error}`}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Business and equipment</h3>
            <p>
              Identify the business and the equipment included in
              this simulated review.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={`${styles.field} ${styles.fieldWide}`}>
              <label htmlFor="legalBusinessName">
                Legal business name
              </label>
              <input
                id="legalBusinessName"
                name="legalBusinessName"
                type="text"
                minLength={2}
                maxLength={120}
                autoComplete="organization"
                placeholder="Example Equipment LLC"
                required
              />
            </div>

            <div className={`${styles.field} ${styles.fieldWide}`}>
              <label htmlFor="equipmentDescription">
                Equipment description
              </label>
              <input
                id="equipmentDescription"
                name="equipmentDescription"
                type="text"
                minLength={3}
                maxLength={240}
                placeholder="Commercial excavation equipment"
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Capital structure</h3>
            <p>
              The requested amount plus the down payment must equal
              the total equipment cost exactly.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="equipmentCost">
                Equipment cost
              </label>
              <input
                id="equipmentCost"
                name="equipmentCost"
                type="number"
                inputMode="decimal"
                min="1000"
                max="100000000"
                step="0.01"
                placeholder="100000.00"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="requestedAmount">
                Requested amount
              </label>
              <input
                id="requestedAmount"
                name="requestedAmount"
                type="number"
                inputMode="decimal"
                min="1000"
                max="100000000"
                step="0.01"
                placeholder="80000.00"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="downPayment">
                Down payment
              </label>
              <input
                id="downPayment"
                name="downPayment"
                type="number"
                inputMode="decimal"
                min="0"
                max="100000000"
                step="0.01"
                placeholder="20000.00"
                required
              />
              <span className={styles.hint}>
                Enter 0.00 when no down payment is proposed.
              </span>
            </div>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Operating context</h3>
            <p>
              Provide the submitted operating and credit context used
              by this bounded simulation.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="monthlyRevenue">
                Monthly revenue
              </label>
              <input
                id="monthlyRevenue"
                name="monthlyRevenue"
                type="number"
                inputMode="decimal"
                min="1"
                max="1000000000"
                step="0.01"
                placeholder="85000.00"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="existingMonthlyDebt">
                Existing monthly debt
              </label>
              <input
                id="existingMonthlyDebt"
                name="existingMonthlyDebt"
                type="number"
                inputMode="decimal"
                min="0"
                max="1000000000"
                step="0.01"
                placeholder="12000.00"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="timeInBusinessYears">
                Time in business, years
              </label>
              <input
                id="timeInBusinessYears"
                name="timeInBusinessYears"
                type="number"
                inputMode="decimal"
                min="0"
                max="200"
                step="0.1"
                placeholder="6"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="creditPosture">
                Submitted credit posture
              </label>
              <select
                id="creditPosture"
                name="creditPosture"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a posture
                </option>
                <option value="STRONG">Strong</option>
                <option value="MODERATE">Moderate</option>
                <option value="THIN">Thin</option>
                <option value="STRESSED">Stressed</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.boundaryNotice}>
          <strong>
            Simulation-only decision support
          </strong>
          <p>
            This intake does not submit a credit application, perform
            underwriting, approve financing, originate a loan, or
            authorize lending. Any next step requires independent
            human review and applicable institutional controls.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className="kbos-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Preparing review..."
              : "Run deterministic review"}
          </button>

          <div className={styles.submitNote}>
            The validated review record is stored only in this
            browser tab for the intake-to-results handoff. No download,
            entitlement, payment, account, or external delivery service
            is activated.
          </div>
        </div>
      </form>
    </section>
  );
}