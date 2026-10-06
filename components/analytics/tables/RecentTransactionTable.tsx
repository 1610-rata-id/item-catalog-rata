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
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Recent Transactions
        </CardTitle>

        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
          Latest procurement transactions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#1D63B3]">
                <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                  PO
                </th>

                <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                  Date
                </th>

                <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                  Vendor
                </th>

                <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                  Item
                </th>

                <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                  UOM
                </th>

                <th className="h-[50px] px-4 text-right text-xs font-semibold text-white">
                  Qty
                </th>

                <th className="h-[50px] px-4 text-right text-xs font-semibold text-white">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map(
                (transaction, index) => (
                  <tr
                    key={`${transaction.po_number}-${transaction.pr_number}-${transaction.item_name}-${index}`}
                    className="h-[56px] border-b border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/60"
                  >
                    {/* PO */}

                    <td className="whitespace-nowrap px-4">
                      <code className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {transaction.po_number ?? "-"}
                      </code>
                    </td>

                    {/* DATE */}

                    <td className="whitespace-nowrap px-4 text-slate-600 dark:text-slate-300">
                      {format(
                        new Date(
                          transaction.order_date
                        ),
                        "dd MMM yyyy"
                      )}
                    </td>

                    {/* VENDOR */}

                    <td className="px-4">
                      <div
                        className="max-w-[220px] truncate font-medium text-slate-700 dark:text-slate-200"
                        title={transaction.vendor_name}
                      >
                        {transaction.vendor_name}
                      </div>
                    </td>

                    {/* ITEM */}

                    <td className="px-4">
                      <div
                        className="max-w-[340px] truncate text-slate-600 dark:text-slate-300"
                        title={transaction.item_name}
                      >
                        {transaction.item_name}
                      </div>
                    </td>

                    {/* UOM */}

                    <td className="px-4 text-center">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {transaction.uom ?? "-"}
                      </span>
                    </td>

                    {/* QTY */}

                    <td className="whitespace-nowrap px-4 text-right font-medium text-slate-700 dark:text-slate-200">
                      {formatNumber(transaction.qty)}
                    </td>

                    {/* TOTAL */}

                    <td className="whitespace-nowrap px-4 text-right font-semibold text-slate-900 dark:text-white">
                      {formatCompactCurrency(
                        transaction.total_price
                      )}
                    </td>
                  </tr>
                )
              )}

              {recentTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center"
                  >
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      No recent transactions found.
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      There are no recent procurement
                      transactions to display.
                    </p>
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