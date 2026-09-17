import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("etl_sync_status")
      .select("last_successful_sync")
      .eq("id", 1)
      .single();

    if (error) {
      console.error(
        "Failed to fetch ETL sync status:",
        error
      );

      return NextResponse.json(
        {
          error: "Failed to fetch ETL sync status",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        last_successful_sync:
          data?.last_successful_sync ?? null,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "ETL status API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}