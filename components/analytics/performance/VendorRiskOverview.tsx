"use client";

import { ShieldAlert } from "lucide-react";

interface VendorRiskRow {
  id: number;
  vendor: string;
  material: string;
  single_source: boolean;
  frequent_backorder: boolean;
  risk_level: "Low" | "Medium" | "High";
}

interface VendorRiskOverviewProps {
  risks: VendorRiskRow[];
}

function RiskBadge({
  value,
}: {
  value: boolean;
}) {
  return (
    <span
      className={`
        inline-flex
        min-w-[58px]
        justify-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${
          value
            ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        }
      `}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function RiskLevelBadge({
  level,
}: {
  level: "Low" | "Medium" | "High";
}) {
  const styles = {
    Low: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    Medium:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    High:
      "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <span
      className={`
        inline-flex
        min-w-[64px]
        justify-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[level]}
      `}
    >
      {level}
    </span>
  );
}

export default function VendorRiskOverview({
  risks,
}: VendorRiskOverviewProps) {
  return (
    <section className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">

      {/* HEADER */}

      <div className="shrink-0 px-6 pb-4 pt-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Vendor Risk Overview
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Vendor risk assessment based on procurement master data.
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

            <table className="w-full min-w-[680px] border-collapse text-sm">

              <thead>

                <tr className="border-b border-[#174F8F]">

                  <th
                    className="
                      w-12
                      border-r
                      border-[#4A83C2]
                      px-2
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
                      min-w-[150px]
                      border-r
                      border-[#4A83C2]
                      px-3
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
                      min-w-[130px]
                      border-r
                      border-[#4A83C2]
                      px-3
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    Material
                  </th>

                  <th
                    className="
                      min-w-[120px]
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
                    Single Source
                  </th>

                  <th
                    className="
                      min-w-[145px]
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
                    Frequent Backorder
                  </th>

                  <th
                    className="
                      min-w-[100px]
                      px-3
                      py-4
                      text-center
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    Risk Level
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

            <table className="w-full min-w-[680px] border-collapse text-sm">

              <tbody>

                {risks.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="
                        py-16
                        text-center
                        text-sm
                        text-slate-400
                      "
                    >
                      No risk data available for the selected vendors.
                    </td>

                  </tr>

                ) : (

                  risks.map((risk, index) => (

                    <tr
                      key={risk.id}
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
                          w-12
                          border-r
                          border-slate-200
                          px-2
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
                          min-w-[150px]
                          border-r
                          border-slate-200
                          px-3
                          py-4
                          font-medium
                          text-slate-700
                          dark:border-slate-800
                          dark:text-slate-200
                        "
                      >
                        {risk.vendor}
                      </td>

                      {/* MATERIAL */}

                      <td
                        className="
                          min-w-[130px]
                          border-r
                          border-slate-200
                          px-3
                          py-4
                          text-slate-600
                          dark:border-slate-800
                          dark:text-slate-300
                        "
                      >
                        {risk.material}
                      </td>

                      {/* SINGLE SOURCE */}

                      <td
                        className="
                          min-w-[120px]
                          border-r
                          border-slate-200
                          px-3
                          py-4
                          text-center
                          dark:border-slate-800
                        "
                      >
                        <RiskBadge
                          value={
                            risk.single_source
                          }
                        />
                      </td>

                      {/* FREQUENT BACKORDER */}

                      <td
                        className="
                          min-w-[145px]
                          border-r
                          border-slate-200
                          px-3
                          py-4
                          text-center
                          dark:border-slate-800
                        "
                      >
                        <RiskBadge
                          value={
                            risk.frequent_backorder
                          }
                        />
                      </td>

                      {/* RISK LEVEL */}

                      <td
                        className="
                          min-w-[100px]
                          px-3
                          py-4
                          text-center
                        "
                      >
                        <RiskLevelBadge
                          level={
                            risk.risk_level
                          }
                        />
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