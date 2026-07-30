import path from "path";
import { describe, expect, it } from "vitest";

import { extractCSV } from "../../etl/extract/csv";
import { mapProcurementRow } from "../../etl/mappers/procurement";
import { validateProcurementRecord } from "../../etl/validate/procurement";

describe("ETL Integration", () => {
  it("should process every row in CSV successfully", () => {
    const csvPath = path.resolve(
      __dirname,
      "../fixtures/sample-procurement.csv"
    );

    const rows = extractCSV(csvPath);
    console.log(rows[0]);

    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      const mapped = mapProcurementRow(row);

      console.log("Mapped Record:", mapped);

      expect(mapped.pr_number).toBeTruthy();
      expect(mapped.po_number).toBeTruthy();
      expect(mapped.sub_pr_id).toBeTruthy();
      expect(mapped.item_code).toBeTruthy();

      expect(mapped.qty).not.toBeNull();
      expect(mapped.unit_price).not.toBeNull();
      expect(mapped.total_price).not.toBeNull();

      const validation = validateProcurementRecord(mapped);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    }
  });
});