export interface VendorRiskMatrixRecord {
  vendor: string;
  material: string;
  single_source: boolean;
  frequent_backorder: boolean;
  risk_level: "Low" | "Medium" | "High";
}