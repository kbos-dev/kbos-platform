import {
  type EfdrReviewRecord,
  type EfdrVolatileRecordMetadata
} from "./contract";
import { evaluateEfdrIntake } from "./evaluation";

export type EfdrRecordRestoreCode =
  | "MISSING_RECORD"
  | "MALFORMED_RECORD"
  | "INVALID_RECORD_SHAPE"
  | "INVALID_METADATA"
  | "INVALID_STABLE_CONTENT"
  | "CONTENT_INTEGRITY_MISMATCH";

export type EfdrRecordRestoreResult =
  | {
      readonly ok: true;
      readonly record: EfdrReviewRecord;
    }
  | {
      readonly ok: false;
      readonly code: EfdrRecordRestoreCode;
      readonly message: string;
    };

function isPlainRecord(
  value: unknown
): value is Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(
  record: Record<string, unknown>,
  expectedKeys: readonly string[]
): boolean {
  const actual = Object.keys(record).sort();
  const expected = [...expectedKeys].sort();

  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function isCanonicalIsoTimestamp(value: string): boolean {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  return new Date(timestamp).toISOString() === value;
}

function readMetadata(
  value: unknown
): EfdrVolatileRecordMetadata | null {
  if (
    !isPlainRecord(value) ||
    !hasExactKeys(value, ["reviewId", "createdAt"])
  ) {
    return null;
  }

  const reviewId = value.reviewId;
  const createdAt = value.createdAt;

  if (
    typeof reviewId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      reviewId
    )
  ) {
    return null;
  }

  if (
    typeof createdAt !== "string" ||
    !isCanonicalIsoTimestamp(createdAt)
  ) {
    return null;
  }

  return {
    reviewId,
    createdAt
  };
}

export function restoreEfdrReviewRecord(
  serializedRecord: string | null
): EfdrRecordRestoreResult {
  if (serializedRecord === null) {
    return {
      ok: false,
      code: "MISSING_RECORD",
      message:
        "No review record is available in this browser tab."
    };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(serializedRecord);
  } catch {
    return {
      ok: false,
      code: "MALFORMED_RECORD",
      message:
        "The stored review record is malformed and was rejected."
    };
  }

  if (
    !isPlainRecord(parsed) ||
    !hasExactKeys(parsed, ["stableContent", "metadata"])
  ) {
    return {
      ok: false,
      code: "INVALID_RECORD_SHAPE",
      message:
        "The stored review record has an invalid shape and was rejected."
    };
  }

  const metadata = readMetadata(parsed.metadata);

  if (metadata === null) {
    return {
      ok: false,
      code: "INVALID_METADATA",
      message:
        "The review record metadata is invalid and was rejected."
    };
  }

  if (!isPlainRecord(parsed.stableContent)) {
    return {
      ok: false,
      code: "INVALID_STABLE_CONTENT",
      message:
        "The stable review content is unavailable or invalid."
    };
  }

  const normalizedInput =
    parsed.stableContent.normalizedInput;

  const recomputed = evaluateEfdrIntake(normalizedInput);

  if (!recomputed.ok) {
    return {
      ok: false,
      code: "INVALID_STABLE_CONTENT",
      message:
        "The stored review input no longer passes validation."
    };
  }

  if (
    JSON.stringify(parsed.stableContent) !==
    JSON.stringify(recomputed.stableContent)
  ) {
    return {
      ok: false,
      code: "CONTENT_INTEGRITY_MISMATCH",
      message:
        "The stored review content does not match deterministic recomputation."
    };
  }

  return {
    ok: true,
    record: {
      stableContent: recomputed.stableContent,
      metadata
    }
  };
}