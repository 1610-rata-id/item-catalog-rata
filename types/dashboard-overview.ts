export interface DashboardOverview {
  total_spend: number;
  total_transactions: number;
  total_purchase_orders: number;
  total_purchase_requests: number;
  total_vendors: number;

  total_spend_growth: number | null;
  total_transactions_growth: number | null;
  total_purchase_orders_growth: number | null;
  total_purchase_requests_growth: number | null;

  comparison_label: string;
}