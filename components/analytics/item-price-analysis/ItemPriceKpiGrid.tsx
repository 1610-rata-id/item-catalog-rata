import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeDollarSign,
} from "lucide-react";

import { ItemPriceKpi } from "@/types/item-price-analysis";

interface ItemPriceKpiGridProps {
  kpi: ItemPriceKpi;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ItemPriceKpiGrid({
  kpi,
}: ItemPriceKpiGridProps) {
  const cards = [
    {
      title: "Average Price",
      value: formatCurrency(kpi.average_price),
      icon: BadgeDollarSign,
      cardClass:
        "border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700",
    },
    {
      title: "Highest Price",
      value: formatCurrency(kpi.highest_price),
      icon: ArrowUpCircle,
      cardClass:
        "border-violet-500/20 bg-gradient-to-br from-violet-500 to-indigo-600",
    },
    {
      title: "Lowest Price",
      value: formatCurrency(kpi.lowest_price),
      icon: ArrowDownCircle,
      cardClass:
        "border-emerald-500/20 bg-gradient-to-br from-teal-400 to-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`relative min-h-[150px] overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${card.cardClass}`}
          >
            {/* TEXT */}
            <div className="flex h-full flex-col justify-between pr-20">
              <p className="text-base font-semibold text-white">
                {card.title}
              </p>

              <p className="text-2xl font-semibold tracking-tight text-white">
                {card.value}
              </p>
            </div>

            {/* ICON */}
            <div className="absolute right-6 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
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