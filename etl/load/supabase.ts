import { ProcurementRecord } from "../types/procurement";
import { ETL_CONFIG } from "../config";
import { procurementRepository } from "@/repositories/procurement.repository";

/**
 * Membagi array menjadi beberapa batch.
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

/**
 * Load ProcurementRecord ke database.
 */
export async function loadProcurementRecords(
  records: ProcurementRecord[]
) {
  if (ETL_CONFIG.dryRun) {
    return {
      success: true,
      total: records.length,
      dryRun: true,
    };
  }

  const batches = chunkArray(records, ETL_CONFIG.batchSize);

  let uploaded = 0;

  for (const batch of batches) {
    await procurementRepository.upsert(batch);

    uploaded += batch.length;
  }

  return {
    success: true,
    total: uploaded,
    dryRun: false,
    batches: batches.length,
  };
}