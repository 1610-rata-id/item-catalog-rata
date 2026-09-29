import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services/analytics-service";

interface RouteContext {
  params: Promise<{
    vendorId: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { vendorId } = await context.params;

    if (!vendorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor ID is required",
        },
        { status: 400 }
      );
    }

    const vendorDetails =
      await analyticsService.getVendorDetails(vendorId);

    if (!vendorDetails) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor details not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vendorDetails,
    });
  } catch (error) {
    console.error("Vendor detail API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load vendor details",
      },
      { status: 500 }
    );
  }
}