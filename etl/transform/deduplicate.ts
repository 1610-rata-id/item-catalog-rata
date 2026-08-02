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
    // Jika SUB PR kosong, jangan dianggap duplicate
    if (!record.sub_pr_id) {
      uniqueRecords.set(
        crypto.randomUUID(),
        record
      );
      continue;
    }

    if (uniqueRecords.has(record.sub_pr_id)) {
      duplicates++;
      continue;
    }

    uniqueRecords.set(
      record.sub_pr_id,
      record
    );
  }

  return {
    records: [...uniqueRecords.values()],
    duplicates,
  };
}