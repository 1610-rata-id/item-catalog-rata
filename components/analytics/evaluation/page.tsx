"use client";

import { useMemo, useState } from "react";

import EvaluationHeader from "@/components/analytics/evaluation/EvaluationHeader";
import EvaluationFilters from "@/components/analytics/evaluation/EvaluationFilters";
import EvaluationKpiGrid from "@/components/analytics/evaluation/EvaluationKpiGrid";
import EvaluationDistribution from "@/components/analytics/evaluation/EvaluationDistribution";
import EvaluationTopVendors from "@/components/analytics/evaluation/EvaluationTopVendors";
import EvaluationDetail from "@/components/analytics/evaluation/EvaluationDetail";

import type {
  VendorEvaluation,
} from "@/repositories/vendor-evaluation.repository";

interface EvaluationPageProps {
  evaluations: VendorEvaluation[];
  vendors: string[];
  periods: string[];
  year: number;
  defaultPeriod: string;
}

export default function EvaluationPage({
  evaluations,
  vendors,
  periods,
  year,
  defaultPeriod,
}: EvaluationPageProps) {
  const [selectedVendors, setSelectedVendors] =
    useState<string[]>([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState(defaultPeriod);

  const [search, setSearch] =
    useState("");

  const filteredEvaluations = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return evaluations.filter(
      (evaluation) => {
        const vendorMatch =
          selectedVendors.length === 0 ||
          selectedVendors.includes(
            evaluation.vendor
          );

        const periodMatch =
          !selectedPeriod ||
          evaluation.period ===
            selectedPeriod;

        const searchMatch =
          !keyword ||
          evaluation.vendor
            .toLowerCase()
            .includes(keyword) ||
          evaluation.category
            .toLowerCase()
            .includes(keyword) ||
          evaluation.period
            .toLowerCase()
            .includes(keyword) ||
          evaluation.status
            .toLowerCase()
            .includes(keyword);

        return (
          vendorMatch &&
          periodMatch &&
          searchMatch
        );
      }
    );
  }, [
    evaluations,
    selectedVendors,
    selectedPeriod,
    search,
  ]);

  const average = (
    field:
      | "price"
      | "quality"
      | "actual_quantity_delivery"
      | "on_time_delivery"
  ) => {
    if (filteredEvaluations.length === 0) {
      return 0;
    }

    const total =
      filteredEvaluations.reduce(
        (sum, item) =>
          sum + Number(item[field]),
        0
      );

    return total / filteredEvaluations.length;
  };

  const price = average("price");
  const quality = average("quality");
  const actualQuantityDelivery = average(
    "actual_quantity_delivery"
  );
  const onTimeDelivery = average(
    "on_time_delivery"
  );

  const averageScore =
    filteredEvaluations.length > 0
      ? filteredEvaluations.reduce(
          (sum, item) =>
            sum + Number(item.final_score),
          0
        ) / filteredEvaluations.length
      : 0;

  const good = filteredEvaluations.filter(
    (item) => item.status === "Good"
  ).length;

  const enough = filteredEvaluations.filter(
    (item) => item.status === "Enough"
  ).length;

  const bad = filteredEvaluations.filter(
    (item) => item.status === "Bad"
  ).length;

  const topVendors = [...filteredEvaluations]
    .sort(
      (a, b) =>
        Number(b.final_score) -
        Number(a.final_score)
    )
    .slice(0, 10)
    .map((item) => ({
      vendor: item.vendor,
      final_score: Number(
        item.final_score
      ),
      status: item.status,
    }));

  const uniqueTopVendors =
    Array.from(
      new Map(
        topVendors.map((item) => [
          item.vendor,
          item,
        ])
      ).values()
    ).slice(0, 10);

  function handleReset() {
    setSelectedVendors([]);
    setSelectedPeriod(defaultPeriod);
    setSearch("");
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">

        <EvaluationHeader year={year} />

        <div className="mt-6">
          <EvaluationFilters
            vendors={vendors}
            periods={periods}
            selectedVendors={selectedVendors}
            selectedPeriod={selectedPeriod}
            search={search}
            onVendorsChange={
              setSelectedVendors
            }
            onPeriodChange={
              setSelectedPeriod
            }
            onSearchChange={setSearch}
            onReset={handleReset}
          />
        </div>

        <div className="mt-5">
          <EvaluationKpiGrid
            price={price}
            quality={quality}
            actualQuantityDelivery={
              actualQuantityDelivery
            }
            onTimeDelivery={
              onTimeDelivery
            }
          />
        </div>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <EvaluationDistribution
            good={good}
            enough={enough}
            bad={bad}
            averageScore={averageScore}
          />

          <EvaluationTopVendors
            vendors={uniqueTopVendors}
          />
        </section>

        <section className="mt-5">
          <EvaluationDetail
            evaluations={
              filteredEvaluations
            }
          />
        </section>

      </div>
    </main>
  );
}