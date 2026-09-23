import { VendorRiskMatrixRecord } from "../types/vendor-risk-matrix";

interface RiskMatrixApiResponse {
  success: boolean;
  total: number;
  data: Record<string, unknown>[];
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_ANALYTICS_API;

export async function extractRiskMatrix(): Promise<
  VendorRiskMatrixRecord[]
> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_ANALYTICS_API is not configured."
    );
  }

  const url = new URL(API_URL);
  url.searchParams.set("sheet", "Risk Matrix");

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Risk Matrix API request failed: ${response.status} ${response.statusText}`
    );
  }

  const result =
    (await response.json()) as RiskMatrixApiResponse;

  if (!result.success) {
    throw new Error(
      result.message ??
        "Risk Matrix API returned success=false."
    );
  }

  if (!Array.isArray(result.data)) {
    throw new Error(
      "Risk Matrix API returned invalid data format."
    );
  }

  const getField = (
    row: Record<string, unknown>,
    fieldName: string
  ) => {
    const key = Object.keys(row).find(
      (key) => key.trim() === fieldName
    );

    return key ? row[key] : undefined;
  };

  const records = result.data
    .map((row) => ({
      vendor: String(
        getField(row, "Vendor") ?? ""
      ).trim(),

      material: String(
        getField(row, "Material") ?? ""
      ).trim(),

      single_source:
        getField(row, "Single Source") === true ||
        String(
          getField(row, "Single Source") ?? ""
        )
          .toLowerCase()
          .trim() === "true",

      frequent_backorder:
        getField(row, "Frequent Backorder") === true ||
        String(
          getField(row, "Frequent Backorder") ?? ""
        )
          .toLowerCase()
          .trim() === "true",

      risk_level: String(
        getField(row, "Risk Level") ?? ""
      ).trim() as "Low" | "Medium" | "High",
    }))
    .filter(
      (record) =>
        record.vendor !== "" &&
        record.material !== ""
    );

  console.log(
    `Risk Matrix final records: ${records.length}`
  );

  return records;
}