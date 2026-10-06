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

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

function KpiCard({
  title,
  value,
  icon,
  gradient,
}: KpiCardProps) {
  return (
    <div
      className={`group min-h-[150px] rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-white">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight">
            {value.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DocumentsKpiGrid({
  totalVendors,
  activeContracts,
  completeDocuments,
}: DocumentsKpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <KpiCard
        title="Vendor Active"
        value={totalVendors}
        gradient="from-blue-600 to-indigo-600"
        icon={
          <UsersRound className="h-8 w-8 text-white" />
        }
      />

      <KpiCard
        title="Contract Active"
        value={activeContracts}
        gradient="from-teal-600 to-emerald-600"
        icon={
          <FileCheck2 className="h-8 w-8 text-white" />
        }
      />

      <KpiCard
        title="Document Lengkap"
        value={completeDocuments}
        gradient="from-violet-600 to-indigo-600"
        icon={
          <FileText className="h-8 w-8 text-white" />
        }
      />
    </div>
  );
}