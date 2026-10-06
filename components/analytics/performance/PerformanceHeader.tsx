interface PerformanceHeaderProps {
  year: number;
}

export default function PerformanceHeader({
  year,
}: PerformanceHeaderProps) {
  return (
    <div className="mb-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Vendor Performance
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Overview of vendor procurement activity and risk for {year}.
      </p>
    </div>
  );
}