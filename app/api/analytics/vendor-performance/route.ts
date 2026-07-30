import { NextResponse } from "next/server";
import { analyticsRepository } from "@/repositories/analytics.repository";

export async function GET() {
  try {
    const data = await analyticsRepository.getVendorPerformance();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load vendor performance",
      },
      {
        status: 500,
      }
    );
  }
}