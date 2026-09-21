"use client";

import { useMemo } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  DEFAULT_DASHBOARD_FILTER,
} from "@/types/dashboard-filter";

export function useDashboardFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedYear = useMemo(() => {
    const year = Number(searchParams.get("year"));

    return Number.isNaN(year)
      ? DEFAULT_DASHBOARD_FILTER.year
      : year;
  }, [searchParams]);

  const selectedMonths = useMemo(() => {
    const monthParam = searchParams.get("month");

    if (!monthParam) {
      return [];
    }

    return monthParam
      .split(",")
      .filter(Boolean);
  }, [searchParams]);

  const selectedVendors = useMemo(() => {
    const vendorParam = searchParams.get("vendors");

    if (!vendorParam) {
      return [];
    }

    return vendorParam
      .split(",")
      .filter(Boolean);
  }, [searchParams]);

  const selectedItems = useMemo(() => {
    const itemParam = searchParams.get("items");

    if (!itemParam) {
      return [];
    }

    return itemParam
      .split(",")
      .filter(Boolean);
  }, [searchParams]);

  const updateQuery = (
    key: string,
    value: string | null
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(
      `${pathname}?${params.toString()}`
    );
  };

  const handleYearChange = (
    value: string | null
  ) => {
    if (!value) return;

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("year", value);

    /*
     * Vendor dan Item tetap valid secara konsep
     * ketika tahun berubah, jadi jangan dihapus
     * dulu.
     */

    router.replace(
      `${pathname}?${params.toString()}`
    );
  };

  const handleMonthChange = (
    values: string[]
  ) => {
    if (values.length === 0) {
      updateQuery("month", null);
      return;
    }

    updateQuery(
      "month",
      values.join(",")
    );
  };

  const handleVendorChange = (
    values: string[]
  ) => {
    if (values.length === 0) {
      updateQuery("vendors", null);
      return;
    }

    updateQuery(
      "vendors",
      values.join(",")
    );
  };

  const handleItemChange = (
    values: string[]
  ) => {
    if (values.length === 0) {
      updateQuery("items", null);
      return;
    }

    updateQuery(
      "items",
      values.join(",")
    );
  };

  const handleReset = () => {
    router.replace(
      `${pathname}?year=${DEFAULT_DASHBOARD_FILTER.year}`
    );
  };

  return {
    selectedYear,
    selectedMonths,
    selectedVendors,
    selectedItems,

    handleYearChange,
    handleMonthChange,
    handleVendorChange,
    handleItemChange,
    handleReset,
  };
}