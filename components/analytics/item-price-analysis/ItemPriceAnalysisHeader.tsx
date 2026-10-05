import { DollarSign } from "lucide-react";

export default function ItemPriceAnalysisHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <DollarSign className="h-5 w-5" strokeWidth={2} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Price Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Analisis harga pembelian item dan perbandingan harga antar vendor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}