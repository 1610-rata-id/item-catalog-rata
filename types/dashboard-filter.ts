export interface DashboardFilterState {
  year: number;
  month: number | null;
  vendor: string | null;
  search: string;
}

export const DEFAULT_DASHBOARD_FILTER: DashboardFilterState = {
  year: 2026,
  month: null,
  vendor: null,
  search: "",
};