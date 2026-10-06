import {
  Building2,
  ClipboardList,
  WalletCards,
} from "lucide-react";

interface PerformanceKpiGridProps {
  totalSpend: number;
  purchaseOrders: number;
  activeVendors: number;
}

function formatFullCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "Rp 0";
  }

  return `Rp ${value.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  })}`;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  });
}

export default function PerformanceKpiGrid({
  totalSpend,
  purchaseOrders,
  activeVendors,
}: PerformanceKpiGridProps) {
  const cards = [
    {
      title: "Total Spend",
      value: formatFullCurrency(totalSpend),
      icon: WalletCards,
      cardClass:
        "border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700",
    },
    {
      title: "Purchase Orders",
      value: formatNumber(purchaseOrders),
      icon: ClipboardList,
      cardClass:
        "border-emerald-500/20 bg-gradient-to-br from-teal-400 to-emerald-500",
    },
    {
      title: "Active Vendors",
      value: formatNumber(activeVendors),
      icon: Building2,
      cardClass:
        "border-violet-500/20 bg-gradient-to-br from-violet-500 to-indigo-600",
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

            <div className="absolute right-6 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <Icon className="h-8 w-8" strokeWidth={2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}