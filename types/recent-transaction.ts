export interface RecentTransaction {
  order_date: string;
  vendor_name: string;
  item_name: string;
  uom: string;
  qty: number;
  total_price: number;
  po_number: string;
  pr_number: string;
}