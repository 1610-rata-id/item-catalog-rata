"use client";

import { useEffect, useMemo, useState } from "react";
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

  const selectedVendor = useMemo(() => {
    return searchParams.get("vendor") ?? "all";
  }, [searchParams]);

  const selectedSearch = useMemo(() => {
    return searchParams.get("search") ?? "";
  }, [searchParams]);

  const [searchValue, setSearchValue] =
    useState(selectedSearch);

  useEffect(() => {
    setSearchValue(selectedSearch);
  }, [selectedSearch]);

  const updateQuery = (
    key: string,
    value: string | null
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (
      value === null ||
      value === "" ||
      value === "all"
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleYearChange = (
    value: string | null
  ) => {
    if (!value) return;

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("year", value);

    // Reset vendor ketika tahun berubah
    params.delete("vendor");

    router.replace(`${pathname}?${params.toString()}`);
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
    value: string | null
  ) => {
    updateQuery("vendor", value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateQuery("search", searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleReset = () => {
    router.replace(
      `${pathname}?year=${DEFAULT_DASHBOARD_FILTER.year}`
    );
  };

  return {
  selectedYear,
  selectedMonths,
  selectedVendor,

    searchValue,
    setSearchValue,

    handleYearChange,
    handleMonthChange,
    handleVendorChange,
    handleReset,
  };
}