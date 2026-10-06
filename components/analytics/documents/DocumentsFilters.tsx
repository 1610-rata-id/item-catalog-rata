"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  FileCheck2,
  FileText,
  RotateCcw,
  X,
} from "lucide-react";

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
  const [documentStatusOpen, setDocumentStatusOpen] = useState(false);
  const [contractStatusOpen, setContractStatusOpen] = useState(false);

  const [vendorSearch, setVendorSearch] = useState("");

  const vendorRef = useRef<HTMLDivElement>(null);
  const documentStatusRef = useRef<HTMLDivElement>(null);
  const contractStatusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        vendorRef.current &&
        !vendorRef.current.contains(target)
      ) {
        setVendorOpen(false);
      }

      if (
        documentStatusRef.current &&
        !documentStatusRef.current.contains(target)
      ) {
        setDocumentStatusOpen(false);
      }

      if (
        contractStatusRef.current &&
        !contractStatusRef.current.contains(target)
      ) {
        setContractStatusOpen(false);
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

  const documentStatusLabel =
    selectedDocumentStatus || "All Status";

  const contractStatusLabel =
    selectedContractStatus || "All Contracts";

  return (
    <section className="rounded-2xl border-0 bg-[#1D63B3] p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

        {/* ============================================================
            VENDOR
        ============================================================ */}

        <div
          ref={vendorRef}
          className="relative flex-1"
        >
          <label className="mb-2 block text-xs font-medium text-white">
            Vendor
          </label>

          <button
            type="button"
            onClick={() => {
              setVendorOpen((open) => !open);
              setDocumentStatusOpen(false);
              setContractStatusOpen(false);
            }}
            className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-white/20 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-white/40"
          >
            <span
              className={
                selectedVendors.length > 0
                  ? "truncate"
                  : "truncate text-slate-500"
              }
            >
              {selectedVendors.length === 0
                ? "All Vendors"
                : `${selectedVendors.length} Vendors`}
            </span>

            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                vendorOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {vendorOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-200 p-3">
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(event) =>
                      setVendorSearch(event.target.value)
                    }
                    placeholder="Search vendor..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#1D63B3] focus:ring-2 focus:ring-blue-100"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
                <button
                  type="button"
                  onClick={selectAllFilteredVendors}
                  className="text-xs font-medium text-[#1D63B3] hover:underline"
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={clearVendors}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Clear
                </button>
              </div>

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
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selected
                              ? "border-[#1D63B3] bg-[#1D63B3] text-white"
                              : "border-slate-300"
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
                  <div className="px-3 py-6 text-center text-sm text-slate-400">
                    Vendor not found.
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedVendors.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedVendors.slice(0, 3).map((vendor) => (
                <span
                  key={vendor}
                  className="inline-flex max-w-[220px] items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-xs text-white"
                >
                  <span className="truncate">
                    {vendor}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeVendor(vendor)}
                    className="shrink-0 rounded hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {selectedVendors.length > 3 && (
                <span className="rounded-md bg-white/15 px-2 py-1 text-xs text-white">
                  +{selectedVendors.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* ============================================================
            DOCUMENT STATUS
        ============================================================ */}

        <div
          ref={documentStatusRef}
          className="relative flex-1"
        >
          <label className="mb-2 block text-xs font-medium text-white">
            Document Status
          </label>

          <button
            type="button"
            onClick={() => {
              setDocumentStatusOpen((open) => !open);
              setVendorOpen(false);
              setContractStatusOpen(false);
            }}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-white/20 bg-white px-3 text-left text-sm text-slate-700 transition hover:border-white/40"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-[#1D63B3]" />

              <span className="truncate">
                {documentStatusLabel}
              </span>
            </span>

            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                documentStatusOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {documentStatusOpen && (
            <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
              {[
                {
                  value: "",
                  label: "All Status",
                },
                {
                  value: "Lengkap",
                  label: "Lengkap",
                },
                {
                  value: "Belum Lengkap",
                  label: "Belum Lengkap",
                },
                {
                  value: "Tidak Lengkap",
                  label: "Tidak Lengkap",
                },
              ].map((option) => {
                const selected =
                  selectedDocumentStatus === option.value;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      onDocumentStatusChange(option.value);
                      setDocumentStatusOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50"
                  >
                    <span>{option.label}</span>

                    {selected && (
                      <Check className="h-4 w-4 text-[#1D63B3]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ============================================================
            CONTRACT STATUS
        ============================================================ */}

        <div
          ref={contractStatusRef}
          className="relative flex-1"
        >
          <label className="mb-2 block text-xs font-medium text-white">
            Contract Status
          </label>

          <button
            type="button"
            onClick={() => {
              setContractStatusOpen((open) => !open);
              setVendorOpen(false);
              setDocumentStatusOpen(false);
            }}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-white/20 bg-white px-3 text-left text-sm text-slate-700 transition hover:border-white/40"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileCheck2 className="h-4 w-4 shrink-0 text-[#1D63B3]" />

              <span className="truncate">
                {contractStatusLabel}
              </span>
            </span>

            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                contractStatusOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {contractStatusOpen && (
            <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
              {[
                {
                  value: "",
                  label: "All Contracts",
                },
                {
                  value: "Available",
                  label: "Available",
                },
                {
                  value: "Not Available",
                  label: "Not Available",
                },
              ].map((option) => {
                const selected =
                  selectedContractStatus === option.value;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      onContractStatusChange(option.value);
                      setContractStatusOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50"
                  >
                    <span>{option.label}</span>

                    {selected && (
                      <Check className="h-4 w-4 text-[#1D63B3]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ============================================================
            RESET FILTER
        ============================================================ */}

        <button
          type="button"
          onClick={() => {
            setVendorSearch("");
            setVendorOpen(false);
            setDocumentStatusOpen(false);
            setContractStatusOpen(false);
            onReset();
          }}
          className="flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset Filter
        </button>
      </div>
    </section>
  );
}