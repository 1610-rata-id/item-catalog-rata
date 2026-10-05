import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services/analytics-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const yearParam = searchParams.get("year");
    const monthsParam = searchParams.get("months");

    const year = yearParam
      ? Number(yearParam)
      : new Date().getFullYear();

    if (!Number.isInteger(year)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid year parameter.",
        },
        { status: 400 }
      );
    }

    const months =
      monthsParam
        ?.split(",")
        .map((value) => Number(value))
        .filter(
          (month) =>
            Number.isInteger(month) &&
            month >= 1 &&
            month <= 12
        ) ?? [];

    const data =
      await analyticsService.getItemAbcAnalysis(
        year,
        months
      );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Item ABC Analysis API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load item ABC analysis.",
      },
      { status: 500 }
    );
  }
}