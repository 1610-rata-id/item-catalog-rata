import { MonthlySpend } from "@/types/monthly-spend";

import DashboardCard from "../shared/DashboardCard";
import SectionHeader from "../shared/SectionHeader";
import MonthlySpendChart from "../charts/MonthlySpendChart";

interface MonthlySpendCardProps {
  monthlySpend: MonthlySpend[];
}

export default function MonthlySpendCard({
  monthlySpend,
}: MonthlySpendCardProps) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Monthly Spend"
        description="Monthly procurement spending."
      />

      <MonthlySpendChart
        monthlySpend={monthlySpend}
      />
    </DashboardCard>
  );
}