import { describe, expect, it } from "vitest";
import { mapProcurementRow } from "../../etl/mappers/procurement";

describe("mapProcurementRow", () => {
  it("should map raw row correctly", () => {
    const raw = {
      milestone_pr: "Done",
      pr_number: "PR001",
      po_number: "PO001",
      sub_pr_id: "PR001-001",
      order_date: "2026-07-01",
      vendor_name: "Vendor A",
      item_code: "ITEM001",
      item_name: "Dental Chair",
      qty: "2",
      uom: "PCS",
      unit_price: "Rp 1,500",
      total_price: "Rp 3,000",
      qcf_name: "John",
      receive_date: "2026-07-03",
      payment_request_id: "PAY001",
    };

    const mapped = mapProcurementRow(raw);

    expect(mapped.pr_number).toBe("PR001");
    expect(mapped.po_number).toBe("PO001");
    expect(mapped.sub_pr_id).toBe("PR001-001");
    expect(mapped.item_code).toBe("ITEM001");
    expect(mapped.qty).toBe(2);
    expect(mapped.unit_price).toBe(1500);
    expect(mapped.total_price).toBe(3000);
  });

  it("should convert empty strings to null", () => {
    const raw = {
      milestone_pr: "",
      pr_number: "",
      po_number: "",
      sub_pr_id: "",
      order_date: "",
      vendor_name: "",
      item_code: "",
      item_name: "",
      qty: "",
      uom: "",
      unit_price: "",
      total_price: "",
      qcf_name: "",
      receive_date: "",
      payment_request_id: "",
    };

    const mapped = mapProcurementRow(raw);

    expect(mapped.pr_number).toBeNull();
    expect(mapped.po_number).toBeNull();
    expect(mapped.sub_pr_id).toBeNull();
    expect(mapped.item_code).toBeNull();
    expect(mapped.qty).toBeNull();
    expect(mapped.unit_price).toBeNull();
    expect(mapped.total_price).toBeNull();
  });
});