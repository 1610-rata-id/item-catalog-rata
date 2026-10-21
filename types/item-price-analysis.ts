
export interface ItemPriceKpi {
  average_price: number;
  highest_price: number;
  lowest_price: number;
  total_po: number;
  transaction_count: number;
}



export interface ItemPriceTrend {
  month_start: string;
  average_price: number;
  highest_price: number;
  lowest_price: number;
  transaction_count: number;
  total_po: number;
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
  po_number: string;
  uom: string;
  unit_price: number;
  ppn: number | null;
  qty: number;
  total_price: number;
}



export interface ItemPriceDistribution {
  month_start: string;
  unit_price: number;
  transaction_count: number;
}
