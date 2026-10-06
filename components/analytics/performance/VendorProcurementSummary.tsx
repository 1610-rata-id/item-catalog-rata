"use client";

import { ClipboardList } from "lucide-react";

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
    return `Rp ${(number / 1_000_000_000).toLocaleString(
      "id-ID",
      {
        maximumFractionDigits: 1,
      }
    )} M`;
  }

  if (Math.abs(number) >= 1_000_000) {
    return `Rp ${(number / 1_000_000).toLocaleString(
      "id-ID",
      {
        maximumFractionDigits: 1,
      }
    )} jt`;
  }

  return `Rp ${number.toLocaleString("id-ID")}`;
}

export default function VendorProcurementSummary({
  vendors,
}: VendorProcurementSummaryProps) {
  return (
    <section className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">

      {/* HEADER */}

      <div className="shrink-0 px-6 pb-4 pt-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <ClipboardList className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Vendor Procurement Summary
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Procurement spending and order summary by vendor.
            </p>
          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="min-h-0 flex-1 overflow-hidden px-6 pb-6">

        <div
          className="
            flex
            h-full
            min-h-0
            flex-col
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            dark:border-slate-800
          "
        >

          {/* TABLE HEADER */}

          <div className="shrink-0 overflow-hidden rounded-t-xl bg-[#1D63B3]">

            <table className="w-full min-w-[560px] border-collapse text-sm">

              <thead>

                <tr className="border-b border-[#174F8F]">

                  <th
                    className="
                      w-14
                      border-r
                      border-[#4A83C2]
                      px-3
                      py-4
                      text-center
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    No
                  </th>

                  <th
                    className="
                      border-r
                      border-[#4A83C2]
                      px-4
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    Vendor
                  </th>

                  <th
                    className="
                      w-36
                      border-r
                      border-[#4A83C2]
                      px-4
                      py-4
                      text-center
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    Purchase Orders
                  </th>

                  <th
                    className="
                      w-40
                      px-4
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    Total Spend
                  </th>

                </tr>

              </thead>

            </table>

          </div>

          {/* SCROLLABLE TABLE BODY */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto

              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-slate-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-[#1D63B3]/70
              [&::-webkit-scrollbar-thumb:hover]:bg-[#1D63B3]

              dark:[&::-webkit-scrollbar-track]:bg-slate-900
              dark:[&::-webkit-scrollbar-thumb]:bg-[#1D63B3]/80
              dark:[&::-webkit-scrollbar-thumb:hover]:bg-[#1D63B3]
            "
          >

            <table className="w-full min-w-[560px] border-collapse text-sm">

              <tbody>

                {vendors.length === 0 ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="
                        py-16
                        text-center
                        text-sm
                        text-slate-400
                      "
                    >
                      No procurement data available.
                    </td>

                  </tr>

                ) : (

                  vendors.map((vendor, index) => (

                    <tr
                      key={`${vendor.vendor_name}-${index}`}
                      className="
                        border-b
                        border-slate-200
                        transition-colors
                        hover:bg-blue-50/40
                        dark:border-slate-800
                        dark:hover:bg-blue-500/[0.04]
                      "
                    >

                      {/* NO */}

                      <td
                        className="
                          w-14
                          border-r
                          border-slate-200
                          px-3
                          py-4
                          text-center
                          text-slate-500
                          dark:border-slate-800
                          dark:text-slate-400
                        "
                      >
                        {index + 1}
                      </td>

                      {/* VENDOR */}

                      <td
                        className="
                          border-r
                          border-slate-200
                          px-4
                          py-4
                          font-medium
                          text-slate-700
                          dark:border-slate-800
                          dark:text-slate-200
                        "
                      >
                        {vendor.vendor_name}
                      </td>

                      {/* PURCHASE ORDERS */}

                      <td
                        className="
                          w-36
                          border-r
                          border-slate-200
                          px-4
                          py-4
                          text-center
                          font-medium
                          text-slate-700
                          dark:border-slate-800
                          dark:text-slate-300
                        "
                      >
                        {Number(
                          vendor.total_purchase_orders
                        ).toLocaleString("id-ID")}
                      </td>

                      {/* TOTAL SPEND */}

                      <td
                        className="
                          w-40
                          px-4
                          py-4
                          text-right
                          font-semibold
                          text-slate-800
                          dark:text-slate-200
                        "
                      >
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

      </div>

    </section>
  );
}