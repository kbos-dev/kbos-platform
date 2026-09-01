export const EFDR_CONTRACT_VERSION = "1.0.0" as const;

export const EFDR_PRODUCT_ID =
  "BF_EQUIPMENT_FINANCE_DECISION_REVIEW" as const;

export const EFDR_CANONICAL_ENGINE_ID =
  "bankforge.efdr.deterministic.v1" as const;

export const EFDR_AUTHORITY_BOUNDARY = {
  classification: "SIMULATION_ONLY_DECISION_SUPPORT",
  decisionSupportOnly: true,
  lendingAuthority: false,
  underwritingAuthority: false,
  creditApprovalAuthority: false
} as const;

export const EFDR_CREDIT_POSTURES = [
  "STRONG",
  "MODERATE",
  "THIN",
  "STRESSED"
] as const;

export type EfdrCreditPosture =
  (typeof EFDR_CREDIT_POSTURES)[number];

export type EfdrIntakeInput = {
  legalBusinessName: string;
  equipmentDescription: string;
  equipmentCost: number;
  requestedAmount: number;
  downPayment: number;
  monthlyRevenue: number;
  existingMonthlyDebt: number;
  timeInBusinessYears: number;
  creditPosture: EfdrCreditPosture;
};

export type EfdrValidationCode =
  | "INPUT_NOT_OBJECT"
  | "UNKNOWN_FIELD"
  | "MISSING_FIELD"
  | "INVALID_STRING"
  | "INVALID_NUMBER"
  | "NON_FINITE_NUMBER"
  | "VALUE_NOT_POSITIVE"
  | "VALUE_NEGATIVE"
  | "VALUE_OUT_OF_RANGE"
  | "INVALID_CREDIT_POSTURE"
  | "CAPITAL_STACK_MISMATCH";

export type EfdrValidationIssue = {
  readonly code: EfdrValidationCode;
  readonly field: keyof EfdrIntakeInput | "$input";
  readonly message: string;
};

export type EfdrValidationFailure = {
  readonly ok: false;
  readonly issues: readonly EfdrValidationIssue[];
};

export type EfdrValidationSuccess = {
  readonly ok: true;
  readonly value: EfdrIntakeInput;
};

export type EfdrValidationResult =
  | EfdrValidationFailure
  | EfdrValidationSuccess;

export type EfdrReviewRecommendation =
  | "ADVANCE_TO_HUMAN_REVIEW"
  | "RESTRUCTURE_BEFORE_REVIEW"
  | "DO_NOT_ADVANCE_WITHOUT_MATERIAL_CHANGE";

export type EfdrRiskBand =
  | "LOWER"
  | "MODERATE"
  | "ELEVATED"
  | "HIGH";

export type EfdrStableMetrics = {
  readonly financedPercent: number;
  readonly downPaymentPercent: number;
  readonly existingDebtLoadPercent: number;
  readonly businessTenureBand:
    | "ESTABLISHED"
    | "DEVELOPING"
    | "EARLY";
  readonly riskBand: EfdrRiskBand;
};

export type EfdrEvidenceItem = {
  readonly label: string;
  readonly value: string;
  readonly relevance: string;
};

export type EfdrStructureGuidance = {
  readonly requestedAmount: number;
  readonly downPayment: number;
  readonly financedPercent: number;
  readonly guidance: readonly string[];
};

export type EfdrStableDecisionContent = {
  readonly contractVersion: typeof EFDR_CONTRACT_VERSION;
  readonly productId: typeof EFDR_PRODUCT_ID;
  readonly engineId: typeof EFDR_CANONICAL_ENGINE_ID;
  readonly authority: typeof EFDR_AUTHORITY_BOUNDARY;
  readonly normalizedInput: EfdrIntakeInput;
  readonly recommendation: EfdrReviewRecommendation;
  readonly metrics: EfdrStableMetrics;
  readonly reasons: readonly string[];
  readonly evidence: readonly EfdrEvidenceItem[];
  readonly structureGuidance: EfdrStructureGuidance;
  readonly disclaimer: string;
};

export type EfdrVolatileRecordMetadata = {
  readonly reviewId: string;
  readonly createdAt: string;
};

export type EfdrReviewRecord = {
  readonly stableContent: EfdrStableDecisionContent;
  readonly metadata: EfdrVolatileRecordMetadata;
};

export type EfdrEvaluationSuccess = {
  readonly ok: true;
  readonly stableContent: EfdrStableDecisionContent;
};

export type EfdrEvaluationFailure = {
  readonly ok: false;
  readonly issues: readonly EfdrValidationIssue[];
};

export type EfdrEvaluationResult =
  | EfdrEvaluationSuccess
  | EfdrEvaluationFailure;