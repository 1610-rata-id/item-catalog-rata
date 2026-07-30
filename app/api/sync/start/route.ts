import { NextResponse } from "next/server";
import { syncTransactions } from "@/sync/services/sync-service";

export async function POST() {
  try {
    console.log("");
    console.log("=======================================");
    console.log("PROCUREMENT ETL STARTED");
    console.log("=======================================");

    const result = await syncTransactions();

    console.log("");
    console.log("=======================================");
    console.log("PROCUREMENT ETL FINISHED");
    console.log("=======================================");

    return NextResponse.json(
      {
        success: result.success,
        message: result.success
          ? "Sync completed successfully."
          : "Sync completed with errors.",
        data: result,
      },
      {
        status: result.success ? 200 : 207,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error during synchronization.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}