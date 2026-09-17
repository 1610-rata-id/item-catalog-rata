import { ProcurementRawRow } from "../types/procurement";

interface AnalyticsApiResponse {
  success: boolean;
  total: number;
  data: Record<string, unknown>[];
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_ANALYTICS_API;

export async function extractGoogleSheets(): Promise<ProcurementRawRow[]> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_ANALYTICS_API is not configured."
    );
  }

  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Analytics API request failed: ${response.status} ${response.statusText}`
    );
  }

  const result =
    (await response.json()) as AnalyticsApiResponse;

  if (!result.success) {
    throw new Error(
      result.message ?? "Analytics API returned success=false."
    );
  }

  if (!Array.isArray(result.data)) {
    throw new Error(
      "Analytics API returned invalid data format."
    );
  }

  console.log(
    `Google Sheets API extracted ${result.data.length} rows.`
  );

  return result.data.map((row) => ({
    milestone_pr: String(row.milestone_pr ?? ""),
    pr_number: String(row.pr_number ?? ""),
    po_number: String(row.po_number ?? ""),
    order_date: String(row.order_date ?? ""),
    vendor_name: String(row.vendor_name ?? ""),
    item_code: String(row.item_code ?? ""),
    item_name: String(row.item_name ?? ""),
    qty: String(row.qty ?? ""),
    uom: String(row.uom ?? ""),
    unit_price: String(row.unit_price ?? ""),
    total_price: String(row.total_price ?? ""),
    qcf_name: String(row.qcf_name ?? ""),
    receive_date: String(row.receive_date ?? ""),
    payment_request_id: String(
      row.payment_request_id ?? ""
    ),
    sub_pr_id:
      row.sub_pr_id === null ||
      row.sub_pr_id === undefined ||
      String(row.sub_pr_id).trim() === ""
        ? null
        : String(row.sub_pr_id),
  }));
}