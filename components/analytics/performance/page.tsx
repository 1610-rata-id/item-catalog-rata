import { AnalyticsService } from "@/services/analytics-service";

import DashboardFilter from "@/components/analytics/DashboardFilter";

import PerformanceHeader from "@/components/analytics/performance/PerformanceHeader";
import PerformanceKpiGrid from "@/components/analytics/performance/PerformanceKpiGrid";
import TopVendorCard from "@/components/analytics/performance/TopVendorCard";
import VendorProcurementSummary from "@/components/analytics/performance/VendorProcurementSummary";
import VendorRiskOverview from "@/components/analytics/performance/VendorRiskOverview";

import { DEFAULT_DASHBOARD_FILTER } from "@/types/dashboard-filter";

interface PerformancePageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
    vendors?: string;
    items?: string;
  }>;
}

export default async function PerformancePage({
  searchParams,
}: PerformancePageProps) {
  const analyticsService =
    new AnalyticsService();

  const params = await searchParams;

  const selectedYear = Number(
    params.year
  );

  const filters = {
    year: Number.isNaN(selectedYear)
      ? DEFAULT_DASHBOARD_FILTER.year
      : selectedYear,

    months: params.month
      ? params.month
          .split(",")
          .filter(Boolean)
          .map(Number)
          .filter(
            (month) =>
              Number.isInteger(month) &&
              month >= 1 &&
              month <= 12
          )
      : [],

    vendors: params.vendors
      ? params.vendors
          .split(",")
          .filter(Boolean)
      : [],

    items: params.items
      ? params.items
          .split(",")
          .filter(Boolean)
      : [],
  };

  const [
    overview,
    vendors,
    topVendors,
    procurementSummary,
    riskMatrix,
  ] = await Promise.all([
    analyticsService.getDashboardOverview(
      filters
    ),

    analyticsService.getVendorList(
      filters.year
    ),

    analyticsService.getVendorPerformance(
      filters
    ),

    analyticsService.getVendorProcurementSummary(
      filters
    ),

    analyticsService.getVendorRiskMatrix(
      filters.vendors
    ),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950">

      <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">

        {/* HEADER */}

        <PerformanceHeader
          year={filters.year}
        />

        {/* FILTER */}

        <div className="mt-6">
          <DashboardFilter
            vendors={vendors}
          />
        </div>

        {/* KPI */}

        <div className="mt-5">
          <PerformanceKpiGrid
            totalSpend={Number(
              overview.total_spend
            )}
            purchaseOrders={Number(
              overview.total_purchase_orders
            )}
            activeVendors={Number(
              overview.total_vendors
            )}
          />
        </div>

        {/* TOP VENDOR */}

        <section className="mt-5">
          <TopVendorCard
            vendors={topVendors}
          />
        </section>

        {/* BOTTOM GRID */}

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

          <VendorProcurementSummary
            vendors={procurementSummary}
          />

          <VendorRiskOverview
            risks={riskMatrix}
          />

        </section>

      </div>

    </main>
  );
}