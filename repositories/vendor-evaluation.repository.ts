import { supabaseAdmin } from "@/lib/supabase-admin";

export interface VendorEvaluation {
  id: number;
  category: string;
  period: string;
  year: number;
  vendor: string;
  price: number;
  quality: number;
  actual_quantity_delivery: number;
  on_time_delivery: number;
  final_score: number;
  status: "Good" | "Enough" | "Bad";
  evaluation_pdf: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorEvaluationFilters {
  vendors?: string[];
  period?: string;
  year?: number;
}

export class VendorEvaluationRepository {
  async getAll(
    filters: VendorEvaluationFilters = {}
  ): Promise<VendorEvaluation[]> {
    let query = supabaseAdmin
      .from("vendor_evaluations")
      .select(`
        id,
        category,
        period,
        year,
        vendor,
        price,
        quality,
        actual_quantity_delivery,
        on_time_delivery,
        final_score,
        status,
        evaluation_pdf,
        created_at,
        updated_at
      `)
      .order("final_score", {
        ascending: false,
      })
      .order("vendor", {
        ascending: true,
      });

    if (
      filters.vendors &&
      filters.vendors.length > 0
    ) {
      query = query.in(
        "vendor",
        filters.vendors
      );
    }

    if (filters.period) {
      query = query.eq(
        "period",
        filters.period
      );
    }

    if (filters.year) {
      query = query.eq(
        "year",
        filters.year
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to load vendor evaluations: ${error.message}`
      );
    }

    return (data ?? []) as VendorEvaluation[];
  }

  async getVendors(
    year?: number,
    period?: string
  ): Promise<string[]> {
    let query = supabaseAdmin
      .from("vendor_evaluations")
      .select("vendor")
      .order("vendor", {
        ascending: true,
      });

    if (year) {
      query = query.eq("year", year);
    }

    if (period) {
      query = query.eq(
        "period",
        period
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to load evaluation vendors: ${error.message}`
      );
    }

    return Array.from(
      new Set(
        (data ?? [])
          .map((row) => row.vendor)
          .filter(Boolean)
      )
    );
  }

  async getPeriods(
    year?: number
  ): Promise<string[]> {
    let query = supabaseAdmin
      .from("vendor_evaluations")
      .select("period")
      .order("period", {
        ascending: true,
      });

    if (year) {
      query = query.eq(
        "year",
        year
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to load evaluation periods: ${error.message}`
      );
    }

    return Array.from(
      new Set(
        (data ?? [])
          .map((row) => row.period)
          .filter(Boolean)
      )
    );
  }
}

export const vendorEvaluationRepository =
  new VendorEvaluationRepository();