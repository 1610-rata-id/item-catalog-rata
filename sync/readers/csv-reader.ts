import fs from "fs/promises";
import { parse } from "csv-parse/sync";

import { RawTransactionRow } from "@/types/raw-transaction";

export async function readCsv(
  path: string
): Promise<RawTransactionRow[]> {

  const content = await fs.readFile(path, "utf-8");

  const records = parse(content, {
  columns: (header: string[]) =>
    header.map((column) => column.trim()),
  skip_empty_lines: true,
  trim: true,
}) as RawTransactionRow[];

return records;
}