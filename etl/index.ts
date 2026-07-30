import { extractCSV } from "./extract/csv";
import { mapProcurementRow } from "./mappers/procurement";
import { validateProcurementRecord } from "./validate/procurement";
import { loadProcurement } from "./load/procurement.loader";
import { logger } from "./logger";
import { writeReport } from "./report";

import { ProcurementRecord } from "./types/procurement";
import { deduplicateRecords } from "./transform/deduplicate";

import { ETLResult } from "./types/etl";

export async function runETL(
  filePath: string
): Promise<ETLResult> {
  const startedAt = new Date();

  logger.info("Starting ETL", {
    filePath,
  });

  try {
    // ==========================
    // Extract
    // ==========================
    const rawRows = extractCSV(filePath);

    logger.info("CSV extracted", {
      rows: rawRows.length,
    });

    // ==========================
    // Transform (Mapping)
    // ==========================
    const records: ProcurementRecord[] = rawRows.map(
      mapProcurementRow
    );

    // ==========================
    // Validation
    // ==========================
    const validRecords: ProcurementRecord[] = [];

    const errors: {
      record: ProcurementRecord;
      errors: string[];
    }[] = [];

    for (const record of records) {
      const result = validateProcurementRecord(record);

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
    const deduplication = deduplicateRecords(validRecords);

    logger.info("Deduplication completed", {
      before: validRecords.length,
      after: deduplication.records.length,
      duplicates: deduplication.duplicates,
    });

    // ==========================
    // Load
    // ==========================
    const loadResult = await loadProcurement(
      deduplication.records
    );

    logger.info("Load completed", loadResult);

    // ==========================
    // Report
    // ==========================
    const finishedAt = new Date();

    const reportPath = writeReport({
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs:
        finishedAt.getTime() - startedAt.getTime(),

      total: records.length,
      valid: validRecords.length,
      invalid: errors.length,

      uploaded: loadResult.total,
      batches: loadResult.batches ?? 1,
      dryRun: loadResult.dryRun,

      errors,
    });

    logger.info("Report generated", {
      reportPath,
    });

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
    logger.error("ETL failed", error);

    throw error;
  }
}