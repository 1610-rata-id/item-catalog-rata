export interface ItemAbcAnalysis {
  rank: number;
  item_name: string;
  total_spend: number;
  spend_percentage: number;
  cumulative_percentage: number;
  abc_class: "A" | "B" | "C";
}

export interface ItemAbcKpi {
  class_a_items: number;
  class_b_items: number;
  class_c_items: number;
  total_spend: number;
}