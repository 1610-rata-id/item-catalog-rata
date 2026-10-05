export interface ItemPerformanceKpi {
  total_spend: number;
  total_items: number;
  total_purchase_orders: number;
}

export interface ItemTopSpend {
  item_name: string;
  total_spend: number;
  total_qty: number;
  total_purchase_orders: number;
  transaction_count: number;
}

export interface ItemProcurementSummary {
  item_name: string;
  vendor_name: string;
  uom: string;
  total_qty: number;
  total_purchase_orders: number;
  total_spend: number;
  average_price: number;
}

export interface ItemTransactionHistory {
  order_date: string;
  item_name: string;
  vendor_name: string;
  pr_number: string | null;
  po_number: string | null;
  qty: number;
  uom: string;
  unit_price: number;
  total_price: number;
}