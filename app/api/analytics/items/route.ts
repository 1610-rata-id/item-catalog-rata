import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const yearParam = searchParams.get("year");
    const search = searchParams.get("search")?.trim() ?? "";
    const limitParam = searchParams.get("limit");

    const year = Number(yearParam);
    const limit = Number(limitParam) || 100;

    if (!Number.isInteger(year)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid year",
        },
        { status: 400 }
      );
    }

    const safeLimit = Math.min(
      Math.max(limit, 1),
      100
    );

    const { data, error } = await supabaseAdmin.rpc(
      "get_item_filter_options",
      {
        p_year: year,
        p_search: search || null,
        p_limit: safeLimit,
      }
    );

    if (error) {
      console.error(
        "Failed to load item filter options:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data ?? [],
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unexpected item filter API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error",
      },
      { status: 500 }
    );
  }
}