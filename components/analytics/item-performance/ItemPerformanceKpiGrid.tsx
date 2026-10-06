import {
  Boxes,
  ClipboardList,
  FileText,
  WalletCards,
} from "lucide-react";

import { ItemPerformanceKpi } from "@/types/item-performance";

interface ItemPerformanceKpiGridProps {
  kpi: ItemPerformanceKpi;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function ItemPerformanceKpiGrid({
  kpi,
}: ItemPerformanceKpiGridProps) {
  const cards = [
    {
      title: "Total Spend",
      value: formatCurrency(kpi.total_spend),
      icon: WalletCards,
      cardClass:
        "border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700",
      iconClass:
        "bg-white/15 text-white ring-1 ring-white/20",
    },
    {
      title: "Total Items",
      value: formatNumber(kpi.total_items),
      icon: Boxes,
      cardClass:
        "border-violet-500/20 bg-gradient-to-br from-violet-500 to-indigo-600",
      iconClass:
        "bg-white/15 text-white ring-1 ring-white/20",
    },
    {
      title: "Purchase Orders",
      value: formatNumber(kpi.total_purchase_orders),
      icon: ClipboardList,
      cardClass:
        "border-emerald-500/20 bg-gradient-to-br from-teal-400 to-emerald-500",
      iconClass:
        "bg-white/15 text-white ring-1 ring-white/20",
    },
    {
      title: "Purchase Requests",
      value: formatNumber(kpi.total_purchase_requests),
      icon: FileText,
      cardClass:
        "border-amber-500/20 bg-gradient-to-br from-amber-400 to-orange-500",
      iconClass:
        "bg-white/15 text-white ring-1 ring-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`relative min-h-[150px] overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${card.cardClass}`}
          >
            <div className="flex h-full flex-col justify-between pr-20">
              <p className="text-base font-semibold text-white">
                {card.title}
              </p>

              <p
                className={`font-semibold tracking-tight text-white ${
                  card.title === "Total Spend"
                    ? "text-2xl"
                    : "text-3xl"
                }`}
              >
                {card.value}
              </p>
            </div>

            <div
              className={`absolute right-6 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl ${card.iconClass}`}
            >
              <Icon
                className="h-8 w-8"
                strokeWidth={2}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}