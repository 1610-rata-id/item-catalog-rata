import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services/analytics-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const vendorsParam = searchParams.get("vendors");
    const itemsParam = searchParams.get("items");

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
      vendors,
      items,
    };

    const [kpi, complianceContracts, materialDocuments, documentVendors] =
      await Promise.all([
        analyticsService.getDocumentsKpi(),
        analyticsService.getVendorComplianceContracts(filters),
        analyticsService.getVendorMaterialDocuments(filters),
        analyticsService.getDocumentVendors(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        kpi,
        complianceContracts,
        materialDocuments,
        vendors: documentVendors,
      },
    });
  } catch (error) {
    console.error("Documents API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load documents data",
      },
      { status: 500 }
    );
  }
}