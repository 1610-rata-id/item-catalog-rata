import DashboardFilter from "@/components/analytics/DashboardFilter";
import ItemPriceAnalysisHeader from "@/components/analytics/item-price-analysis/ItemPriceAnalysisHeader";
import ItemPriceAnalysisPage from "@/components/analytics/item-price-analysis/page";
import { analyticsService } from "@/services/analytics-service";

interface PriceAnalysisRouteProps {
  searchParams: Promise<{
    year?: string;
  }>;
}

export default async function PriceAnalysisRoute({
  searchParams,
}: PriceAnalysisRouteProps) {
  const params = await searchParams;

  const yearParam = params.year;

  const year =
    yearParam && !Number.isNaN(Number(yearParam))
      ? Number(yearParam)
      : 2026;

  const vendors =
    await analyticsService.getVendorList(year);

  return (
    <div className="space-y-6">
      <ItemPriceAnalysisHeader />

      <DashboardFilter vendors={vendors} />

      <ItemPriceAnalysisPage />
    </div>
  );
}