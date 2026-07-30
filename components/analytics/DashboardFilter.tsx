"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDashboardFilter } from "@/hooks/use-dashboard-filter";
import { VendorList } from "@/types/vendor-list";

interface DashboardFilterProps {
  vendors: VendorList[];
}

export default function DashboardFilter({
  vendors,
}: DashboardFilterProps) {
  const {
    selectedYear,
    selectedMonth,
    selectedVendor,

    searchValue,
    setSearchValue,

    handleYearChange,
    handleMonthChange,
    handleVendorChange,
    handleReset,
  } = useDashboardFilter();

  return (
    <Card className="mb-8 rounded-2xl border-0 bg-white p-6 shadow-sm dark:bg-neutral-900">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[180px_180px_1fr_1fr_170px]">

  {/* YEAR */}
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
      Year
    </label>

    <Select
      value={selectedYear.toString()}
      onValueChange={handleYearChange}
    >
      <SelectTrigger className="h-11 rounded-xl">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="2026">2026</SelectItem>
        <SelectItem value="2025">2025</SelectItem>
        <SelectItem value="2024">2024</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* MONTH */}
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
      Month
    </label>

    <Select
      value={selectedMonth}
      onValueChange={handleMonthChange}
    >
      <SelectTrigger className="h-11 rounded-xl">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All Months
        </SelectItem>

        <SelectItem value="1">January</SelectItem>
        <SelectItem value="2">February</SelectItem>
        <SelectItem value="3">March</SelectItem>
        <SelectItem value="4">April</SelectItem>
        <SelectItem value="5">May</SelectItem>
        <SelectItem value="6">June</SelectItem>
        <SelectItem value="7">July</SelectItem>
        <SelectItem value="8">August</SelectItem>
        <SelectItem value="9">September</SelectItem>
        <SelectItem value="10">October</SelectItem>
        <SelectItem value="11">November</SelectItem>
        <SelectItem value="12">December</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* VENDOR */}
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
      Vendor
    </label>

    <Select
      value={selectedVendor}
      onValueChange={handleVendorChange}
    >
      <SelectTrigger className="h-11 rounded-xl">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All Vendors
        </SelectItem>

        {vendors.map((vendor) => (
          <SelectItem
            key={vendor.vendor_name}
            value={vendor.vendor_name}
          >
            {vendor.vendor_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* SEARCH */}
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
      Item Name
    </label>

    <div className="relative">
      <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="h-11 rounded-xl pl-10"
        placeholder="Search item..."
      />
    </div>
  </div>

  {/* RESET */}
  <div className="flex items-end">
    <Button
      variant="outline"
      onClick={handleReset}
      className="h-11 w-full rounded-xl"
    >
      <RotateCcw className="mr-2 h-4 w-4" />
      Reset Filter
    </Button>
  </div>

</div>
    </Card>
  );
}