import {
  ProcurementRawRow,
  ProcurementRecord,
} from "../types/procurement";

import { transformCurrency } from "../transform/currency";
import { transformNumber } from "../transform/number";

/**
 * Mengubah 1 baris CSV menjadi ProcurementRecord
 */
export function mapProcurementRow(
  row: ProcurementRawRow
): ProcurementRecord {
  return {
    milestone_pr: row.milestone_pr || null,

    pr_number: row.pr_number || null,

    po_number: row.po_number || null,

    order_date: row.order_date || null,

    vendor_name: row.vendor_name || null,

    item_code: row.item_code || null,

    item_name: row.item_name || null,

    qty: transformNumber(row.qty),

    uom: row.uom || null,

    unit_price: transformCurrency(row.unit_price),

    total_price: transformCurrency(row.total_price),

    qcf_name: row.qcf_name || null,

    receive_date: row.receive_date || null,

    payment_request_id: row.payment_request_id || null,

    sub_pr_id: row.sub_pr_id || null,
  };
}