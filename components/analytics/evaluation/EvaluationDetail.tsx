import {
  ExternalLink,
  FileText,
} from "lucide-react";

interface EvaluationRow {
  id: number;
  category: string;
  period: string;
  year: number;
  vendor: string;
  price: number;
  quality: number;
  actual_quantity_delivery: number;
  on_time_delivery: number;
  final_score: number;
  status: "Good" | "Enough" | "Bad";
  evaluation_pdf: string | null;
}

interface EvaluationDetailProps {
  evaluations: EvaluationRow[];
}

function statusClass(
  status: EvaluationRow["status"]
) {
  if (status === "Good") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (status === "Enough") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  }

  return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
}

export default function EvaluationDetail({
  evaluations,
}: EvaluationDetailProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Vendor Evaluation Detail
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Detailed evaluation results for each vendor by period.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800">
        <div className="max-h-[570px] overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[1150px] border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#1D63B3]">
                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  No
                </th>

                <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                  Period
                </th>

                <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                  Vendor Name
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  Price
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  Quality
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  Actual Quantity Delivery
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  On-Time Delivery
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  Final Score
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  Status
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {evaluations.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-16 text-center"
                  >
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      No evaluation data available.
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Try adjusting your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                evaluations.map((evaluation, index) => (
                  <tr
                    key={evaluation.id}
                    className="h-[52px] border-b border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-white/[0.03]"
                  >
                    {/* No */}
                    <td className="px-4 text-center text-slate-500 dark:text-slate-400">
                      {index + 1}
                    </td>

                    {/* Period */}
                    <td className="whitespace-nowrap px-4 text-slate-600 dark:text-slate-300">
                      {evaluation.period} {evaluation.year}
                    </td>

                    {/* Vendor */}
                    <td className="px-4 font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.vendor}
                    </td>

                    {/* Price */}
                    <td className="px-4 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.price.toFixed(2)}
                    </td>

                    {/* Quality */}
                    <td className="px-4 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.quality.toFixed(2)}
                    </td>

                    {/* Actual Quantity Delivery */}
                    <td className="px-4 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.actual_quantity_delivery.toFixed(2)}
                    </td>

                    {/* On-Time Delivery */}
                    <td className="px-4 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.on_time_delivery.toFixed(2)}
                    </td>

                    {/* Final Score */}
                    <td className="px-4 text-center font-semibold text-slate-800 dark:text-slate-100">
                      {evaluation.final_score.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="px-4 text-center">
                      <span
                        className={`inline-flex min-w-[70px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          evaluation.status
                        )}`}
                      >
                        {evaluation.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 text-center">
                      {evaluation.evaluation_pdf ? (
                        <a
                          href={evaluation.evaluation_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-[#1D63B3] transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FileText className="h-4 w-4" />
                          View PDF
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Not available
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}