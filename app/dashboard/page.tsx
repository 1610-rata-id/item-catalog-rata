import { AnalyticsService } from "@/services/analytics-service";

import DashboardFilter from "@/components/analytics/DashboardFilter";
import DashboardHeader from "@/components/analytics/DashboardHeader";
import KpiGrid from "@/components/analytics/KpiGrid";
import DashboardLayout from "@/components/analytics/DashboardLayout";

import {
  DEFAULT_DASHBOARD_FILTER,
} from "@/types/dashboard-filter";

import {
  buildCurrentRange,
  buildPreviousRange,
  buildComparisonLabel,
} from "@/lib/date-range";

interface DashboardPageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
    vendor?: string;
    search?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const analyticsService = new AnalyticsService();

  const params = await searchParams;

  const selectedYear = Number(params.year);

const filters = {
  year: Number.isNaN(selectedYear)
    ? DEFAULT_DASHBOARD_FILTER.year
    : selectedYear,

  months:
    params.month
      ? params.month
          .split(",")
          .filter(Boolean)
          .map(Number)
          .filter((month) =>
            Number.isInteger(month) &&
            month >= 1 &&
            month <= 12
          )
      : [],

  vendor:
    params.vendor && params.vendor !== "all"
      ? params.vendor
      : null,

  search: params.search ?? "",
};

  const overview =
    await analyticsService.getDashboardOverview(filters);

  const monthlySpend =
    await analyticsService.getMonthlySpend(filters);

  const vendors =
    await analyticsService.getVendorList(filters.year);

  const topSpendItems =
    await analyticsService.getTopSpendItems(filters);

  const topVendors =
    await analyticsService.getTopVendors(filters);

  const recentTransactions =
    await analyticsService.getRecentTransactions(filters);

  const currentRange = buildCurrentRange(
  filters.year,
  filters.months
);

const previousRange =
  buildPreviousRange(currentRange);

const comparisonLabel =
  buildComparisonLabel(previousRange);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-[1600px] px-8 py-10">
        <DashboardHeader />

        <DashboardFilter
          vendors={vendors}
        />

        <KpiGrid overview={overview} />

        <DashboardLayout
          monthlySpend={monthlySpend}
          topSpendItems={topSpendItems}
          topVendors={topVendors}
          recentTransactions={recentTransactions}
        />
      </div>
    </main>
  );
}