"use client";

import { ItemPriceHistory as ItemPriceHistoryData } from "@/types/item-price-analysis";

interface PriceHistoryProps {
  data: ItemPriceHistoryData[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function PriceHistory({
  data,
}: PriceHistoryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Price History
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Riwayat harga pembelian item berdasarkan transaksi terbaru.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[240px] items-center justify-center px-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tidak ada riwayat harga untuk periode yang dipilih.
          </p>
        </div>
      ) : (
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-[1050px] w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                  Date
                </th>

                <th className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                  Item
                </th>

                <th className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                  Vendor
                </th>

                <th className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                  UOM
                </th>

                <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
                  Unit Price
                </th>

                <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
                  Qty
                </th>

                <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
                  Total Price
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr
                  key={`${row.order_date}-${row.item_name}-${row.vendor_name}-${index}`}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-900 dark:hover:bg-slate-900/60"
                >
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    {formatDate(row.order_date)}
                  </td>

                  <td className="max-w-[260px] truncate px-6 py-3.5 font-medium text-slate-900 dark:text-white">
                    {row.item_name || "-"}
                  </td>

                  <td className="max-w-[240px] truncate px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    {row.vendor_name || "-"}
                  </td>

                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    {row.uom || "-"}
                  </td>

                  <td className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-slate-900 dark:text-white">
                    {formatCurrency(row.unit_price)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-3.5 text-right text-slate-600 dark:text-slate-300">
                    {formatNumber(row.qty)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-slate-900 dark:text-white">
                    {formatCurrency(row.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}