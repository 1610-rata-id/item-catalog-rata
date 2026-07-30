import { ProcurementRecord } from "../types/procurement";

export interface DeduplicateResult {
  records: ProcurementRecord[];
  duplicates: number;
}

export function deduplicateRecords(
  records: ProcurementRecord[]
): DeduplicateResult {
  const uniqueRecords = new Map<string, ProcurementRecord>();

  let duplicates = 0;

  for (const record of records) {
    if (uniqueRecords.has(record.sub_pr_id)) {
      duplicates++;
      continue;
    }

    uniqueRecords.set(record.sub_pr_id, record);
  }

  return {
    records: [...uniqueRecords.values()],
    duplicates,
  };
}