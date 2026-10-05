import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
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
      icon: CircleDollarSign,
      cardClass:
        "border-blue-100 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/20",
      iconClass:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400",
    },
    {
      title: "Highest Price",
      value: formatCurrency(kpi.highest_price),
      icon: ArrowUpCircle,
      cardClass:
        "border-violet-100 bg-violet-50/70 dark:border-violet-900/50 dark:bg-violet-950/20",
      iconClass:
        "bg-violet-100 text-violet-600 dark:bg-violet-900/60 dark:text-violet-400",
    },
    {
      title: "Lowest Price",
      value: formatCurrency(kpi.lowest_price),
      icon: ArrowDownCircle,
      cardClass:
        "border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20",
      iconClass:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-2xl border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${card.cardClass}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {card.title}
              </p>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              </div>
            </div>

            <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}