import { supabaseAdmin } from "@/lib/supabase-admin";

export class AnalyticsRepository {
  /**
   * KPI Overview
   */
  async getOverview() {
    const { data, error } = await supabaseAdmin.rpc(
      "get_procurement_overview"
    );

    if (error) {
      throw error;
    }

    return data[0];
  }

  /**
   * Vendor Performance
   */
  async getVendorPerformance() {
    const { data, error } = await supabaseAdmin.rpc(
      "get_vendor_performance"
    );

    if (error) {
      throw error;
    }

    return data;
  }
}

export const analyticsRepository = new AnalyticsRepository();