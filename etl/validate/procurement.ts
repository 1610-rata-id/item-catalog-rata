import { ProcurementRecord } from "../types/procurement";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Memvalidasi satu ProcurementRecord.
 */
export function validateProcurementRecord(
  record: ProcurementRecord
): ValidationResult {
  const errors: string[] = [];

  if (!record.pr_number) {
    errors.push("pr_number is required");
  }

  // po_number bersifat optional karena
  // PR dapat dibuat sebelum Purchase Order diterbitkan.

  if (!record.item_code) {
    errors.push("item_code is required");
  }

  if (!record.sub_pr_id) {
    errors.push("sub_pr_id is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}