import { NextRequest, NextResponse } from "next/server";

import { analyticsService } from "@/services/analytics-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const yearParam = searchParams.get("year");
    const monthsParam = searchParams.get("months");
    const vendorsParam = searchParams.get("vendors");
    const itemsParam = searchParams.get("items");

    const year = Number(yearParam);

    if (!year || Number.isNaN(year)) {
      return NextResponse.json(
        {
          success: false,
          error: "Year is required",
        },
        { status: 400 }
      );
    }

    const months = monthsParam
      ? monthsParam
          .split(",")
          .map((value) => Number(value))
          .filter(
            (value) =>
              Number.isInteger(value) &&
              value >= 1 &&
              value <= 12
          )
      : [];

    const vendors = vendorsParam
      ? vendorsParam
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    const items = itemsParam
      ? itemsParam
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    const filters = {
      year,
      months,
      vendors,
      items,
    };

    const [
  kpi,
  priceTrend,
  vendorPriceComparison,
  priceHistory,
  priceDistribution,
] = await Promise.all([
  analyticsService.getItemPriceKpi(filters),
  analyticsService.getItemPriceTrend(filters),
  analyticsService.getItemVendorPriceComparison(filters),
  analyticsService.getItemPriceHistory(filters),
  analyticsService.getItemPriceDistribution(filters),
]);

    return NextResponse.json({
      success: true,
      data: {
        kpi,
        priceTrend,
        vendorPriceComparison,
        priceHistory,
        priceDistribution,
      },
    });
  } catch (error) {
    console.error(
      "Item Price Analysis API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load item price analysis data",
      },
      { status: 500 }
    );
  }
}