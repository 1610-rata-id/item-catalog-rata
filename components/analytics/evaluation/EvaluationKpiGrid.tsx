import {
  BadgeDollarSign,
  ShieldCheck,
  PackageCheck,
  Clock3,
} from "lucide-react";

interface EvaluationKpiGridProps {
  price: number;
  quality: number;
  actualQuantityDelivery: number;
  onTimeDelivery: number;
}

interface ScoreCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

function ScoreCard({
  title,
  value,
  icon,
  gradient,
}: ScoreCardProps) {
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
            {value.toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-white/80">
            Evaluation score / 3.00
          </p>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          {icon}
        </div>
      </div>
    </div>
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
        title="Price"
        value={price}
        gradient="from-blue-600 to-indigo-600"
        icon={
          <BadgeDollarSign className="h-8 w-8 text-white" />
        }
      />

      <ScoreCard
        title="Quality"
        value={quality}
        gradient="from-violet-600 to-indigo-600"
        icon={
          <ShieldCheck className="h-8 w-8 text-white" />
        }
      />

      <ScoreCard
        title="Actual Quantity Delivery"
        value={actualQuantityDelivery}
        gradient="from-teal-600 to-emerald-600"
        icon={
          <PackageCheck className="h-8 w-8 text-white" />
        }
      />

      <ScoreCard
        title="On-Time Delivery"
        value={onTimeDelivery}
        gradient="from-amber-500 to-orange-600"
        icon={
          <Clock3 className="h-8 w-8 text-white" />
        }
      />
    </div>
  );
}