import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProcurementRecord } from "@/etl/types/procurement";

export class ProcurementRepository {
  async getExistingSubPrIds(
    subPrIds: string[]
  ): Promise<Set<string>> {
    const existing = new Set<string>();

    if (subPrIds.length === 0) {
      return existing;
    }

    const BATCH_SIZE = 1000;

    for (
      let offset = 0;
      ;
      offset += BATCH_SIZE
    ) {
      const { data, error } = await supabaseAdmin
        .from("procurement_transactions")
        .select("sub_pr_id")
        .not("sub_pr_id", "is", null)
        .range(
          offset,
          offset + BATCH_SIZE - 1
        );

      if (error) {
        throw new Error(
          `Failed to fetch existing sub_pr_id: ${error.message}`
        );
      }

      const rows = data ?? [];

      for (const row of rows) {
        if (row.sub_pr_id) {
          existing.add(row.sub_pr_id);
        }
      }

      if (rows.length < BATCH_SIZE) {
        break;
      }
    }

    return existing;
  }

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

  // ==========================
  // ETL Sync Status
  // ==========================
  async updateLastSuccessfulSync(syncDate: Date) {
    const { error } = await supabaseAdmin
      .from("etl_sync_status")
      .upsert(
        {
          id: 1,
          last_successful_sync: syncDate.toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    if (error) {
      throw new Error(
        `Failed to update ETL sync status: ${error.message}`
      );
    }
  }
}

export const procurementRepository =
  new ProcurementRepository();