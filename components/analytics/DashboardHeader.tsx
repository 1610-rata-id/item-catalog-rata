"use client";

import { CalendarDays, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Procurement Analytics Dashboard
        </h1>

        <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
          Overview of procurement performance
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm text-slate-500 shadow-sm dark:bg-neutral-900 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" />
          <span>{today}</span>
        </div>

        <Button className="rounded-xl px-5">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </header>
  );
}