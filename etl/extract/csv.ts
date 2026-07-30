import fs from "fs";
import { parse } from "csv-parse/sync";
import { ProcurementRawRow } from "../types/procurement";

/**
 * Membaca file CSV dan mengubahnya menjadi ProcurementRawRow[]
 */
export function extractCSV(filePath: string): ProcurementRawRow[] {
  const csv = fs.readFileSync(filePath, "utf8");

  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  });

  return rows as ProcurementRawRow[];
}