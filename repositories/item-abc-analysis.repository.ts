import { supabaseAdmin } from "@/lib/supabase-admin";
import { ItemAbcAnalysis } from "@/types/item-abc-analysis";

const PAGE_SIZE = 1000;

export class ItemAbcAnalysisRepository {
  async getAnalysis(
    startDate: string,
    endDate: string
  ): Promise<ItemAbcAnalysis[]> {
    const allItems: ItemAbcAnalysis[] = [];

    let offset = 0;

    while (true) {
      const { data, error } = await supabaseAdmin
        .rpc("get_item_abc_analysis", {
          p_start_date: startDate,
          p_end_date: endDate,
        })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        throw new Error(
          `Failed to load item ABC analysis: ${error.message}`
        );
      }

      const items = (data ?? []) as ItemAbcAnalysis[];

      allItems.push(...items);

      if (items.length < PAGE_SIZE) {
        break;
      }

      offset += PAGE_SIZE;
    }

    return allItems;
  }
}

export const itemAbcAnalysisRepository =
  new ItemAbcAnalysisRepository();