export interface ProcurementQuery {
  startDate?: string;
  endDate?: string;
  vendor?: string;
  category?: string;
  prNumber?: string;
  poNumber?: string;
  limit?: number;
  offset?: number;
}