import { supabaseAdmin } from "@/lib/supabase-admin";
import { VendorRiskMatrix } from "@/types/vendor-risk-matrix";
import { VendorRiskMatrixRecord } from "@/etl/types/vendor-risk-matrix";

export class VendorRiskMatrixRepository {
  // ============================================================
  // READ — DASHBOARD
  // ============================================================

  async getAll(
    vendors: string[] = []
  ): Promise<VendorRiskMatrix[]> {
    let query = supabaseAdmin
      .from("vendor_risk_matrix")
      .select(
        `
          id,
          vendor,
          material,
          single_source,
          frequent_backorder,
          risk_level,
          created_at,
          updated_at
        `
      )
      .order("vendor", { ascending: true })
      .order("material", { ascending: true });

    if (vendors.length > 0) {
      query = query.in("vendor", vendors);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to load vendor risk matrix: ${error.message}`
      );
    }

    return data ?? [];
  }

  // ============================================================
  // WRITE — ETL
  // ============================================================

  async upsert(records: VendorRiskMatrixRecord[]) {
    if (records.length === 0) {
      return;
    }

    const { error } = await supabaseAdmin
      .from("vendor_risk_matrix")
      .upsert(records, {
        onConflict: "vendor,material",
      });

    if (error) {
      throw new Error(
        `Failed to upsert vendor risk matrix: ${error.message}`
      );
    }
  }
}

export const vendorRiskMatrixRepository =
  new VendorRiskMatrixRepository();