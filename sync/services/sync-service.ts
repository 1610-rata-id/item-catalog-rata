import { readCsv } from "@/sync/readers/csv-reader";
import { transformTransaction } from "@/sync/transaction-transformer";
import { validateTransaction } from "@/sync/validators/transaction-validator";
import { mapTransactionToSupabase } from "@/sync/mappers/supabase-mapper";
import { SupabaseWriter } from "@/sync/writers/supabase-writer";
import { SyncResult } from "@/sync/models/sync-result";
import { Transaction } from "@/types/transaction";

export async function syncTransactions(): Promise<SyncResult> {

  const startTime = Date.now();

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

  const rows = validTransactions.map(
    mapTransactionToSupabase
  );

  const writer = new SupabaseWriter();

  const writeResult = await writer.write(rows);

  const endTime = Date.now();

  return {

    totalRows: rawRows.length,

    validRows: validTransactions.length,

    invalidRows: errors.length,

    insertedRows: writeResult.insertedRows,

    failedRows: writeResult.failedRows,

    totalBatches: writeResult.batches,

    success: writeResult.success,

    durationMs: endTime - startTime,

    errors: [
      ...errors,
      ...writeResult.errors,
    ],

  };

}