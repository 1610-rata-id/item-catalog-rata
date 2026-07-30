import { Transaction } from "@/types/transaction";

export interface ProcurementTransactionRow {
  business_key: string | null;

  milestone_pr: string;

  pr_number: string;

  po_number: string | null;

  order_date: string | null;

  vendor_name: string;

  item_code: string;

  item_name: string;

  qty: number;

  uom: string;

  unit_price: number;

  total_price: number;

  qcf_name: string | null;

  receive_date: string | null;

  payment_request_id: string | null;

  synced_at: string;
}

export function mapTransactionToSupabase(
  transaction: Transaction
): ProcurementTransactionRow {

  return {

    business_key: null,

    milestone_pr: transaction.milestonePr,

    pr_number: transaction.prNumber,

    po_number: transaction.poNumber || null,

    order_date: transaction.orderDate
      ? transaction.orderDate.toISOString().split("T")[0]
      : null,

    vendor_name: transaction.vendorName,

    item_code: transaction.itemCode,

    item_name: transaction.itemName,

    qty: transaction.qty,

    uom: transaction.uom,

    unit_price: transaction.unitPrice,

    total_price: transaction.totalPrice,

    qcf_name: transaction.qcfName || null,

    receive_date: transaction.receiveDate
      ? transaction.receiveDate.toISOString().split("T")[0]
      : null,

    payment_request_id:
      transaction.paymentRequestId || null,

    synced_at: new Date().toISOString(),
  };
}