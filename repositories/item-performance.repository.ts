import { supabaseAdmin } from "@/lib/supabase-admin";

import {
  ItemPerformanceKpi,
  ItemTopSpend,
  ItemProcurementSummary,
  ItemTransactionHistory,
} from "@/types/item-performance";

export interface ItemPerformanceFilters {
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

  const sortedMonths = [...months].sort((a, b) => a - b);

  const startMonth = sortedMonths[0];
  const endMonth = sortedMonths[sortedMonths.length - 1];

  const startDate = `${year}-${String(startMonth).padStart(
    2,
    "0"
  )}-01`;

  const lastDay = new Date(
    Date.UTC(year, endMonth, 0)
  ).getUTCDate();

  const endDate = `${year}-${String(endMonth).padStart(
    2,
    "0"
  )}-${String(lastDay).padStart(2, "0")}`;

  return {
    startDate,
    endDate,
  };
}

export class ItemPerformanceRepository {
  private getRange(filters: ItemPerformanceFilters) {
    return buildDateRange(
      filters.year,
      filters.months ?? []
    );
  }

  async getKpi(
    filters: ItemPerformanceFilters
  ): Promise<ItemPerformanceKpi> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_performance_kpi",
        {
          p_start_date: startDate,
          p_end_date: endDate,
          p_vendors: filters.vendors ?? [],
          p_items: filters.items ?? [],
        }
      );

    if (error) {
      throw new Error(
        `Failed to load item performance KPI: ${error.message}`
      );
    }

    const row = data?.[0];

    return {
      total_spend: Number(
        row?.total_spend ?? 0
      ),
      total_items: Number(
        row?.total_items ?? 0
      ),
      total_purchase_orders: Number(
        row?.total_purchase_orders ?? 0
      ),
    };
  }

  async getTopSpend(
    filters: ItemPerformanceFilters,
    limit = 10
  ): Promise<ItemTopSpend[]> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_top_spend",
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
        `Failed to load top item spend: ${error.message}`
      );
    }

    return (data ?? []).map(
      (row: {
        item_name: string;
        total_spend: number | string | null;
        total_qty: number | string | null;
        total_purchase_orders:
          | number
          | string
          | null;
        transaction_count:
          | number
          | string
          | null;
      }) => ({
        item_name: row.item_name,
        total_spend: Number(
          row.total_spend ?? 0
        ),
        total_qty: Number(
          row.total_qty ?? 0
        ),
        total_purchase_orders: Number(
          row.total_purchase_orders ?? 0
        ),
        transaction_count: Number(
          row.transaction_count ?? 0
        ),
      })
    );
  }

  async getProcurementSummary(
    filters: ItemPerformanceFilters,
    limit = 1000
  ): Promise<ItemProcurementSummary[]> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_procurement_summary",
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
        `Failed to load item procurement summary: ${error.message}`
      );
    }

    return (data ?? []).map(
      (row: {
        item_name: string;
        vendor_name: string;
        uom: string;
        total_qty: number | string | null;
        total_purchase_orders:
          | number
          | string
          | null;
        total_spend: number | string | null;
        average_price: number | string | null;
      }) => ({
        item_name: row.item_name,
        vendor_name: row.vendor_name,
        uom: row.uom,
        total_qty: Number(
          row.total_qty ?? 0
        ),
        total_purchase_orders: Number(
          row.total_purchase_orders ?? 0
        ),
        total_spend: Number(
          row.total_spend ?? 0
        ),
        average_price: Number(
          row.average_price ?? 0
        ),
      })
    );
  }

  async getTransactionHistory(
    filters: ItemPerformanceFilters,
    limit = 100
  ): Promise<ItemTransactionHistory[]> {
    const { startDate, endDate } =
      this.getRange(filters);

    const { data, error } =
      await supabaseAdmin.rpc(
        "get_item_transaction_history",
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
        `Failed to load item transaction history: ${error.message}`
      );
    }

    return (data ?? []).map(
      (row: {
        order_date: string;
        item_name: string;
        vendor_name: string;
        pr_number: string | null;
        po_number: string | null;
        qty: number | string | null;
        uom: string;
        unit_price: number | string | null;
        total_price: number | string | null;
      }) => ({
        order_date: row.order_date,
        item_name: row.item_name,
        vendor_name: row.vendor_name,
        pr_number: row.pr_number ?? null,
        po_number: row.po_number ?? null,
        qty: Number(row.qty ?? 0),
        uom: row.uom,
        unit_price: Number(
          row.unit_price ?? 0
        ),
        total_price: Number(
          row.total_price ?? 0
        ),
      })
    );
  }
}

export const itemPerformanceRepository =
  new ItemPerformanceRepository();