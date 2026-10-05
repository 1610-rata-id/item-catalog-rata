import DashboardFilter from "@/components/analytics/DashboardFilter";
import ItemPerformanceHeader from "@/components/analytics/item-performance/ItemPerformanceHeader";
import ItemPerformancePage from "@/components/analytics/item-performance/page";

import { analyticsService } from "@/services/analytics-service";

import {
  DEFAULT_DASHBOARD_FILTER,
} from "@/types/dashboard-filter";

interface PageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
    vendors?: string;
    items?: string;
  }>;
}

export default async function Page({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const selectedYear = Number(params.year);

  const year = Number.isNaN(selectedYear)
    ? DEFAULT_DASHBOARD_FILTER.year
    : selectedYear;

  const vendors =
    await analyticsService.getVendorList(year);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-[1600px] px-8 py-10">
        <ItemPerformanceHeader />

        <DashboardFilter
          vendors={vendors}
        />

        <ItemPerformancePage />
      </div>
    </main>
  );
}