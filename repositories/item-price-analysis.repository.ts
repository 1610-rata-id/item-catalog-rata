import { supabaseAdmin } from "@/lib/supabase-admin";

import {
  ItemPriceHistory,
  ItemPriceKpi,
  ItemPriceTrend,
  ItemVendorPriceComparison,
  ItemPriceDistribution,
} from "@/types/item-price-analysis";

export interface ItemPriceAnalysisFilters {
  year: number;
  months?: number[];
  vendors?: string[];
  items?: string[];
}

function buildDateRange(
  year: number,
  months: number[] = []
) {
  if (!months || months.length === 0) {
    return {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    };
  }

  const sortedMonths = [...months].sort(
    (a, b) => a - b
  );

  const startMonth = sortedMonths[0];
  const endMonth =
    sortedMonths[sortedMonths.length - 1];

  const startDate = `${year}-${String(
    startMonth
  ).padStart(2, "0")}-01`;

  const lastDay = new Date(
    Date.UTC(year, endMonth, 0)
  ).getUTCDate();

  const endDate = `${year}-${String(
    endMonth
  ).padStart(2, "0")}-${String(lastDay).padStart(
    2,
    "0"
  )}`;

  return {
    startDate,
    endDate,
  };
}

export class ItemPriceAnalysisRepository {
  private getRange(
    filters: ItemPriceAnalysisFilters
  ) {
    return buildDateRange(
      filters.year,
      filters.months ?? []
    );
  }

  async getKpi(
    filters: ItemPriceAnalysisFilters
  ): Promise<ItemPriceKpi> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_price_kpi",
        {
          p_start_date: startDate,
          p_end_date: endDate,
          p_vendors: filters.vendors ?? [],
          p_items: filters.items ?? [],
        }
      );

    if (error) {
      throw new Error(
        `Failed to load item price KPI: ${error.message}`
      );
    }

    const row = data?.[0];

    return {
      average_price: Number(
        row?.average_price ?? 0
      ),
      highest_price: Number(
        row?.highest_price ?? 0
      ),
      lowest_price: Number(
        row?.lowest_price ?? 0
      ),
    };
  }

  async getPriceTrend(
    filters: ItemPriceAnalysisFilters
  ): Promise<ItemPriceTrend[]> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_price_trend",
        {
          p_start_date: startDate,
          p_end_date: endDate,
          p_vendors: filters.vendors ?? [],
          p_items: filters.items ?? [],
        }
      );

    if (error) {
      throw new Error(
        `Failed to load item price trend: ${error.message}`
      );
    }

    return (data ?? []).map(
      (row: {
        month_start: string;
        average_price: number | string | null;
      }) => ({
        month_start: row.month_start,
        average_price: Number(
          row.average_price ?? 0
        ),
      })
    );
  }

  async getVendorPriceComparison(
    filters: ItemPriceAnalysisFilters,
    limit = 10
  ): Promise<ItemVendorPriceComparison[]> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_vendor_price_comparison",
        {
          p_start_date: startDate,
          p_end_date: endDate,
          p_vendors: filters.vendors ?? [],
          p_items: filters.items ?? [],
          p_limit: limit,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load vendor price comparison: ${error.message}`
      );
    }

    return (data ?? []).map(
      (row: {
        vendor_name: string;
        average_price: number | string | null;
        transaction_count:
          | number
          | string
          | null;
      }) => ({
        vendor_name: row.vendor_name,
        average_price: Number(
          row.average_price ?? 0
        ),
        transaction_count: Number(
          row.transaction_count ?? 0
        ),
      })
    );
  }

  async getPriceDistribution(
  startDate: string,
  endDate: string,
  vendors: string[],
  items: string[],
  bins = 10
): Promise<ItemPriceDistribution[]> {
  const { data, error } =
    await supabaseAdmin.rpc(
      "get_item_price_distribution",
      {
        p_start_date: startDate,
        p_end_date: endDate,
        p_vendors: vendors,
        p_items: items,
        p_bins: bins,
      }
    );

  if (error) {
    throw new Error(
      `Failed to fetch item price distribution: ${error.message}`
    );
  }

  return (data ?? []).map(
    (row: {
      range_start: number | string;
      range_end: number | string;
      transaction_count: number | string;
    }) => ({
      range_start: Number(row.range_start),
      range_end: Number(row.range_end),
      transaction_count: Number(
        row.transaction_count
      ),
    })
  );
}

  async getPriceHistory(
    filters: ItemPriceAnalysisFilters,
    limit = 100
  ): Promise<ItemPriceHistory[]> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_price_history",
        {
          p_start_date: startDate,
          p_end_date: endDate,
          p_vendors: filters.vendors ?? [],
          p_items: filters.items ?? [],
          p_limit: limit,
        }
      );

    if (error) {
      throw new Error(
        `Failed to load item price history: ${error.message}`
      );
    }

    return (data ?? []).map(
      (row: {
        order_date: string;
        item_name: string;
        vendor_name: string;
        uom: string;
        unit_price: number | string | null;
        qty: number | string | null;
        total_price: number | string | null;
      }) => ({
        order_date: row.order_date,
        item_name: row.item_name,
        vendor_name: row.vendor_name,
        uom: row.uom,
        unit_price: Number(
          row.unit_price ?? 0
        ),
        qty: Number(row.qty ?? 0),
        total_price: Number(
          row.total_price ?? 0
        ),
      })
    );
  }
}

export const itemPriceAnalysisRepository =
  new ItemPriceAnalysisRepository();