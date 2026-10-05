"use client";

import { ItemTransactionHistory as ItemTransactionHistoryType } from "@/types/item-performance";

interface ItemTransactionHistoryProps {
  items: ItemTransactionHistoryType[];
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ItemTransactionHistory({
  items,
}: ItemTransactionHistoryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-5">
        <h2
          className="text-lg font-semibold tracking-tight text-slate-900"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Transaction History
        </h2>

        <p
          className="mt-1 text-sm text-slate-500"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Recent procurement transactions based on the selected filter.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-slate-500">
            No transaction data available for the selected filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full min-w-[1050px] border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Item
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Vendor
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">
                    PR
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">
                    PO
                  </th>

                  <th className="px-4 py-3 text-right font-semibold text-slate-600">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    UOM
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600">
                    Unit Price
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600">
                    Total Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={`${item.po_number ?? "po"}-${item.item_name}-${index}`}
                    className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(item.order_date)}
                    </td>

                    <td className="max-w-[260px] px-4 py-3">
                      <div
                        className="truncate font-medium text-slate-900"
                        title={item.item_name}
                      >
                        {item.item_name}
                      </div>
                    </td>

                    <td className="max-w-[220px] px-4 py-3">
                      <div
                        className="truncate text-slate-600"
                        title={item.vendor_name}
                      >
                        {item.vendor_name}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {item.pr_number || "-"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                      {item.po_number || "-"}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {formatNumber(item.qty)}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {item.uom || "-"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-600">
                      {formatCurrency(item.unit_price)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-900">
                      {formatCurrency(item.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}