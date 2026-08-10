import { DashboardOverview } from "@/types/dashboard-overview";

import KpiCard from "./cards/KpiCard";

import {
  formatCompactCurrency,
  formatNumber,
} from "@/lib/format";

import {
  Wallet,
  Receipt,
  ShoppingCart,
  Building2,
  FileText,
} from "lucide-react";

interface KpiGridProps {
  overview: DashboardOverview;
}

export default function KpiGrid({
  overview,
}: KpiGridProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">

      <KpiCard
  title="Total Spend"
  value={formatCompactCurrency(
    Number(overview.total_spend)
  )}
  icon={Wallet}
  iconBg="bg-blue-600"
  growth={overview.total_spend_growth}
  comparisonLabel={overview.comparison_label}
/>

      <KpiCard
  title="Transactions"
  value={formatNumber(
    overview.total_transactions
  )}
  icon={Receipt}
  iconBg="bg-emerald-600"
  growth={overview.total_transactions_growth}
  comparisonLabel={overview.comparison_label}
/>

      <KpiCard
  title="Purchase Orders"
  value={formatNumber(
    overview.total_purchase_orders
  )}
  icon={ShoppingCart}
  iconBg="bg-cyan-600"
  growth={overview.total_purchase_orders_growth}
  comparisonLabel={overview.comparison_label}
/>

      <KpiCard
  title="Purchase Requests"
  value={formatNumber(
    overview.total_purchase_requests
  )}
  icon={FileText}
  iconBg="bg-orange-500"
  growth={overview.total_purchase_requests_growth}
  comparisonLabel={overview.comparison_label}
/>

      <KpiCard
  title="Active Vendors"
  value={formatNumber(
    overview.total_vendors
  )}
  icon={Building2}
  iconBg="bg-violet-600"
  comparisonLabel={overview.comparison_label}
/>

    </section>
  );
}