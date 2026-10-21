
"use client";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeDollarSign,
  FileCheck,
  ReceiptText,
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function ItemPriceKpiGrid({
  kpi,
}: ItemPriceKpiGridProps) {
  const cards = [
    {
      title: "Average Price",
      value: formatCurrency(kpi.average_price),
      subtitle: "Current average unit price",
      icon: BadgeDollarSign,
      cardClass:
        "border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700",
    },
    {
      title: "Highest Price",
      value: formatCurrency(kpi.highest_price),
      subtitle: "After PPN",
      icon: ArrowUpCircle,
      cardClass:
        "border-violet-500/20 bg-gradient-to-br from-violet-500 to-indigo-600",
    },
    {
      title: "Lowest Price",
      value: formatCurrency(kpi.lowest_price),
      subtitle: "After PPN",
      icon: ArrowDownCircle,
      cardClass:
        "border-emerald-500/20 bg-gradient-to-br from-teal-400 to-emerald-500",
    },
    {
      title: "Total PO",
      value: formatNumber(kpi.total_po),
      subtitle: "Unique purchase orders",
      icon: FileCheck,
      cardClass:
        "border-purple-500/20 bg-gradient-to-br from-purple-600 to-fuchsia-700",
    },
    {
      title: "Total Transactions",
      value: formatNumber(kpi.transaction_count),
      subtitle: "Transaction rows",
      icon: ReceiptText,
      cardClass:
        "border-amber-500/20 bg-gradient-to-br from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`relative min-h-[160px] overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${card.cardClass}`}
          >
            <div className="flex h-full min-w-0 flex-col justify-between gap-4 pr-12">
              <div>
                <p className="text-sm font-semibold text-white">
                  {card.title}
                </p>

                <p className="mt-1 text-xs text-white/75">
                  {card.subtitle}
                </p>
              </div>

              <p
                className="break-words text-xl font-semibold tracking-tight text-white"
                title={card.value}
              >
                {card.value}
              </p>
            </div>

            <div className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
