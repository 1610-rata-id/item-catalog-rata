interface EvaluationKpiGridProps {
  price: number;
  quality: number;
  actualQuantityDelivery: number;
  onTimeDelivery: number;
}

function ScoreCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">

        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {label}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value.toFixed(2)}
            </span>

            <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
              / 3.00
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-400">
            Evaluation score
          </div>
        </div>
      </div>
    </div>
  );
}

function CoinsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3l8 3v6c0 4.8-3.3 8-8 9-4.7-1-8-4.2-8-9V6l8-3Z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M4 7.5l8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function EvaluationKpiGrid({
  price,
  quality,
  actualQuantityDelivery,
  onTimeDelivery,
}: EvaluationKpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

      <ScoreCard
        label="Price"
        value={price}
        icon={<CoinsIcon />}
        iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      />

      <ScoreCard
        label="Quality"
        value={quality}
        icon={<ShieldIcon />}
        iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      />

      <ScoreCard
        label="Actual Quantity Delivery"
        value={actualQuantityDelivery}
        icon={<BoxIcon />}
        iconClass="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
      />

      <ScoreCard
        label="On-Time Delivery"
        value={onTimeDelivery}
        icon={<ClockIcon />}
        iconClass="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
      />
    </div>
  );
}