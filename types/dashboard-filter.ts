export interface DashboardFilterState {
  year: number;

  months: number[];

  vendors: string[];

  items: string[];
}

export interface DashboardDateRange {
  startDate: string;
  endDate: string;

  previousStartDate: string;
  previousEndDate: string;

  comparisonLabel: string;
}

export const DEFAULT_DASHBOARD_FILTER: DashboardFilterState = {
  year: 2026,
  months: [],
  vendors: [],
  items: [],
};