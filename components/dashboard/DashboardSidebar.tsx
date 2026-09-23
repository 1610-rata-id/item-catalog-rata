"use client";

import { useEffect, useState } from "react";

import {
  Home,
  Moon,
  RefreshCw,
  Sun,
  BarChart3,
  ChevronDown,
  Star,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardSidebar() {
  const [lastUpdated, setLastUpdated] =
    useState<string | null>(null);

  const [vendorAnalyticsOpen, setVendorAnalyticsOpen] =
    useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchLastUpdated() {
      try {
        const response = await fetch(
          "/api/etl-status",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch ETL status"
          );
        }

        const data = await response.json();

        if (data.last_successful_sync) {
          const date = new Date(
            data.last_successful_sync
          );

          setLastUpdated(
            new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
            }).format(date)
          );
        }
      } catch (error) {
        console.error(
          "Failed to load ETL sync status:",
          error
        );
      }
    }

    fetchLastUpdated();
  }, []);

  useEffect(() => {
    if (
      pathname.startsWith(
        "/dashboard/vendor-analytics"
      )
    ) {
      setVendorAnalyticsOpen(true);
    }
  }, [pathname]);

  const isOverview =
    pathname === "/dashboard";

  const isPerformance =
    pathname ===
    "/dashboard/vendor-analytics/performance";

  const isEvaluation =
    pathname ===
    "/dashboard/vendor-analytics/evaluation";

  const isDocuments =
    pathname ===
    "/dashboard/vendor-analytics/documents";

  const isVendorAnalytics =
    pathname.startsWith(
      "/dashboard/vendor-analytics"
    );

  return (
    <aside className="flex h-screen w-[280px] flex-col bg-[#0F172A] text-white">

      {/* LOGO */}

      <div className="border-b border-slate-700 px-6 py-7">
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <Home className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold leading-none">
              Procurement
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Analytics
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {/* OVERVIEW */}

        <button
          onClick={() =>
            router.push("/dashboard")
          }
          className={`
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-sm
            font-medium
            transition-all

            ${
              isOverview
                ? "bg-blue-600 hover:bg-blue-500"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }
          `}
        >
          <Home className="h-5 w-5" />

          Overview
        </button>

        {/* VENDOR ANALYTICS */}

        <div className="mt-3">

          <button
            onClick={() =>
              setVendorAnalyticsOpen(
                (prev) => !prev
              )
            }
            className={`
              flex
              w-full
              items-center
              justify-between
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              transition-all

              ${
                isVendorAnalytics
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }
            `}
          >

            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5" />

              <span>
                Vendor Analytics
              </span>
            </div>

            <ChevronDown
              className={`
                h-4 w-4
                transition-transform
                ${
                  vendorAnalyticsOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>

          {/* SUBMENU */}

          {vendorAnalyticsOpen && (
            <div className="mt-2 ml-4 space-y-1">

              {/* PERFORMANCE */}

              <button
                onClick={() =>
                  router.push(
                    "/dashboard/vendor-analytics/performance"
                  )
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  transition-all

                  ${
                    isPerformance
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <BarChart3 className="h-4 w-4" />

                Performance
              </button>

              {/* EVALUATION */}

              <button
                onClick={() =>
                  router.push(
                    "/dashboard/vendor-analytics/evaluation"
                  )
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  transition-all

                  ${
                    isEvaluation
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Star className="h-4 w-4" />

                Evaluation
              </button>

              {/* DOCUMENTS */}

              <button
                onClick={() =>
                  router.push(
                    "/dashboard/vendor-analytics/documents"
                  )
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  transition-all

                  ${
                    isDocuments
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <FileText className="h-4 w-4" />

                Documents
              </button>

            </div>
          )}

        </div>

      </div>

      {/* FOOTER */}

      <div className="border-t border-slate-700 p-5">

        {/* THEME */}

        <div className="mb-6">

          <p className="mb-3 text-sm font-medium text-slate-300">
            Theme
          </p>

          <div className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3">

            <Sun className="h-4 w-4" />

            <Button
              size="sm"
              className="h-6 rounded-full"
            >
              ON
            </Button>

            <Moon className="h-4 w-4" />

          </div>

        </div>

        {/* LAST UPDATED */}

        <div className="rounded-xl bg-slate-800 p-4">

          <p className="mb-2 text-sm font-medium">
            Last Updated
          </p>

          <div className="flex items-center justify-between">

            <span className="text-xs text-slate-300">
              {lastUpdated ?? "Loading..."}
            </span>

            <RefreshCw className="h-4 w-4" />

          </div>

        </div>

      </div>

    </aside>
  );
}