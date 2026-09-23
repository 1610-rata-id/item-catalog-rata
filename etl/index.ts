import { extractGoogleSheets } from "./extract/google-sheets-api";
import { extractRiskMatrix } from "./extract/risk-matrix";
import { mapProcurementRow } from "./mappers/procurement";
import { validateProcurementRecord } from "./validate/procurement";
import { loadProcurement } from "./load/procurement.loader";
import { loadVendorRiskMatrix } from "./load/vendor-risk-matrix.loader";
import { logger } from "./logger";
import { writeReport } from "./report";
import { ProcurementRecord } from "./types/procurement";
import { deduplicateRecords } from "./transform/deduplicate";
import { ETLResult } from "./types/etl";
import { ProcurementRepository } from "../repositories/procurement.repository";

export async function runETL(): Promise<ETLResult> {
  const startedAt = new Date();

  logger.info("Starting ETL", {
    source: "Google Sheets API",
  });

  try {
    // ==========================
    // Extract
    // ==========================
    const rawRows = await extractGoogleSheets();

    logger.info("Google Sheets extracted", {
      rows: rawRows.length,
    });

    // ==========================
// Extract Risk Matrix
// ==========================
const riskMatrixRecords = await extractRiskMatrix();

logger.info("Risk Matrix extracted", {
  rows: riskMatrixRecords.length,
});

    // ==========================
    // Transform (Mapping)
    // ==========================
    const records: ProcurementRecord[] =
      rawRows.map(mapProcurementRow);

    // ==========================
    // Validation
    // ==========================
    const validRecords: ProcurementRecord[] = [];

    const errors: {
      record: ProcurementRecord;
      errors: string[];
    }[] = [];

    for (const record of records) {
      const result =
        validateProcurementRecord(record);

      if (result.valid) {
        validRecords.push(record);
      } else {
        errors.push({
          record,
          errors: result.errors,
        });
      }
    }

    logger.info("Validation completed", {
      total: records.length,
      valid: validRecords.length,
      invalid: errors.length,
    });

    // ==========================
    // Deduplication
    // ==========================
    const deduplication =
      deduplicateRecords(validRecords);

    logger.info("Deduplication completed", {
      before: validRecords.length,
      after: deduplication.records.length,
      duplicates: deduplication.duplicates,
    });

    // ==========================
    // Preflight Reconciliation
    // ==========================
    const procurementRepository =
      new ProcurementRepository();

    const sourceSubPrIds =
      deduplication.records
        .map((record) => record.sub_pr_id)
        .filter(
          (id): id is string =>
            Boolean(id)
        );

    const existingSubPrIds =
      await procurementRepository.getExistingSubPrIds(
        sourceSubPrIds
      );

    // Record source yang sudah ada di Supabase
    const existingSourceSubPrIds =
      sourceSubPrIds.filter(
        (id) => existingSubPrIds.has(id)
      );

    // Record source yang belum ada di Supabase
    const newSubPrIds =
      sourceSubPrIds.filter(
        (id) => !existingSubPrIds.has(id)
      );

    const dbOnlySubPrIds =
  Array.from(existingSubPrIds).filter(
    (id) => !sourceSubPrIds.includes(id)
  );

logger.info(
  "Database-only reconciliation",
  {
    count: dbOnlySubPrIds.length,
    subPrIds: dbOnlySubPrIds,
  }
);

    logger.info(
      "Preflight reconciliation completed",
      {
        sourceUnique: sourceSubPrIds.length,

        // Semua unique sub_pr_id yang saat ini ada
        // di Supabase
        existingInSupabase:
          existingSubPrIds.size,

        // Hanya existing record yang MATCH
        // dengan source terbaru
        existingSourceRecords:
          existingSourceSubPrIds.length,

        // Record baru dari source
        newRecords:
          newSubPrIds.length,
      }
    );

    // ==========================
    // Reconciliation Check
    // ==========================
    const reconciledCount =
      existingSourceSubPrIds.length +
      newSubPrIds.length;

    if (
      reconciledCount !==
      sourceSubPrIds.length
    ) {
      throw new Error(
        `Preflight reconciliation failed: ` +
        `existingSourceRecords (${existingSourceSubPrIds.length}) + ` +
        `newRecords (${newSubPrIds.length}) = ` +
        `${reconciledCount}, ` +
        `but sourceUnique = ${sourceSubPrIds.length}.`
      );
    }

    logger.info(
      "Preflight reconciliation check passed",
      {
        sourceUnique:
          sourceSubPrIds.length,

        existingSourceRecords:
          existingSourceSubPrIds.length,

        newRecords:
          newSubPrIds.length,

        reconciledCount,
      }
    );

    // ==========================
    // Load
    // ==========================
    const loadResult =
      await loadProcurement(
        deduplication.records
      );

    logger.info(
      "Load completed",
      loadResult
    );

    // ==========================
// Load Risk Matrix
// ==========================
const riskMatrixLoadResult =
  await loadVendorRiskMatrix(
    riskMatrixRecords
  );

logger.info(
  "Risk Matrix load completed",
  riskMatrixLoadResult
);

   // ==========================
// Update ETL Sync Status
// ==========================
if (!loadResult.dryRun) {
  const syncedAt = new Date();

  await procurementRepository.updateLastSuccessfulSync(
    syncedAt
  );

  logger.info(
    "ETL sync status updated",
    {
      lastSuccessfulSync:
        syncedAt.toISOString(),
    }
  );
}

    // ==========================
    // Report
    // ==========================
    const finishedAt = new Date();

    const reportPath = writeReport({
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),

      durationMs:
        finishedAt.getTime() -
        startedAt.getTime(),

      total: records.length,
      valid: validRecords.length,
      invalid: errors.length,

      uploaded: loadResult.total,
      batches:
        loadResult.batches ?? 1,
      dryRun: loadResult.dryRun,

      errors,
    });

    logger.info(
      "Report generated",
      {
        reportPath,
      }
    );

    // ==========================
    // Return
    // ==========================
    return {
      total: records.length,
      valid: validRecords.length,
      invalid: errors.length,

      errors,

      load: loadResult,

      reportPath,
    };
  } catch (error) {
    logger.error(
      "ETL failed",
      error
    );

    throw error;
  }
}