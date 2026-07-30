import { Transaction } from "@/types/transaction";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateRequiredFields(
  transaction: Transaction,
  rowNumber: number,
  errors: string[]
) {
  if (!transaction.prNumber.trim()) {
    errors.push(`Row ${rowNumber}: PR Number is required.`);
  }

  if (!transaction.itemName.trim()) {
    errors.push(`Row ${rowNumber}: Item Name is required.`);
  }

  if (transaction.qty <= 0) {
    errors.push(`Row ${rowNumber}: Quantity must be greater than 0.`);
  }
}

function validateMilestone(
  transaction: Transaction,
  rowNumber: number,
  errors: string[]
) {
  // Kalau sudah ada PO maka Vendor wajib ada
  if (transaction.poNumber?.trim()) {
    if (!transaction.vendorName.trim()) {
      errors.push(
        `Row ${rowNumber}: Vendor Name is required because PO Number exists.`
      );
    }

    if (transaction.unitPrice <= 0) {
      errors.push(
        `Row ${rowNumber}: Unit Price must be greater than 0 because PO Number exists.`
      );
    }
  }

  // Kalau sudah ada Receive Date maka harus ada PO
  if (transaction.receiveDate && !transaction.poNumber?.trim()) {
    errors.push(
      `Row ${rowNumber}: Receive Date exists but PO Number is empty.`
    );
  }

  // Kalau sudah ada Payment Request maka harus ada Receive Date
  if (
    transaction.paymentRequestId?.trim() &&
    !transaction.receiveDate
  ) {
    errors.push(
      `Row ${rowNumber}: Payment Request exists but Receive Date is empty.`
    );
  }
}

export function validateTransaction(
  transaction: Transaction,
  rowNumber: number
): ValidationResult {
  const errors: string[] = [];

  validateRequiredFields(transaction, rowNumber, errors);

  validateMilestone(transaction, rowNumber, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}