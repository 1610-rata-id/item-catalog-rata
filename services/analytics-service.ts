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
import { VendorRiskMatrix } from "@/types/vendor-risk-matrix";
import {
  vendorEvaluationRepository,
  VendorEvaluationFilters,
  VendorEvaluation,
} from "@/repositories/vendor-evaluation.repository";

export class AnalyticsService {
  private repository =
    new ProcurementRepository();

  // ============================================================
  // TRANSACTIONS
  // ============================================================

  async getTransactions(
    query?: ProcurementQuery
  ) {
    return await this.repository.getTransactions(
      query
    );
  }

  // ============================================================
  // VENDOR PERFORMANCE
  // ============================================================

  async getVendorPerformance(
    filters: DashboardFilterState
  ): Promise<VendorPerformance[]> {
    return await this.repository.getVendorPerformance(
      filters
    );
  }

  // ============================================================
  // VENDOR PROCUREMENT SUMMARY
  // ============================================================

  async getVendorProcurementSummary(
    filters: DashboardFilterState
  ) {
    return await this.repository.getVendorProcurementSummary(
      filters
    );
  }

  // ============================================================
  // DASHBOARD OVERVIEW
  // ============================================================

  async getDashboardOverview(
    filters: DashboardFilterState
  ): Promise<DashboardOverview> {
    return await this.repository.getDashboardOverview(
      filters
    );
  }

  // ============================================================
  // MONTHLY SPEND
  // ============================================================

  async getMonthlySpend(
    filters: DashboardFilterState
  ): Promise<MonthlySpend[]> {
    const data =
      await this.repository.getMonthlySpend(
        filters
      );

    const months: MonthlySpend[] = [
      {
        year: filters.year,
        month: 1,
        month_name: "Jan",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 2,
        month_name: "Feb",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 3,
        month_name: "Mar",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 4,
        month_name: "Apr",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 5,
        month_name: "May",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 6,
        month_name: "Jun",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 7,
        month_name: "Jul",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 8,
        month_name: "Aug",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 9,
        month_name: "Sep",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 10,
        month_name: "Oct",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 11,
        month_name: "Nov",
        total_spend: 0,
      },
      {
        year: filters.year,
        month: 12,
        month_name: "Dec",
        total_spend: 0,
      },
    ];

    data.forEach((item) => {
      const index = months.findIndex(
        (month) =>
          month.month === item.month
      );

      if (index !== -1) {
        months[index] = item;
      }
    });

    return months;
  }

  // ============================================================
  // TOP SPEND ITEMS
  // ============================================================

  async getTopSpendItems(
    filters: DashboardFilterState
  ): Promise<TopSpendItem[]> {
    return await this.repository.getTopSpendItems(
      filters
    );
  }

  // ============================================================
  // TOP VENDORS
  // ============================================================

  async getTopVendors(
    filters: DashboardFilterState
  ): Promise<TopVendor[]> {
    return await this.repository.getTopVendors(
      filters
    );
  }

  // ============================================================
  // RECENT TRANSACTIONS
  // ============================================================

  async getRecentTransactions(
    filters: DashboardFilterState
  ): Promise<RecentTransaction[]> {
    return await this.repository.getRecentTransactions(
      filters
    );
  }

  // ============================================================
  // VENDOR LIST
  // ============================================================

  async getVendorList(
    year: number
  ): Promise<VendorList[]> {
    return await this.repository.getVendorList(
      year
    );
  }

  async getVendorRiskMatrix(
  vendors: string[] = []
): Promise<VendorRiskMatrix[]> {
  return await this.repository.getVendorRiskMatrix(vendors);
}

async getVendorEvaluations(
  filters: VendorEvaluationFilters = {}
): Promise<VendorEvaluation[]> {
  return await vendorEvaluationRepository.getAll(
    filters
  );
}

async getEvaluationVendors(
  year?: number,
  period?: string
): Promise<string[]> {
  return await vendorEvaluationRepository.getVendors(
    year,
    period
  );
}

async getEvaluationPeriods(
  year?: number
): Promise<string[]> {
  return await vendorEvaluationRepository.getPeriods(
    year
  );
}

async getVendorEvaluations(
  filters: VendorEvaluationFilters = {}
): Promise<VendorEvaluation[]> {
  return await vendorEvaluationRepository.getAll(filters);
}

async getEvaluationVendors(
  year?: number,
  period?: string
): Promise<string[]> {
  return await vendorEvaluationRepository.getVendors(
    year,
    period
  );
}

async getEvaluationPeriods(
  year?: number
): Promise<string[]> {
  return await vendorEvaluationRepository.getPeriods(
    year
  );
}
}