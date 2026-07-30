import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProcurementRecord } from "@/etl/types/procurement";

export class ProcurementRepository {
  async upsert(records: ProcurementRecord[]) {
    if (records.length === 0) {
      return;
    }

    const { error } = await supabaseAdmin
      .from("procurement_transactions")
      .upsert(records, {
        onConflict: "sub_pr_id",
      });

    if (error) {
      throw error;
    }
  }
}

export const procurementRepository = new ProcurementRepository();