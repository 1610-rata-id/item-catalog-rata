"use client";

import { useEffect, useState } from "react";

import { useDashboardFilter } from "@/hooks/use-dashboard-filter";

import {
  ItemAbcAnalysis,
  ItemAbcKpi,
} from "@/types/item-abc-analysis";

import ItemAbcKpiGrid from "./ItemAbcKpiGrid";
import ItemAbcDistribution from "./ItemAbcDistribution";
import ItemAbcShareSpend from "./ItemAbcShareSpend";
import ItemAbcPareto from "./ItemAbcPareto";
import ItemAbcDetail from "./ItemAbcDetail";

interface ItemAbcResponse {
  success: boolean;
  data: {
    kpi: ItemAbcKpi;
    items: ItemAbcAnalysis[];
  };
  message?: string;
}

export default function ItemAbcPage() {
  const {
    selectedYear,
    selectedMonths,
  } = useDashboardFilter();

  const [data, setData] =
    useState<ItemAbcResponse["data"] | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

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

        const response = await fetch(
          `/api/analytics/item-abc-analysis?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load item ABC analysis: ${response.status}`
          );
        }

        const result =
          (await response.json()) as ItemAbcResponse;

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load item ABC analysis data"
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
          "Item ABC Analysis loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load item ABC analysis data"
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
  ]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-card">
        <p className="text-sm text-muted-foreground">
          Loading ABC analysis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Failed to load ABC Analysis
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
      {/* ABC NOTE */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-950/20">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-semibold">
            ABC Analysis
          </span>{" "}
          is calculated based on{" "}
          <span className="font-semibold">
            Regular
          </span>{" "}
          transactions.{" "}
          <span className="font-semibold">
            Non-Regular
          </span>{" "}
          transactions are excluded from the classification.
        </p>
      </div>

      {/* KPI */}
      <ItemAbcKpiGrid kpi={data.kpi} />

      {/* DISTRIBUTION + SHARE VS SPEND */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[9fr_11fr]">
        <ItemAbcDistribution
          classA={data.kpi.class_a_items}
          classB={data.kpi.class_b_items}
          classC={data.kpi.class_c_items}
        />

        <ItemAbcShareSpend
          items={data.items}
        />
      </div>

      {/* PARETO */}
      <ItemAbcPareto
        items={data.items}
      />

      {/* DETAIL */}
      <ItemAbcDetail
        items={data.items}
      />
    </div>
  );
}