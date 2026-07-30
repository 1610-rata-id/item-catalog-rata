"use client";

import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  formatCompactCurrency,
  formatNumber,
} from "@/lib/format";

import { RecentTransaction } from "@/types/recent-transaction";

interface RecentTransactionTableProps {
  recentTransactions: RecentTransaction[];
}

export default function RecentTransactionTable({
  recentTransactions,
}: RecentTransactionTableProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Recent Transactions
        </CardTitle>

        <CardDescription>
          Latest procurement transactions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="border-b text-left">
                <th className="px-4 py-3 font-semibold text-slate-600">
                  PO
                </th>

                <th className="px-4 py-3 font-semibold text-slate-600">
                  Date
                </th>

                <th className="px-4 py-3 font-semibold text-slate-600">
                  Vendor
                </th>

                <th className="px-4 py-3 font-semibold text-slate-600">
                  Item
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-600">
                  UOM
                </th>

                <th className="px-4 py-3 text-right font-semibold text-slate-600">
                  Qty
                </th>

                <th className="px-4 py-3 text-right font-semibold text-slate-600">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map((transaction, index) => (
                <tr
                  key={`${transaction.po_number}-${transaction.pr_number}-${transaction.item_name}-${index}`}
                  className={`
                    border-b
                    transition-colors
                    hover:bg-slate-50
                    ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/40"
                    }
                  `}
                >
                  {/* PO */}
                  <td className="px-4 py-4">
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {transaction.po_number ?? "-"}
                    </code>
                  </td>

                  {/* DATE */}
                  <td className="whitespace-nowrap px-4 py-4">
                    {format(
                      new Date(transaction.order_date),
                      "dd MMM yyyy"
                    )}
                  </td>

                  {/* VENDOR */}
                  <td className="px-4 py-4">
                    <div className="max-w-[220px] truncate font-medium">
                      {transaction.vendor_name}
                    </div>
                  </td>

                  {/* ITEM */}
                  <td className="px-4 py-4">
                    <div className="max-w-[340px] truncate">
                      {transaction.item_name}
                    </div>
                  </td>

                  {/* UOM */}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {transaction.uom ?? "-"}
                    </span>
                  </td>

                  {/* QTY */}
                  <td className="px-4 py-4 text-right font-medium">
                    {formatNumber(transaction.qty)}
                  </td>

                  {/* TOTAL */}
                  <td className="whitespace-nowrap px-4 py-4 text-right font-semibold">
                    {formatCompactCurrency(
                      transaction.total_price
                    )}
                  </td>
                </tr>
              ))}

              {recentTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-500"
                  >
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}