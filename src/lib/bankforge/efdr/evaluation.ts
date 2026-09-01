import {
  EFDR_AUTHORITY_BOUNDARY,
  EFDR_CANONICAL_ENGINE_ID,
  EFDR_CONTRACT_VERSION,
  EFDR_PRODUCT_ID,
  type EfdrCreditPosture,
  type EfdrEvaluationResult,
  type EfdrEvidenceItem,
  type EfdrIntakeInput,
  type EfdrReviewRecommendation,
  type EfdrRiskBand,
  type EfdrStableMetrics,
  type EfdrStructureGuidance
} from "./contract";
import { validateEfdrIntake } from "./validation";

const EFDR_DISCLAIMER =
  "Simulation-only decision support. This review does not approve financing, perform underwriting, make a credit decision, or authorize lending.";

function roundPercent(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function getTenureBand(
  years: number
): EfdrStableMetrics["businessTenureBand"] {
  if (years >= 5) {
    return "ESTABLISHED";
  }

  if (years >= 2) {
    return "DEVELOPING";
  }

  return "EARLY";
}

function getFinancingRiskPoints(financedPercent: number): number {
  if (financedPercent > 90) {
    return 3;
  }

  if (financedPercent > 80) {
    return 2;
  }

  if (financedPercent > 70) {
    return 1;
  }

  return 0;
}

function getDebtRiskPoints(
  existingDebtLoadPercent: number
): number {
  if (existingDebtLoadPercent > 35) {
    return 3;
  }

  if (existingDebtLoadPercent > 25) {
    return 2;
  }

  if (existingDebtLoadPercent > 15) {
    return 1;
  }

  return 0;
}

function getTenureRiskPoints(years: number): number {
  if (years < 1) {
    return 3;
  }

  if (years < 2) {
    return 2;
  }

  if (years < 5) {
    return 1;
  }

  return 0;
}

function getCreditRiskPoints(
  creditPosture: EfdrCreditPosture
): number {
  const points: Record<EfdrCreditPosture, number> = {
    STRONG: 0,
    MODERATE: 1,
    THIN: 2,
    STRESSED: 4
  };

  return points[creditPosture];
}

function getRiskBand(riskPoints: number): EfdrRiskBand {
  if (riskPoints <= 2) {
    return "LOWER";
  }

  if (riskPoints <= 5) {
    return "MODERATE";
  }

  if (riskPoints <= 8) {
    return "ELEVATED";
  }

  return "HIGH";
}

function getRecommendation(
  riskPoints: number
): EfdrReviewRecommendation {
  if (riskPoints <= 4) {
    return "ADVANCE_TO_HUMAN_REVIEW";
  }

  if (riskPoints <= 8) {
    return "RESTRUCTURE_BEFORE_REVIEW";
  }

  return "DO_NOT_ADVANCE_WITHOUT_MATERIAL_CHANGE";
}

function buildReasons(
  input: EfdrIntakeInput,
  metrics: EfdrStableMetrics
): readonly string[] {
  const reasons: string[] = [];

  if (metrics.financedPercent <= 70) {
    reasons.push(
      "The proposed capital structure includes a substantial equity contribution."
    );
  } else if (metrics.financedPercent <= 80) {
    reasons.push(
      "The proposed capital structure includes a meaningful equity contribution."
    );
  } else if (metrics.financedPercent <= 90) {
    reasons.push(
      "The proposed financed percentage increases structure sensitivity."
    );
  } else {
    reasons.push(
      "The proposed financed percentage creates a highly leveraged structure."
    );
  }

  if (metrics.existingDebtLoadPercent <= 15) {
    reasons.push(
      "Existing monthly debt is lower relative to reported monthly revenue."
    );
  } else if (metrics.existingDebtLoadPercent <= 25) {
    reasons.push(
      "Existing monthly debt is moderate relative to reported monthly revenue."
    );
  } else if (metrics.existingDebtLoadPercent <= 35) {
    reasons.push(
      "Existing monthly debt is elevated relative to reported monthly revenue."
    );
  } else {
    reasons.push(
      "Existing monthly debt is high relative to reported monthly revenue."
    );
  }

  if (metrics.businessTenureBand === "ESTABLISHED") {
    reasons.push(
      "Reported time in business indicates an established operating history."
    );
  } else if (metrics.businessTenureBand === "DEVELOPING") {
    reasons.push(
      "Reported time in business indicates a developing operating history."
    );
  } else {
    reasons.push(
      "Reported time in business indicates a limited operating history."
    );
  }

  const creditReasons: Record<EfdrCreditPosture, string> = {
    STRONG:
      "The submitted credit posture is categorized as strong.",
    MODERATE:
      "The submitted credit posture is categorized as moderate.",
    THIN:
      "The submitted credit posture is categorized as thin and requires additional review evidence.",
    STRESSED:
      "The submitted credit posture is categorized as stressed and materially increases review sensitivity."
  };

  reasons.push(creditReasons[input.creditPosture]);

  return reasons;
}

function buildEvidence(
  input: EfdrIntakeInput,
  metrics: EfdrStableMetrics
): readonly EfdrEvidenceItem[] {
  return [
    {
      label: "Equipment cost",
      value: formatMoney(input.equipmentCost),
      relevance: "Defines the total simulated acquisition cost."
    },
    {
      label: "Requested amount",
      value: formatMoney(input.requestedAmount),
      relevance: "Defines the simulated financed amount."
    },
    {
      label: "Down payment",
      value: formatMoney(input.downPayment),
      relevance: "Defines the submitted equity contribution."
    },
    {
      label: "Financed percentage",
      value: formatPercent(metrics.financedPercent),
      relevance: "Shows simulated leverage against equipment cost."
    },
    {
      label: "Existing debt load",
      value: formatPercent(metrics.existingDebtLoadPercent),
      relevance: "Compares existing monthly debt with reported monthly revenue."
    },
    {
      label: "Time in business",
      value: `${input.timeInBusinessYears.toFixed(2)} years`,
      relevance: "Provides submitted operating-history context."
    },
    {
      label: "Credit posture",
      value: input.creditPosture,
      relevance: "Provides the submitted credit-context category."
    }
  ];
}

function buildStructureGuidance(
  input: EfdrIntakeInput,
  metrics: EfdrStableMetrics
): EfdrStructureGuidance {
  const guidance: string[] = [];

  if (metrics.financedPercent > 80) {
    guidance.push(
      "Consider increasing the equity contribution to reduce the financed percentage to 80% or less."
    );
  } else {
    guidance.push(
      "The submitted equity contribution keeps the financed percentage at 80% or less."
    );
  }

  if (metrics.existingDebtLoadPercent > 25) {
    guidance.push(
      "Review debt reduction or additional verified cash-flow evidence before advancing."
    );
  } else {
    guidance.push(
      "Existing debt load does not independently trigger restructuring guidance."
    );
  }

  if (metrics.businessTenureBand === "EARLY") {
    guidance.push(
      "Request additional operating-history and revenue evidence."
    );
  }

  if (
    input.creditPosture === "THIN" ||
    input.creditPosture === "STRESSED"
  ) {
    guidance.push(
      "Request additional credit evidence and compensating factors."
    );
  }

  guidance.push(
    "Any next step requires independent human review and applicable institutional controls."
  );

  return {
    requestedAmount: input.requestedAmount,
    downPayment: input.downPayment,
    financedPercent: metrics.financedPercent,
    guidance
  };
}

export function evaluateEfdrIntake(
  input: unknown
): EfdrEvaluationResult {
  const validation = validateEfdrIntake(input);

  if (!validation.ok) {
    return validation;
  }

  const normalizedInput = validation.value;

  const financedPercent = roundPercent(
    (normalizedInput.requestedAmount /
      normalizedInput.equipmentCost) *
      100
  );

  const downPaymentPercent = roundPercent(
    (normalizedInput.downPayment /
      normalizedInput.equipmentCost) *
      100
  );

  const existingDebtLoadPercent = roundPercent(
    (normalizedInput.existingMonthlyDebt /
      normalizedInput.monthlyRevenue) *
      100
  );

  const businessTenureBand = getTenureBand(
    normalizedInput.timeInBusinessYears
  );

  const riskPoints =
    getFinancingRiskPoints(financedPercent) +
    getDebtRiskPoints(existingDebtLoadPercent) +
    getTenureRiskPoints(normalizedInput.timeInBusinessYears) +
    getCreditRiskPoints(normalizedInput.creditPosture);

  const metrics: EfdrStableMetrics = {
    financedPercent,
    downPaymentPercent,
    existingDebtLoadPercent,
    businessTenureBand,
    riskBand: getRiskBand(riskPoints)
  };

  return {
    ok: true,
    stableContent: {
      contractVersion: EFDR_CONTRACT_VERSION,
      productId: EFDR_PRODUCT_ID,
      engineId: EFDR_CANONICAL_ENGINE_ID,
      authority: EFDR_AUTHORITY_BOUNDARY,
      normalizedInput,
      recommendation: getRecommendation(riskPoints),
      metrics,
      reasons: buildReasons(normalizedInput, metrics),
      evidence: buildEvidence(normalizedInput, metrics),
      structureGuidance: buildStructureGuidance(
        normalizedInput,
        metrics
      ),
      disclaimer: EFDR_DISCLAIMER
    }
  };
}