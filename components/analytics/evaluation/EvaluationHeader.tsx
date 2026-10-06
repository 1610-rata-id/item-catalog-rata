interface EvaluationHeaderProps {
  year: number;
}

export default function EvaluationHeader({
  year,
}: EvaluationHeaderProps) {
  return (
    <div className="mb-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Vendor Evaluation
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Evaluate and monitor vendor performance based on evaluation criteria for{" "}
        {year}.
      </p>
    </div>
  );
}