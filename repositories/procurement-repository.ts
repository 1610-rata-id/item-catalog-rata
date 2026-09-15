import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProcurementQuery } from "@/types/procurement-query";
import { DashboardOverview } from "@/types/dashboard-overview";
import { MonthlySpend } from "@/types/monthly-spend";
import { TopSpendItem } from "@/types/top-spend-item";
import { TopVendor } from "@/types/top-vendor";
import { RecentTransaction } from "@/types/recent-transaction";
import { VendorList } from "@/types/vendor-list";
import { DashboardFilterState } from "@/types/dashboard-filter";	

import {
  buildCurrentRange,
  formatDateOnly,
} from "@/lib/date-range";

export class ProcurementRepository {
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
      const to = query.offset + (query.limit ?? 100) - 1;

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

  async getVendorPerformance(
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

        p_vendor: filters.vendor,

        p_search: filters.search,

        p_limit: 10,
      }
    );

  if (error) {
    throw new Error(
      `Failed to load vendor performance: ${error.message}`
    );
  }

  return data;
}

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

        p_vendor: filters.vendor,

        p_search: filters.search,
      }
    );

  if (error) {
    throw new Error(
      `Failed to load dashboard overview: ${error.message}`
    );
  }

  return data[0];
}

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

        p_vendor: filters.vendor,

        p_search: filters.search,
      }
    );

  if (error) {
    throw new Error(
      `Failed to load monthly spend: ${error.message}`
    );
  }

  return data;
}

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

        p_vendor: filters.vendor,

        p_search: filters.search,

        p_limit: 10,
      }
    );

  if (error) {
    throw new Error(
      `Failed to load top spend items: ${error.message}`
    );
  }

  return data;
}

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

        p_vendor: filters.vendor,

        p_search: filters.search,

        p_limit: 10,
      }
    );

  if (error) {
    throw new Error(
      `Failed to load top vendors: ${error.message}`
    );
  }

  return data;
}

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

        p_vendor: filters.vendor,

        p_search: filters.search,

        p_limit: 10,
      }
    );

  if (error) {
    throw new Error(
      `Failed to load recent transactions: ${error.message}`
    );
  }

  return data;
}

async getVendorList(
  year: number
): Promise<VendorList[]> {
  const { data, error } = await supabaseAdmin.rpc(
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
}