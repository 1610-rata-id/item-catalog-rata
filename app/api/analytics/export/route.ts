import { NextRequest } from "next/server";

import { AnalyticsService } from "@/services/analytics-service";
import { generateExcelReport } from "@/lib/export/excel-report";

export async function GET(
  request: NextRequest
) {
  const { searchParams } =
    new URL(request.url);

  const year =
  Number(searchParams.get("year")) ||
  new Date().getFullYear();

const monthParam =
  searchParams.get("months") ??
  searchParams.get("month");

const months = monthParam
  ? monthParam
      .split(",")
      .map(Number)
      .filter(
        (month) =>
          Number.isInteger(month) &&
          month >= 1 &&
          month <= 12
      )
  : [];

const filters = {
  year,

  months,

  vendor:
    searchParams.get("vendor") || null,

  search:
    searchParams.get("search") || "",
};

  const analytics =
    new AnalyticsService();

  const [
    overview,
    monthlySpend,
    topItems,
    topVendors,
    recentTransactions,
  ] = await Promise.all([
    analytics.getDashboardOverview(filters),
    analytics.getMonthlySpend(filters),
    analytics.getTopSpendItems(filters),
    analytics.getTopVendors(filters),
    analytics.getRecentTransactions(filters),
  ]);

  const workbook =
    await generateExcelReport({
      filters,
      overview,
      monthlySpend,
      topItems,
      topVendors,
      recentTransactions,
    });

  const buffer =
    await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition":
        `attachment; filename=Procurement_Report_${filters.year}.xlsx`,
    },
  });
}