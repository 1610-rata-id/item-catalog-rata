import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  ProcurementTransactionRow,
} from "@/sync/mappers/supabase-mapper";

export interface WriteResult {
  totalRows: number;
  insertedRows: number;
  failedRows: number;
  batches: number;
  success: boolean;
  errors: string[];
}

const BATCH_SIZE = 1000;

export class SupabaseWriter {

  async write(
    rows: ProcurementTransactionRow[]
  ): Promise<WriteResult> {

    const result: WriteResult = {
      totalRows: rows.length,
      insertedRows: 0,
      failedRows: 0,
      batches: Math.ceil(rows.length / BATCH_SIZE),
      success: true,
      errors: [],
    };

    console.log("");
    console.log("=======================================");
    console.log("STARTING DATABASE IMPORT");
    console.log("=======================================");
    console.log(`Total Rows : ${rows.length}`);
    console.log(`Batch Size : ${BATCH_SIZE}`);
    console.log(`Total Batch: ${result.batches}`);
    console.log("");

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {

      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

      const batch = rows.slice(i, i + BATCH_SIZE);

      console.log(
        `Processing Batch ${batchNumber}/${result.batches} (${batch.length} rows)...`
      );

      const { data, error } = await supabaseAdmin
  .from("procurement_transactions")
  .insert(batch, {
    defaultToNull: false,
  })
  .select();

if (error) {
  throw new Error(
    [
      `Batch: ${batchNumber}`,
      `Message: ${error.message}`,
      `Code: ${error.code ?? "-"}`,
      `Details: ${error.details ?? "-"}`,
      `Hint: ${error.hint ?? "-"}`,
    ].join("\n")
  );
}

      result.insertedRows += batch.length;

      console.log(
        `✓ Batch ${batchNumber} imported successfully`
      );
    }

    console.log("");
    console.log("=======================================");
    console.log("IMPORT FINISHED");
    console.log("=======================================");
    console.log(`Inserted : ${result.insertedRows}`);
    console.log(`Failed   : ${result.failedRows}`);
    console.log("");

    return result;
  }

}