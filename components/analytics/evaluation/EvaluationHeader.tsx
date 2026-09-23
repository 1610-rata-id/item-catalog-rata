import { CalendarDays } from "lucide-react";

interface EvaluationHeaderProps {
  year: number;
}

export default function EvaluationHeader({
  year,
}: EvaluationHeaderProps) {
  const today = new Date().toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="mb-1 text-sm font-medium text-violet-600 dark:text-violet-400">
          Vendor Analytics
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Vendor Evaluation
        </h1>

        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          Evaluate and monitor vendor performance based on evaluation criteria.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-400">
        <CalendarDays className="h-4 w-4" />
        <span>{today}</span>
      </div>
    </header>
  );
}