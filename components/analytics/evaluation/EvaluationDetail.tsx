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
    return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (status === "Enough") {
    return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
  }

  return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
}

export default function EvaluationDetail({
  evaluations,
}: EvaluationDetailProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

      <div className="px-6 pb-4 pt-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Vendor Evaluation Detail
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Detailed evaluation results for each vendor by period.
        </p>
      </div>

      <div className="overflow-x-auto px-4 pb-5">
        <table className="w-full min-w-[1100px] border-collapse text-sm">

          <thead>
            <tr className="border-y border-slate-200 bg-blue-50 dark:border-neutral-800 dark:bg-blue-500/10">

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                No
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold text-blue-900 dark:text-blue-300">
                Period
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold text-blue-900 dark:text-blue-300">
                Vendor Name
              </th>

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                Price
              </th>

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                Quality
              </th>

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                Actual Quantity Delivery
              </th>

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                On-Time Delivery
              </th>

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                Final Score
              </th>

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                Status
              </th>

              <th className="px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                Action
              </th>

            </tr>
          </thead>

          <tbody>
            {evaluations.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-16 text-center text-sm text-slate-400"
                >
                  Tidak ada data evaluasi.
                </td>
              </tr>
            ) : (
              evaluations.map(
                (evaluation, index) => (
                  <tr
                    key={evaluation.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-3 py-3 text-center text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {evaluation.period}{" "}
                      {evaluation.year}
                    </td>

                    <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.vendor}
                    </td>

                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.price.toFixed(2)}
                    </td>

                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.quality.toFixed(2)}
                    </td>

                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.actual_quantity_delivery.toFixed(
                        2
                      )}
                    </td>

                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">
                      {evaluation.on_time_delivery.toFixed(
                        2
                      )}
                    </td>

                    <td className="px-3 py-3 text-center font-semibold text-slate-700 dark:text-slate-200">
                      {evaluation.final_score.toFixed(
                        2
                      )}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex min-w-[70px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          evaluation.status
                        )}`}
                      >
                        {evaluation.status}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-center">
                      {evaluation.evaluation_pdf ? (
                        <a
                          href={
                            evaluation.evaluation_pdf
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          <FileText className="h-4 w-4" />
                          Lihat PDF
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Tidak tersedia
                        </span>
                      )}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>

        </table>
      </div>
    </section>
  );
}