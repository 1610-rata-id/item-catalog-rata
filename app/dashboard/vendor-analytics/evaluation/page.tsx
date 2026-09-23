import { AnalyticsService } from "@/services/analytics-service";

import EvaluationPage from "@/components/analytics/evaluation/page";

interface PageProps {
  searchParams: Promise<{
    period?: string;
    vendor?: string;
  }>;
}

export default async function Page({
  searchParams,
}: PageProps) {
  const analyticsService =
    new AnalyticsService();

  const params = await searchParams;

  const year = new Date().getFullYear();

  const [
    evaluations,
    vendors,
    periods,
  ] = await Promise.all([
    analyticsService.getVendorEvaluations({
      year,
    }),

    analyticsService.getEvaluationVendors(
      year
    ),

    analyticsService.getEvaluationPeriods(
      year
    ),
  ]);

  /*
   * Default period:
   * gunakan period terakhir yang tersedia.
   *
   * Q1 < Q2 < Q3 < Q4
   */
  const periodOrder: Record<
    string,
    number
  > = {
    Q1: 1,
    Q2: 2,
    Q3: 3,
    Q4: 4,
  };

  const sortedPeriods = [...periods].sort(
    (a, b) =>
      (periodOrder[b] ?? 0) -
      (periodOrder[a] ?? 0)
  );

  const defaultPeriod =
    params.period &&
    periods.includes(params.period)
      ? params.period
      : sortedPeriods[0] ?? "";

  return (
    <EvaluationPage
      evaluations={evaluations}
      vendors={vendors}
      periods={periods}
      year={year}
      defaultPeriod={defaultPeriod}
    />
  );
}