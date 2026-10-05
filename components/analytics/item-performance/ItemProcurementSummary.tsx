"use client";

import { ItemProcurementSummary as ItemProcurementSummaryType } from "@/types/item-performance";

interface ItemProcurementSummaryProps {
  items: ItemProcurementSummaryType[];
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

export default function ItemProcurementSummary({
  items,
}: ItemProcurementSummaryProps) {
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
          Item Procurement Summary
        </h2>

        <p
          className="mt-1 text-sm text-slate-500"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Procurement activity summarized by item and vendor.
        </p>
      </div>

      {/* TABLE */}
      {items.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-slate-500">
            No procurement data available for the selected filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Item
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Vendor
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    UOM
                  </th>

                  <th className="px-4 py-3 text-right font-semibold text-slate-600">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right font-semibold text-slate-600">
                    PO
                  </th>

                  <th className="px-4 py-3 text-right font-semibold text-slate-600">
                    Total Spend
                  </th>

                  <th className="px-4 py-3 text-right font-semibold text-slate-600">
                    Avg. Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={`${item.item_name}-${item.vendor_name}-${item.uom}-${index}`}
                    className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50"
                  >
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

                    <td className="px-4 py-3 text-slate-600">
                      {item.uom || "-"}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {formatNumber(item.total_qty)}
                    </td>

                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatNumber(
                        item.total_purchase_orders
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-900">
                      {formatCurrency(item.total_spend)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-600">
                      {formatCurrency(item.average_price)}
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