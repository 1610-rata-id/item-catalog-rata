import { RecentTransaction } from "@/types/recent-transaction";

import DashboardCard from "../shared/DashboardCard";
import SectionHeader from "../shared/SectionHeader";
import RecentTransactionTable from "../tables/RecentTransactionTable";

interface RecentTransactionCardProps {
  recentTransactions: RecentTransaction[];
}

export default function RecentTransactionCard({
  recentTransactions,
}: RecentTransactionCardProps) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Recent Transactions"
        description="Latest procurement transactions."
      />

      <RecentTransactionTable
        recentTransactions={recentTransactions}
      />
    </DashboardCard>
  );
}