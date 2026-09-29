"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

interface DocumentsFiltersProps {
  vendors: string[];
  selectedVendors: string[];
  selectedDocumentStatus: string;
  selectedContractStatus: string;
  onVendorChange: (values: string[]) => void;
  onDocumentStatusChange: (value: string) => void;
  onContractStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function DocumentsFilters({
  vendors,
  selectedVendors,
  selectedDocumentStatus,
  selectedContractStatus,
  onVendorChange,
  onDocumentStatusChange,
  onContractStatusChange,
  onReset,
}: DocumentsFiltersProps) {
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");

  const vendorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        vendorRef.current &&
        !vendorRef.current.contains(event.target as Node)
      ) {
        setVendorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const filteredVendors = vendors.filter((vendor) =>
    vendor
      .toLowerCase()
      .includes(vendorSearch.trim().toLowerCase())
  );

  const toggleVendor = (vendor: string) => {
    if (selectedVendors.includes(vendor)) {
      onVendorChange(
        selectedVendors.filter((item) => item !== vendor)
      );
      return;
    }

    onVendorChange([...selectedVendors, vendor]);
  };

  const removeVendor = (vendor: string) => {
    onVendorChange(
      selectedVendors.filter((item) => item !== vendor)
    );
  };

  const selectAllFilteredVendors = () => {
    const merged = Array.from(
      new Set([...selectedVendors, ...filteredVendors])
    );

    onVendorChange(merged);
  };

  const clearVendors = () => {
    onVendorChange([]);
  };

  return (
    <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* ============================================================
            VENDOR MULTI SELECT
        ============================================================ */}
        <div
          ref={vendorRef}
          className="relative flex-1"
        >
          <label className="mb-1.5 block text-sm font-medium">
            Vendor
          </label>

          <button
            type="button"
            onClick={() => setVendorOpen((open) => !open)}
            className="flex min-h-[40px] w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-left text-sm transition hover:bg-muted/40"
          >
            <span
              className={
                selectedVendors.length > 0
                  ? "truncate"
                  : "text-muted-foreground"
              }
            >
              {selectedVendors.length === 0
                ? "All Vendors"
                : `${selectedVendors.length} vendor dipilih`}
            </span>

            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                vendorOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {vendorOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] rounded-xl border bg-card shadow-lg">
              {/* Search */}
              <div className="border-b p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(event) =>
                      setVendorSearch(event.target.value)
                    }
                    placeholder="Search vendor..."
                    className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between border-b px-3 py-2">
                <button
                  type="button"
                  onClick={selectAllFilteredVendors}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={clearVendors}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>

              {/* Vendor List */}
              <div className="max-h-64 overflow-y-auto p-1">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => {
                    const selected =
                      selectedVendors.includes(vendor);

                    return (
                      <button
                        key={vendor}
                        type="button"
                        onClick={() => toggleVendor(vendor)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-muted"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {selected && (
                            <Check className="h-3 w-3" />
                          )}
                        </span>

                        <span className="truncate">
                          {vendor}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Vendor tidak ditemukan.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected vendor chips */}
          {selectedVendors.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedVendors.slice(0, 3).map((vendor) => (
                <span
                  key={vendor}
                  className="inline-flex max-w-[220px] items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                >
                  <span className="truncate">
                    {vendor}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeVendor(vendor)}
                    className="shrink-0 rounded hover:bg-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {selectedVendors.length > 3 && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  +{selectedVendors.length - 3} lainnya
                </span>
              )}
            </div>
          )}
        </div>

        {/* ============================================================
            DOCUMENT STATUS
        ============================================================ */}
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">
            Document Status
          </label>

          <select
            value={selectedDocumentStatus}
            onChange={(event) =>
              onDocumentStatusChange(event.target.value)
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="Lengkap">Lengkap</option>
            <option value="Belum Lengkap">
              Belum Lengkap
            </option>
            <option value="Tidak Lengkap">
              Tidak Lengkap
            </option>
          </select>
        </div>

        {/* ============================================================
            CONTRACT STATUS
        ============================================================ */}
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">
            Contract Status
          </label>

          <select
            value={selectedContractStatus}
            onChange={(event) =>
              onContractStatusChange(event.target.value)
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">All Contracts</option>
            <option value="Available">Available</option>
            <option value="Not Available">
              Not Available
            </option>
          </select>
        </div>

        {/* ============================================================
            RESET
        ============================================================ */}
        <button
          type="button"
          onClick={() => {
            setVendorSearch("");
            setVendorOpen(false);
            onReset();
          }}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Reset
        </button>
      </div>
    </div>
  );
}