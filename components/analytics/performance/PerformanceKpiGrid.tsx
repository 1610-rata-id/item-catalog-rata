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

function SpendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="5"
        y="7"
        width="14"
        height="12"
        rx="2"
      />
      <path d="M8 7V5h8v2" />
      <path d="M9 12h6" />
      <path d="M9 15h4" />
    </svg>
  );
}

function PurchaseOrderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 6h14l-1 11H6L5 6Z" />
      <path d="M9 6a3 3 0 0 1 6 0" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="16" cy="20" r="1" />
    </svg>
  );
}

function VendorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
      />
      <path d="M8 20v-5h8v5" />
      <path d="M8 9h1" />
      <path d="M12 9h1" />
      <path d="M16 9h1" />
    </svg>
  );
}

export default function PerformanceKpiGrid({
  totalSpend,
  purchaseOrders,
  activeVendors,
}: PerformanceKpiGridProps) {
  const cards = [
    {
      label: "Total Spend",
      value: formatFullCurrency(totalSpend),
      icon: <SpendIcon />,
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      label: "Purchase Orders",
      value: formatNumber(purchaseOrders),
      icon: <PurchaseOrderIcon />,
      iconClass:
        "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
    },
    {
      label: "Active Vendors",
      value: formatNumber(activeVendors),
      icon: <VendorIcon />,
      iconClass:
        "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="
            flex
            min-h-[150px]
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-6
            py-5
            shadow-sm
            transition
            hover:shadow-md
            dark:border-neutral-800
            dark:bg-neutral-900
          "
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.label}
            </p>

            <p
              className={`
                mt-3
                truncate
                font-bold
                tracking-tight
                text-slate-900
                dark:text-white
                ${
                  card.label === "Total Spend"
                    ? "text-[24px] lg:text-[26px]"
                    : "text-[28px]"
                }
              `}
              title={card.value}
            >
              {card.value}
            </p>
          </div>

          <div
            className={`
              ml-4
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${card.iconClass}
            `}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}