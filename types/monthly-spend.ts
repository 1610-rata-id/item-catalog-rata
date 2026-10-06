export interface MonthlySpend {
  year: number;
  month: number;
  month_name: string;
  total_spend: number;
  total_purchase_orders?: number;
  total_purchase_requests?: number;
}