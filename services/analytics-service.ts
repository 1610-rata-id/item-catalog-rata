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
import {
  vendorDocumentsRepository,
  VendorDocumentsFilters,
} from "@/repositories/vendor-documents.repository";

import {
  DocumentsKpi,
  VendorComplianceContract,
  VendorDetails,
  VendorMaterialDocument,
} from "@/types/vendor-documents";

import {
  itemPerformanceRepository,
  ItemPerformanceFilters,
} from "@/repositories/item-performance.repository";

import {
  ItemPerformanceKpi,
  ItemTopSpend,
  ItemProcurementSummary,
  ItemTransactionHistory,
} from "@/types/item-performance";

import {
  ItemPriceHistory,
  ItemPriceKpi,
  ItemPriceTrend,
  ItemVendorPriceComparison,
  ItemPriceDistribution,
} from "@/types/item-price-analysis";

import {
  ItemPriceAnalysisFilters,
  itemPriceAnalysisRepository,
} from "@/repositories/item-price-analysis.repository";

import {
  ItemAbcAnalysis,
  ItemAbcKpi,
} from "@/types/item-abc-analysis";

import { itemAbcAnalysisRepository } from "@/repositories/item-abc-analysis.repository";

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
    await this.repository.getMonthlySpend(filters);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const months: MonthlySpend[] = monthNames.map(
    (monthName, index) => ({
      year: filters.year,
      month: index + 1,
      month_name: monthName,
      total_spend: 0,
      total_purchase_orders: 0,
      total_purchase_requests: 0,
    })
  );

  data.forEach((item) => {
    const index = months.findIndex(
      (month) => month.month === item.month
    );

    if (index !== -1) {
      months[index] = {
        ...months[index],
        ...item,
        total_spend: Number(item.total_spend ?? 0),
        total_purchase_orders:
          item.total_purchase_orders == null
            ? undefined
            : Number(item.total_purchase_orders),
        total_purchase_requests:
          item.total_purchase_requests == null
            ? undefined
            : Number(item.total_purchase_requests),
      };
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

async getDocumentsKpi(): Promise<DocumentsKpi> {
  return await vendorDocumentsRepository.getKpi();
}

async getVendorComplianceContracts(
  filters: VendorDocumentsFilters = {}
): Promise<VendorComplianceContract[]> {
  return await vendorDocumentsRepository.getComplianceContracts(filters);
}

async getVendorMaterialDocuments(
  filters: VendorDocumentsFilters = {}
): Promise<VendorMaterialDocument[]> {
  return await vendorDocumentsRepository.getMaterialDocuments(filters);
}

async getVendorDetails(
  vendorId: string
): Promise<VendorDetails | null> {
  return await vendorDocumentsRepository.getVendorDetails(vendorId);
}

async getDocumentVendors(): Promise<string[]> {
  return await vendorDocumentsRepository.getVendors();
}

  // ============================================================
  // ITEM ANALYTICS - PERFORMANCE
  // ============================================================

  async getItemPerformanceKpi(
    filters: ItemPerformanceFilters
  ): Promise<ItemPerformanceKpi> {
    return await itemPerformanceRepository.getKpi(filters);
  }

  async getItemTopSpend(
    filters: ItemPerformanceFilters
  ): Promise<ItemTopSpend[]> {
    return await itemPerformanceRepository.getTopSpend(
      filters,
      10
    );
  }

  async getItemProcurementSummary(
    filters: ItemPerformanceFilters
  ): Promise<ItemProcurementSummary[]> {
    return await itemPerformanceRepository.getProcurementSummary(
      filters,
      1000
    );
  }

  async getItemTransactionHistory(
    filters: ItemPerformanceFilters
  ): Promise<ItemTransactionHistory[]> {
    return await itemPerformanceRepository.getTransactionHistory(
      filters,
      100
    );
  }

// ============================================================
  // ITEM ANALYTICS - PRICE
  // ============================================================

async getItemPriceKpi(
  filters: ItemPriceAnalysisFilters
): Promise<ItemPriceKpi> {
  return await itemPriceAnalysisRepository.getKpi(filters);
}

async getItemPriceTrend(
  filters: ItemPriceAnalysisFilters
): Promise<ItemPriceTrend[]> {
  return await itemPriceAnalysisRepository.getPriceTrend(filters);
}

async getItemVendorPriceComparison(
  filters: ItemPriceAnalysisFilters
): Promise<ItemVendorPriceComparison[]> {
  return await itemPriceAnalysisRepository.getVendorPriceComparison(
    filters,
    10
  );
}

async getItemPriceDistribution(
  filters: ItemPriceAnalysisFilters
): Promise<ItemPriceDistribution[]> {
  const { year, months, vendors, items } = filters;

  const sortedMonths = [...(months ?? [])].sort(
    (a, b) => a - b
  );

  let startDate = `${year}-01-01`;
  let endDate = `${year}-12-31`;

  if (sortedMonths.length > 0) {
    const startMonth = sortedMonths[0];
    const endMonth =
      sortedMonths[sortedMonths.length - 1];

    startDate = `${year}-${String(
      startMonth
    ).padStart(2, "0")}-01`;

    const lastDay = new Date(
      Date.UTC(year, endMonth, 0)
    ).getUTCDate();

    endDate = `${year}-${String(
      endMonth
    ).padStart(2, "0")}-${String(
      lastDay
    ).padStart(2, "0")}`;
  }

  return await itemPriceAnalysisRepository.getPriceDistribution(
    startDate,
    endDate,
    vendors ?? [],
    items ?? [],
    10
  );
}

async getItemPriceHistory(
  filters: ItemPriceAnalysisFilters
): Promise<ItemPriceHistory[]> {
  return await itemPriceAnalysisRepository.getPriceHistory(
    filters,
    100
  );
}

async getItemAbcAnalysis(
  year: number,
  months: number[] = []
): Promise<{
  kpi: ItemAbcKpi;
  items: ItemAbcAnalysis[];
}> {
  const sortedMonths = [...months].sort((a, b) => a - b);

  let startDate = `${year}-01-01`;
  let endDate = `${year}-12-31`;

  if (sortedMonths.length > 0) {
    const startMonth = sortedMonths[0];
    const endMonth = sortedMonths[sortedMonths.length - 1];

    startDate = `${year}-${String(startMonth).padStart(2, "0")}-01`;

    const lastDay = new Date(
      Date.UTC(year, endMonth, 0)
    ).getUTCDate();

    endDate = `${year}-${String(endMonth).padStart(2, "0")}-${String(
      lastDay
    ).padStart(2, "0")}`;
  }

  const items =
    await itemAbcAnalysisRepository.getAnalysis(
      startDate,
      endDate
    );

  const kpi: ItemAbcKpi = {
    class_a_items: items.filter(
      (item) => item.abc_class === "A"
    ).length,

    class_b_items: items.filter(
      (item) => item.abc_class === "B"
    ).length,

    class_c_items: items.filter(
      (item) => item.abc_class === "C"
    ).length,

    total_spend: items.reduce(
      (sum, item) => sum + Number(item.total_spend || 0),
      0
    ),
  };

  return {
    kpi,
    items,
  };
}
}
export const analyticsService = new AnalyticsService();