import { VendorRiskMatrixRecord } from "@/etl/types/vendor-risk-matrix";
import { ETL_CONFIG } from "@/etl/config";
import { vendorRiskMatrixRepository } from "@/repositories/vendor-risk-matrix.repository";

function chunkArray<T>(
  array: T[],
  size: number
): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

export async function loadVendorRiskMatrix(
  records: VendorRiskMatrixRecord[]
) {
  if (ETL_CONFIG.dryRun) {
    return {
      success: true,
      total: records.length,
      dryRun: true,
      batches: 0,
    };
  }

  const batches = chunkArray(
    records,
    ETL_CONFIG.batchSize
  );

  let uploaded = 0;

  for (const batch of batches) {
    await vendorRiskMatrixRepository.upsert(batch);

    uploaded += batch.length;
  }

  return {
    success: true,
    total: uploaded,
    dryRun: false,
    batches: batches.length,
  };
}