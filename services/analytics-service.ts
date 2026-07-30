import { ProcurementRepository } from "@/repositories/procurement-repository";
import { ProcurementQuery } from "@/types/procurement-query";
import { VendorPerformance } from "@/types/vendor-performance";
import { DashboardOverview } from "@/types/dashboard-overview";
import { MonthlySpend } from "@/types/monthly-spend";
import { TopSpendItem } from "@/types/top-spend-item";
import { TopVendor } from "@/types/top-vendor";
import { RecentTransaction } from "@/types/recent-transaction";
import { VendorList } from "@/types/vendor-list";
import { DashboardFilterState } from "@/types/dashboard-filter";

export class AnalyticsService {
  private repository = new ProcurementRepository();

  async getTransactions(query?: ProcurementQuery) {
    return await this.repository.getTransactions(query);
  }

  async getVendorPerformance(): Promise<VendorPerformance[]> {
    return await this.repository.getVendorPerformance();
  }

  async getDashboardOverview(
  filters: DashboardFilterState
): Promise<DashboardOverview> {
  return await this.repository.getDashboardOverview(filters);
}

  async getMonthlySpend(
  filters: DashboardFilterState
): Promise<MonthlySpend[]> {
  const data = await this.repository.getMonthlySpend(filters);

  const months: MonthlySpend[] = [
    { year: filters.year, month: 1, month_name: "Jan", total_spend: 0 },
    { year: filters.year, month: 2, month_name: "Feb", total_spend: 0 },
    { year: filters.year, month: 3, month_name: "Mar", total_spend: 0 },
    { year: filters.year, month: 4, month_name: "Apr", total_spend: 0 },
    { year: filters.year, month: 5, month_name: "May", total_spend: 0 },
    { year: filters.year, month: 6, month_name: "Jun", total_spend: 0 },
    { year: filters.year, month: 7, month_name: "Jul", total_spend: 0 },
    { year: filters.year, month: 8, month_name: "Aug", total_spend: 0 },
    { year: filters.year, month: 9, month_name: "Sep", total_spend: 0 },
    { year: filters.year, month: 10, month_name: "Oct", total_spend: 0 },
    { year: filters.year, month: 11, month_name: "Nov", total_spend: 0 },
    { year: filters.year, month: 12, month_name: "Dec", total_spend: 0 },
  ];

  data.forEach((item) => {
    const index = months.findIndex(
      (month) => month.month === item.month
    );

    if (index !== -1) {
      months[index] = item;
    }
  });

  return months;
}

  async getTopSpendItems(
  filters: DashboardFilterState
): Promise<TopSpendItem[]> {
  return await this.repository.getTopSpendItems(filters);
}

  async getTopVendors(
  filters: DashboardFilterState
): Promise<TopVendor[]> {
  return await this.repository.getTopVendors(filters);
}

  async getRecentTransactions(
  filters: DashboardFilterState
): Promise<RecentTransaction[]> {
  return await this.repository.getRecentTransactions(filters);
}

async getVendorList(
  year: number
): Promise<VendorList[]> {
  return await this.repository.getVendorList(year);
}
}