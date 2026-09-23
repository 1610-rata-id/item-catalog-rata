export interface VendorRiskMatrix {
  id: number;
  vendor: string;
  material: string;
  single_source: boolean;
  frequent_backorder: boolean;
  risk_level: "Low" | "Medium" | "High";
  created_at: string;
  updated_at: string;
}