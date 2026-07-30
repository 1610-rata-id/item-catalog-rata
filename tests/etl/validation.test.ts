import { describe, expect, it } from "vitest";
import { validateProcurementRecord } from "../../etl/validate/procurement";
import { ProcurementRecord } from "../../etl/types/procurement";

describe("validateProcurementRecord", () => {
  const validRecord: ProcurementRecord = {
    milestone_pr: null,
    pr_number: "PR001",
    po_number: "PO001",
    sub_pr_id: "PR001-001",
    order_date: null,
    vendor_name: null,
    item_code: "ITEM001",
    item_name: null,
    qty: 10,
    uom: null,
    unit_price: 1000,
    total_price: 10000,
    qcf_name: null,
    receive_date: null,
    payment_request_id: null,
  };

  it("should return valid when required fields exist", () => {
    const result = validateProcurementRecord(validRecord);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should require pr_number", () => {
    const result = validateProcurementRecord({
      ...validRecord,
      pr_number: null,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("pr_number is required");
  });

  it("should require po_number", () => {
    const result = validateProcurementRecord({
      ...validRecord,
      po_number: null,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("po_number is required");
  });

  it("should require item_code", () => {
    const result = validateProcurementRecord({
      ...validRecord,
      item_code: null,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("item_code is required");
  });

  it("should require sub_pr_id", () => {
    const result = validateProcurementRecord({
      ...validRecord,
      sub_pr_id: null,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("sub_pr_id is required");
  });
});