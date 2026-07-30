import { MonthlySpend } from "@/types/monthly-spend";
import { RecentTransaction } from "@/types/recent-transaction";
import { TopSpendItem } from "@/types/top-spend-item";
import { TopVendor } from "@/types/top-vendor";

import MonthlySpendCard from "./sections/MonthlySpendCard";
import RecentTransactionCard from "./sections/RecentTransactionCard";
import TopSpendItemsCard from "./sections/TopSpendItemsCard";
import TopVendorCard from "./sections/TopVendorCard";

interface DashboardLayoutProps {
  monthlySpend: MonthlySpend[];
  topSpendItems: TopSpendItem[];
  topVendors: TopVendor[];
  recentTransactions: RecentTransaction[];
}

export default function DashboardLayout({
  monthlySpend,
  topSpendItems,
  topVendors,
  recentTransactions,
}: DashboardLayoutProps) {
  return (
    <section className="mt-6 space-y-6">

      {/* Monthly Spend */}
      <div>
        <MonthlySpendCard monthlySpend={monthlySpend} />
      </div>

      {/* Top Items + Top Vendors */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopSpendItemsCard
          topSpendItems={topSpendItems}
        />

        <TopVendorCard
          topVendors={topVendors}
        />
      </div>

      {/* Recent Transactions */}
      <div>
        <RecentTransactionCard
          recentTransactions={recentTransactions}
        />
      </div>

    </section>
  );
}