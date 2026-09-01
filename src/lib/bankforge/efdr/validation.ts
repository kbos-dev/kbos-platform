import {
  EFDR_CREDIT_POSTURES,
  type EfdrCreditPosture,
  type EfdrIntakeInput,
  type EfdrValidationCode,
  type EfdrValidationIssue,
  type EfdrValidationResult
} from "./contract";

const INTAKE_FIELDS = [
  "legalBusinessName",
  "equipmentDescription",
  "equipmentCost",
  "requestedAmount",
  "downPayment",
  "monthlyRevenue",
  "existingMonthlyDebt",
  "timeInBusinessYears",
  "creditPosture"
] as const satisfies readonly (keyof EfdrIntakeInput)[];

const INTAKE_FIELD_SET = new Set<string>(INTAKE_FIELDS);

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function hasOwn(
  record: Record<string, unknown>,
  field: string
): boolean {
  return Object.prototype.hasOwnProperty.call(record, field);
}

function hasAtMostTwoDecimalPlaces(value: number): boolean {
  const scaled = value * 100;
  return Math.abs(scaled - Math.round(scaled)) < 1e-7;
}

function normalizeMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function isCreditPosture(value: string): value is EfdrCreditPosture {
  return (EFDR_CREDIT_POSTURES as readonly string[]).includes(value);
}

export function validateEfdrIntake(
  input: unknown
): EfdrValidationResult {
  if (!isPlainRecord(input)) {
    return {
      ok: false,
      issues: [
        {
          code: "INPUT_NOT_OBJECT",
          field: "$input",
          message: "Intake input must be a plain object."
        }
      ]
    };
  }

  const issues: EfdrValidationIssue[] = [];

  const addIssue = (
    code: EfdrValidationCode,
    field: keyof EfdrIntakeInput | "$input",
    message: string
  ): void => {
    issues.push({ code, field, message });
  };

  const unknownFields = Object.keys(input)
    .filter((field) => !INTAKE_FIELD_SET.has(field))
    .sort();

  for (const field of unknownFields) {
    addIssue(
      "UNKNOWN_FIELD",
      "$input",
      `Unknown intake field rejected: ${field}.`
    );
  }

  const readString = (
    field: "legalBusinessName" | "equipmentDescription",
    minimumLength: number,
    maximumLength: number
  ): string | null => {
    if (!hasOwn(input, field)) {
      addIssue("MISSING_FIELD", field, `${field} is required.`);
      return null;
    }

    const rawValue = input[field];

    if (typeof rawValue !== "string") {
      addIssue("INVALID_STRING", field, `${field} must be a string.`);
      return null;
    }

    const value = normalizeText(rawValue);

    if (
      value.length < minimumLength ||
      value.length > maximumLength
    ) {
      addIssue(
        "INVALID_STRING",
        field,
        `${field} must contain ${minimumLength} to ${maximumLength} characters.`
      );
      return null;
    }

    return value;
  };

  const readNumber = (
    field:
      | "equipmentCost"
      | "requestedAmount"
      | "downPayment"
      | "monthlyRevenue"
      | "existingMonthlyDebt"
      | "timeInBusinessYears",
    minimum: number,
    maximum: number,
    allowZero: boolean,
    money: boolean
  ): number | null => {
    if (!hasOwn(input, field)) {
      addIssue("MISSING_FIELD", field, `${field} is required.`);
      return null;
    }

    const rawValue = input[field];

    if (typeof rawValue !== "number") {
      addIssue(
        "INVALID_NUMBER",
        field,
        `${field} must be a number, not a numeric string.`
      );
      return null;
    }

    if (!Number.isFinite(rawValue)) {
      addIssue(
        "NON_FINITE_NUMBER",
        field,
        `${field} must be a finite number.`
      );
      return null;
    }

    if (rawValue < 0) {
      addIssue(
        "VALUE_NEGATIVE",
        field,
        `${field} cannot be negative.`
      );
      return null;
    }

    if (!allowZero && rawValue === 0) {
      addIssue(
        "VALUE_NOT_POSITIVE",
        field,
        `${field} must be greater than zero.`
      );
      return null;
    }

    if (rawValue < minimum || rawValue > maximum) {
      addIssue(
        "VALUE_OUT_OF_RANGE",
        field,
        `${field} must be between ${minimum} and ${maximum}.`
      );
      return null;
    }

    if (money && !hasAtMostTwoDecimalPlaces(rawValue)) {
      addIssue(
        "VALUE_OUT_OF_RANGE",
        field,
        `${field} cannot contain more than two decimal places.`
      );
      return null;
    }

    return money ? normalizeMoney(rawValue) : rawValue;
  };

  const legalBusinessName = readString(
    "legalBusinessName",
    2,
    120
  );

  const equipmentDescription = readString(
    "equipmentDescription",
    3,
    240
  );

  const equipmentCost = readNumber(
    "equipmentCost",
    1000,
    100000000,
    false,
    true
  );

  const requestedAmount = readNumber(
    "requestedAmount",
    1000,
    100000000,
    false,
    true
  );

  const downPayment = readNumber(
    "downPayment",
    0,
    100000000,
    true,
    true
  );

  const monthlyRevenue = readNumber(
    "monthlyRevenue",
    1,
    1000000000,
    false,
    true
  );

  const existingMonthlyDebt = readNumber(
    "existingMonthlyDebt",
    0,
    1000000000,
    true,
    true
  );

  const timeInBusinessYears = readNumber(
    "timeInBusinessYears",
    0,
    200,
    true,
    false
  );

  let creditPosture: EfdrCreditPosture | null = null;

  if (!hasOwn(input, "creditPosture")) {
    addIssue(
      "MISSING_FIELD",
      "creditPosture",
      "creditPosture is required."
    );
  } else {
    const rawCreditPosture = input.creditPosture;

    if (
      typeof rawCreditPosture !== "string" ||
      !isCreditPosture(rawCreditPosture)
    ) {
      addIssue(
        "INVALID_CREDIT_POSTURE",
        "creditPosture",
        "creditPosture must be STRONG, MODERATE, THIN, or STRESSED."
      );
    } else {
      creditPosture = rawCreditPosture;
    }
  }

  if (
    equipmentCost !== null &&
    requestedAmount !== null &&
    downPayment !== null
  ) {
    const equipmentCostCents = Math.round(equipmentCost * 100);
    const requestedAmountCents = Math.round(requestedAmount * 100);
    const downPaymentCents = Math.round(downPayment * 100);

    if (
      requestedAmountCents + downPaymentCents !==
      equipmentCostCents
    ) {
      addIssue(
        "CAPITAL_STACK_MISMATCH",
        "$input",
        "requestedAmount plus downPayment must equal equipmentCost."
      );
    }
  }

  if (
    issues.length > 0 ||
    legalBusinessName === null ||
    equipmentDescription === null ||
    equipmentCost === null ||
    requestedAmount === null ||
    downPayment === null ||
    monthlyRevenue === null ||
    existingMonthlyDebt === null ||
    timeInBusinessYears === null ||
    creditPosture === null
  ) {
    return {
      ok: false,
      issues
    };
  }

  return {
    ok: true,
    value: {
      legalBusinessName,
      equipmentDescription,
      equipmentCost,
      requestedAmount,
      downPayment,
      monthlyRevenue,
      existingMonthlyDebt,
      timeInBusinessYears,
      creditPosture
    }
  };
}