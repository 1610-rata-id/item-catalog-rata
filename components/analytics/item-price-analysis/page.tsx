"use client";

import { useEffect, useState } from "react";

import { useDashboardFilter } from "@/hooks/use-dashboard-filter";

import {
  ItemPriceHistory,
  ItemPriceKpi,
  ItemPriceTrend,
  ItemVendorPriceComparison,
  ItemPriceDistribution,
} from "@/types/item-price-analysis";

import ItemPriceKpiGrid from "./ItemPriceKpiGrid";
import PriceTrendCard from "./PriceTrendCard";
import VendorPriceComparisonCard from "./VendorPriceComparisonCard";
import PriceHistory from "./PriceHistory";
import PriceDistributionCard from "./PriceDistributionCard";

interface ItemPriceAnalysisResponse {
  success: boolean;
  data: {
    kpi: ItemPriceKpi;
    priceTrend: ItemPriceTrend[];
    vendorPriceComparison: ItemVendorPriceComparison[];
    priceDistribution: ItemPriceDistribution[];
    priceHistory: ItemPriceHistory[];
  };
  error?: string;
}

export default function ItemPriceAnalysisPage() {
  const {
    selectedYear,
    selectedMonths,
    selectedVendors,
    selectedItems,
  } = useDashboardFilter();

  const [data, setData] =
    useState<ItemPriceAnalysisResponse["data"] | null>(
      null
    );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        params.set(
          "year",
          String(selectedYear)
        );

        if (selectedMonths.length > 0) {
          params.set(
            "months",
            selectedMonths.join(",")
          );
        }

        if (selectedVendors.length > 0) {
          params.set(
            "vendors",
            selectedVendors.join(",")
          );
        }

        if (selectedItems.length > 0) {
          params.set(
            "items",
            selectedItems.join(",")
          );
        }

        const response = await fetch(
          `/api/analytics/item-price-analysis?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load item price analysis: ${response.status}`
          );
        }

        const result =
          (await response.json()) as ItemPriceAnalysisResponse;

        if (!result.success) {
          throw new Error(
            result.error ||
              "Failed to load item price analysis data"
          );
        }

        setData(result.data);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Item Price Analysis loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load item price analysis data"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [
    selectedYear,
    selectedMonths,
    selectedVendors,
    selectedItems,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-card">
        <p className="text-sm text-muted-foreground">
          Loading price analysis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Failed to load Price Analysis
        </p>

        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
  <div className="space-y-6">
    <ItemPriceKpiGrid kpi={data.kpi} />

<PriceTrendCard data={data.priceTrend} />

<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
  <VendorPriceComparisonCard
    data={data.vendorPriceComparison}
  />

  <PriceDistributionCard
  data={data.priceDistribution}
/>
</div>

<PriceHistory data={data.priceHistory} />
  </div>
);

}