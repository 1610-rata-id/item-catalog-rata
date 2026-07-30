import { TopSpendItem } from "@/types/top-spend-item";

import DashboardCard from "../shared/DashboardCard";
import SectionHeader from "../shared/SectionHeader";
import TopSpendItemsChart from "../charts/TopSpendItemsChart";

interface TopSpendItemsCardProps {
  topSpendItems: TopSpendItem[];
}

export default function TopSpendItemsCard({
  topSpendItems,
}: TopSpendItemsCardProps) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Top 10 Spend Items"
        description="Items with the highest procurement spend."
      />

      <TopSpendItemsChart
  topSpendItems={topSpendItems}
/>
    </DashboardCard>
  );
}