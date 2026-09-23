interface VendorProcurementRow {
  vendor_name: string;
  total_spend: number | string;
  total_purchase_orders: number | string;
}

interface VendorProcurementSummaryProps {
  vendors: VendorProcurementRow[];
}

function formatCurrency(value: number | string) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "Rp 0";
  }

  if (Math.abs(number) >= 1_000_000_000) {
    return `Rp ${(number / 1_000_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} M`;
  }

  if (Math.abs(number) >= 1_000_000) {
    return `Rp ${(number / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} jt`;
  }

  return `Rp ${number.toLocaleString("id-ID")}`;
}

export default function VendorProcurementSummary({
  vendors,
}: VendorProcurementSummaryProps) {
  return (
    <section className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

      {/* HEADER */}

      <div className="shrink-0 px-5 pb-4 pt-5">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21h18" />
              <path d="M5 21V8l7-4 7 4v13" />
              <path d="M9 21v-5h6v5" />
              <path d="M8 10h1" />
              <path d="M12 10h1" />
              <path d="M16 10h1" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Vendor Procurement Summary
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ringkasan aktivitas procurement berdasarkan vendor
            </p>
          </div>

        </div>
      </div>

      {/* TABLE */}

      <div className="min-h-0 flex-1 overflow-hidden px-5 pb-5">
        <div className="h-full overflow-y-auto rounded-xl border border-slate-200 dark:border-neutral-800">

          <table className="w-full min-w-[560px] border-collapse text-sm">

            <thead className="sticky top-0 z-10 bg-blue-50 dark:bg-blue-950/40">
              <tr className="border-b border-slate-200 dark:border-neutral-800">

                <th className="w-14 px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                  No
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Nama Vendor
                </th>

                <th className="w-28 px-4 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Total PO
                </th>

                <th className="w-36 px-4 py-3 text-right text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Total Value
                </th>

              </tr>
            </thead>

            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Tidak ada data procurement.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor, index) => (
                  <tr
                    key={`${vendor.vendor_name}-${index}`}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-3 py-3 text-center text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                      {vendor.vendor_name}
                    </td>

                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                      {Number(
                        vendor.total_purchase_orders
                      ).toLocaleString("id-ID")}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-200">
                      {formatCurrency(
                        vendor.total_spend
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