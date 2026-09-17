"use client";

import { useEffect, useState } from "react";

import {
  Home,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardSidebar() {
  const [lastUpdated, setLastUpdated] =
    useState<string | null>(null);

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

  return (
    <aside className="flex h-screen w-[280px] flex-col bg-[#0F172A] text-white">

      {/* Logo */}
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

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">

        <button
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            bg-blue-600
            px-4
            py-3
            text-sm
            font-medium
            transition-all
            hover:bg-blue-500
          "
        >
          <Home className="h-5 w-5" />

          Overview
        </button>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 p-5">

        {/* Theme */}

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

        {/* Status */}

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