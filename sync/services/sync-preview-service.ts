import { readCsv } from "@/sync/readers/csv-reader";
import { transformTransaction } from "@/sync/transaction-transformer";
import { validateTransaction } from "@/sync/validators/transaction-validator";
import { SyncPreviewResult } from "@/sync/models/sync-preview-result";
import { Transaction } from "@/types/transaction";

export async function previewTransactions(): Promise<SyncPreviewResult> {
  const rawRows = await readCsv("data/analytics_transactions.csv");

  const validTransactions: Transaction[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const transaction = transformTransaction(rawRows[i]);

    const validation = validateTransaction(
      transaction,
      i + 2
    );

    if (validation.valid) {
      validTransactions.push(transaction);
    } else {
      errors.push(...validation.errors);
    }
  }

  return {
    totalRows: rawRows.length,
    validRows: validTransactions.length,
    invalidRows: errors.length,
    validTransactions,
    errors,
  };
}