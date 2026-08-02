/**
 * Raw data yang berasal dari Google Sheets / CSV.
 * Format masih sama seperti sumber data.
 */
export interface ProcurementRawRow {
  milestone_pr: string;
  pr_number: string;
  po_number: string;
  order_date: string;
  vendor_name: string;
  item_code: string;
  item_name: string;
  qty: string;
  uom: string;
  unit_price: string;
  total_price: string;
  qcf_name: string;
  receive_date: string;
  payment_request_id: string;
  sub_pr_id: string | null;
}

/**
 * Data setelah melalui proses Transform.
 * Semua tipe data sudah sesuai dengan schema Supabase.
 */
export interface ProcurementRecord {
  milestone_pr: string | null;
  pr_number: string | null;
  po_number: string | null;

  order_date: string | null;

  vendor_name: string | null;
  item_code: string | null;
  item_name: string | null;

  qty: number | null;
  uom: string | null;

  unit_price: number | null;
  total_price: number | null;

  qcf_name: string | null;

  receive_date: string | null;

  payment_request_id: string | null;

  sub_pr_id: string | null;
}