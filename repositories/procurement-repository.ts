import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProcurementQuery } from "@/types/procurement-query";
import { DashboardOverview } from "@/types/dashboard-overview";
import { MonthlySpend } from "@/types/monthly-spend";
import { TopSpendItem } from "@/types/top-spend-item";
import { TopVendor } from "@/types/top-vendor";
import { RecentTransaction } from "@/types/recent-transaction";
import { VendorList } from "@/types/vendor-list";
import { DashboardFilterState } from "@/types/dashboard-filter";
import { VendorPerformance } from "@/types/vendor-performance";

import {
  buildCurrentRange,
  formatDateOnly,
} from "@/lib/date-range";

export class ProcurementRepository {
  // ============================================================
  // TRANSACTIONS
  // ============================================================

  async getTransactions(query?: ProcurementQuery) {
    let builder = supabaseAdmin
      .from("procurement_transactions")
      .select("*")
      .order("order_date", { ascending: false });

    if (query?.limit) {
      builder = builder.limit(query.limit);
    }

    if (query?.offset) {
      const from = query.offset;
      const to =
        query.offset + (query.limit ?? 100) - 1;

      builder = builder.range(from, to);
    }

    const { data, error } = await builder;

    if (error) {
      throw new Error(
        `Failed to load transactions: ${error.message}`
      );
    }

    return data;
  }

  // ============================================================
  // VENDOR PERFORMANCE
  // ============================================================

  async getVendorPerformance(
  filters: DashboardFilterState
): Promise<VendorPerformance[]> {
  const range = buildCurrentRange(
    filters.year,
    filters.months
  );

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_vendor_performance",
        {
          p_start_date: formatDateOnly(
            range.startDate
          ),
          p_end_date: formatDateOnly(
            range.endDate
          ),

          p_vendors:
            filters.vendors.length > 0
              ? filters.vendors
              : [],

          p_items:
            filters.items.length > 0
              ? filters.items
              : [],

          // Top 10 Vendor
          p_limit: 10,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load vendor performance: ${error.message}`
      );
    }

    return data ?? [];
  }

  // ============================================================
  // VENDOR PROCUREMENT SUMMARY
  // ============================================================

  async getVendorProcurementSummary(
    filters: DashboardFilterState
  ) {
    const range = buildCurrentRange(
      filters.year,
      filters.months
    );

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_vendor_performance",
        {
          p_start_date: formatDateOnly(
            range.startDate
          ),
          p_end_date: formatDateOnly(
            range.endDate
          ),

          p_vendors:
            filters.vendors.length > 0
              ? filters.vendors
              : [],

          p_items:
            filters.items.length > 0
              ? filters.items
              : [],

          // Semua vendor
          p_limit: 1000,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load vendor procurement summary: ${error.message}`
      );
    }

    return data ?? [];
  }

  // ============================================================
  // DASHBOARD OVERVIEW
  // ============================================================

  async getDashboardOverview(
    filters: DashboardFilterState
  ): Promise<DashboardOverview> {
    const range = buildCurrentRange(
      filters.year,
      filters.months
    );

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_procurement_overview",
        {
          p_start_date: formatDateOnly(
            range.startDate
          ),
          p_end_date: formatDateOnly(
            range.endDate
          ),

          p_vendors:
            filters.vendors.length > 0
              ? filters.vendors
              : [],

          p_items:
            filters.items.length > 0
              ? filters.items
              : [],
        }
      );

    if (error) {
      throw new Error(
        `Failed to load dashboard overview: ${error.message}`
      );
    }

    return data[0];
  }

  // ============================================================
  // MONTHLY SPEND
  // ============================================================

  async getMonthlySpend(
    filters: DashboardFilterState
  ): Promise<MonthlySpend[]> {
    const range = buildCurrentRange(
      filters.year,
      filters.months
    );

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_monthly_spend",
        {
          p_start_date: formatDateOnly(
            range.startDate
          ),
          p_end_date: formatDateOnly(
            range.endDate
          ),

          p_vendors:
            filters.vendors.length > 0
              ? filters.vendors
              : [],

          p_items:
            filters.items.length > 0
              ? filters.items
              : [],
        }
      );

    if (error) {
      throw new Error(
        `Failed to load monthly spend: ${error.message}`
      );
    }

    return data ?? [];
  }

  // ============================================================
  // TOP SPEND ITEMS
  // ============================================================

  async getTopSpendItems(
    filters: DashboardFilterState
  ): Promise<TopSpendItem[]> {
    const range = buildCurrentRange(
      filters.year,
      filters.months
    );

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_top_spend_items",
        {
          p_start_date: formatDateOnly(
            range.startDate
          ),
          p_end_date: formatDateOnly(
            range.endDate
          ),

          p_vendors:
            filters.vendors.length > 0
              ? filters.vendors
              : [],

          p_items:
            filters.items.length > 0
              ? filters.items
              : [],

          p_limit: 10,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load top spend items: ${error.message}`
      );
    }

    return data ?? [];
  }

  // ============================================================
  // TOP VENDORS
  // ============================================================

  async getTopVendors(
    filters: DashboardFilterState
  ): Promise<TopVendor[]> {
    const range = buildCurrentRange(
      filters.year,
      filters.months
    );

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_vendor_performance",
        {
          p_start_date: formatDateOnly(
            range.startDate
          ),
          p_end_date: formatDateOnly(
            range.endDate
          ),

          p_vendors:
            filters.vendors.length > 0
              ? filters.vendors
              : [],

          p_items:
            filters.items.length > 0
              ? filters.items
              : [],

          p_limit: 10,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load top vendors: ${error.message}`
      );
    }

    return data ?? [];
  }

  // ============================================================
  // RECENT TRANSACTIONS
  // ============================================================

  async getRecentTransactions(
    filters: DashboardFilterState
  ): Promise<RecentTransaction[]> {
    const range = buildCurrentRange(
      filters.year,
      filters.months
    );

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_recent_transactions",
        {
          p_start_date: formatDateOnly(
            range.startDate
          ),
          p_end_date: formatDateOnly(
            range.endDate
          ),

          p_vendors:
            filters.vendors.length > 0
              ? filters.vendors
              : [],

          p_items:
            filters.items.length > 0
              ? filters.items
              : [],

          p_limit: 10,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load recent transactions: ${error.message}`
      );
    }

    return data ?? [];
  }

  // ============================================================
  // VENDOR LIST
  // ============================================================

  async getVendorList(
    year: number
  ): Promise<VendorList[]> {
    const { data, error } =
      await supabaseAdmin.rpc(
        "get_vendor_list",
        {
          p_year: year,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load vendor list: ${error.message}`
      );
    }

    return data ?? [];
  }

  async getVendorRiskMatrix(
  vendors: string[] = []
) {
  let query = supabaseAdmin
    .from("vendor_risk_matrix")
    .select(`
  id,
  vendor,
  material,
  single_source,
  frequent_backorder,
  risk_level,
  created_at,
  updated_at
`)
    .order("risk_level", {
      ascending: true,
    })
    .order("vendor", {
      ascending: true,
    });

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
}