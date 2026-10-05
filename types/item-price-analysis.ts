export interface ItemPriceKpi {
  average_price: number;
  highest_price: number;
  lowest_price: number;
}

export interface ItemPriceTrend {
  month_start: string;
  average_price: number;
}

export interface ItemVendorPriceComparison {
  vendor_name: string;
  average_price: number;
  transaction_count: number;
}

export interface ItemPriceHistory {
  order_date: string;
  item_name: string;
  vendor_name: string;
  uom: string;
  unit_price: number;
  qty: number;
  total_price: number;
}

export interface ItemPriceDistribution {
  range_start: number;
  range_end: number;
  transaction_count: number;
}