"use client";

import { useEffect, useState } from "react";

import { useDashboardFilter } from "@/hooks/use-dashboard-filter";

import {
  ItemPerformanceKpi,
  ItemTopSpend,
  ItemProcurementSummary as ItemProcurementSummaryData,
  ItemTransactionHistory as ItemTransactionHistoryData,
} from "@/types/item-performance";

import ItemPerformanceKpiGrid from "./ItemPerformanceKpiGrid";
import TopItemSpendCard from "./TopItemSpendCard";
import ItemProcurementSummary from "./ItemProcurementSummary";
import ItemTransactionHistory from "./ItemTransactionHistory";

interface ItemPerformanceResponse {
  success: boolean;
  data: {
    kpi: ItemPerformanceKpi;
    topSpend: ItemTopSpend[];
    procurementSummary: ItemProcurementSummaryData[];
    transactionHistory: ItemTransactionHistoryData[];
  };
  error?: string;
}

export default function ItemPerformancePage() {
  const {
    selectedYear,
    selectedMonths,
    selectedVendors,
    selectedItems,
  } = useDashboardFilter();

  const [data, setData] =
    useState<ItemPerformanceResponse["data"] | null>(null);

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
          `/api/analytics/item-performance?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load item performance: ${response.status}`
          );
        }

        const result =
          (await response.json()) as ItemPerformanceResponse;

        if (!result.success) {
          throw new Error(
            result.error ||
              "Failed to load item performance data"
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
          "Item Performance loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load item performance data"
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
          Loading item performance...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Failed to load Item Performance
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
    <ItemPerformanceKpiGrid
      kpi={data.kpi}
    />

    <TopItemSpendCard
      items={data.topSpend}
    />

    <ItemProcurementSummary
      items={data.procurementSummary}
    />

    <ItemTransactionHistory
      items={data.transactionHistory}
    />
  </div>
);
}