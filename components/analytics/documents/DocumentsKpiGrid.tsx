import {
  FileCheck2,
  FileText,
  UsersRound,
} from "lucide-react";

interface DocumentsKpiGridProps {
  totalVendors: number;
  activeContracts: number;
  completeDocuments: number;
}

export default function DocumentsKpiGrid({
  totalVendors,
  activeContracts,
  completeDocuments,
}: DocumentsKpiGridProps) {
  const cards = [
    {
      label: "Vendor Active",
      value: totalVendors,
      icon: UsersRound,
      iconClass:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      label: "Contract Active",
      value: activeContracts,
      icon: FileCheck2,
      iconClass:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      label: "Document Lengkap",
      value: completeDocuments,
      icon: FileText,
      iconClass:
        "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="w-full rounded-xl border bg-card p-4 shadow-sm sm:w-[260px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {card.value.toLocaleString("id-ID")}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}