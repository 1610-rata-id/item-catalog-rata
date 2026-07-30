"use client";

import { Button } from "@/components/ui/button";

export default function DashboardFilterBar() {
  return (
    <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Year */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Year
          </label>

          <div className="h-10 rounded-md border bg-background" />
        </div>

        {/* Month */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Month
          </label>

          <div className="h-10 rounded-md border bg-background" />
        </div>

        {/* Vendor */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Vendor
          </label>

          <div className="h-10 rounded-md border bg-background" />
        </div>

        {/* Item */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Item
          </label>

          <div className="h-10 rounded-md border bg-background" />
        </div>

        {/* Reset */}
        <Button variant="outline">
          Reset Filter
        </Button>
      </div>
    </div>
  );
}