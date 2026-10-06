"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Search,
} from "lucide-react";

import DocumentsHeader from "./DocumentsHeader";
import DocumentsKpiGrid from "./DocumentsKpiGrid";
import DocumentsFilters from "./DocumentsFilters";
import VendorDetailModal from "./VendorDetailModal";

interface VendorComplianceContract {
  id: number;
  vendor_id: string;
  vendor_name: string;
  document_status:
    | "Lengkap"
    | "Belum Lengkap"
    | "Tidak Lengkap";
  contract_active: string;
  contract_expiry_date: string | null;
  drive_url: string | null;
  created_at: string;
  updated_at: string;
}

interface VendorMaterialDocument {
  id: number;
  item_type: string;
  vendor: string;
  document_status:
    | "Lengkap"
    | "Belum Lengkap"
    | "Tidak Lengkap";
  drive_url: string | null;
  created_at: string;
  updated_at: string;
}

interface DocumentsKpi {
  total_vendors: number;
  active_contracts: number;
  complete_documents: number;
}

interface DocumentsApiResponse {
  success: boolean;
  data?: {
    kpi: DocumentsKpi;
    complianceContracts: VendorComplianceContract[];
    materialDocuments: VendorMaterialDocument[];
    vendors: string[];
  };
  error?: string;
}

export default function DocumentsPage() {
  const [kpi, setKpi] = useState<DocumentsKpi>({
    total_vendors: 0,
    active_contracts: 0,
    complete_documents: 0,
  });

  const [vendors, setVendors] = useState<string[]>([]);

  const [complianceContracts, setComplianceContracts] =
    useState<VendorComplianceContract[]>([]);

  const [materialDocuments, setMaterialDocuments] =
    useState<VendorMaterialDocument[]>([]);

  const [selectedVendors, setSelectedVendors] =
    useState<string[]>([]);

  const [selectedDocumentStatus, setSelectedDocumentStatus] =
    useState("");

  const [selectedContractStatus, setSelectedContractStatus] =
    useState("");

  const [complianceSearch, setComplianceSearch] =
    useState("");

  const [materialSearch, setMaterialSearch] =
    useState("");

  const [selectedVendorId, setSelectedVendorId] =
    useState<string | null>(null);

  const [detailOpen, setDetailOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/analytics/documents",
          {
            cache: "no-store",
          }
        );

        const result: DocumentsApiResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.error ||
              "Failed to load documents data"
          );
        }

        setKpi(result.data.kpi);

        setVendors(result.data.vendors);

        setComplianceContracts(
          result.data.complianceContracts
        );

        setMaterialDocuments(
          result.data.materialDocuments
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load documents data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handleReset = () => {
    setSelectedVendors([]);
    setSelectedDocumentStatus("");
    setSelectedContractStatus("");
    setComplianceSearch("");
    setMaterialSearch("");
  };

  const handleOpenVendorDetail = (
    vendorId: string
  ) => {
    setSelectedVendorId(vendorId);
    setDetailOpen(true);
  };

  const handleCloseVendorDetail = () => {
    setDetailOpen(false);
    setSelectedVendorId(null);
  };

  /*
   * ============================================================
   * FILTER COMPLIANCE & CONTRACT
   * ============================================================
   */

  const filteredComplianceContracts = useMemo(() => {
    const query =
      complianceSearch.trim().toLowerCase();

    return complianceContracts.filter((item) => {
      const matchesSearch =
        !query ||
        item.vendor_id
          .toLowerCase()
          .includes(query) ||
        item.vendor_name
          .toLowerCase()
          .includes(query) ||
        item.document_status
          .toLowerCase()
          .includes(query) ||
        item.contract_active
          .toLowerCase()
          .includes(query);

      const matchesVendor =
        selectedVendors.length === 0 ||
        selectedVendors.includes(item.vendor_name);

      const matchesDocumentStatus =
        !selectedDocumentStatus ||
        item.document_status ===
          selectedDocumentStatus;

      const matchesContractStatus =
        !selectedContractStatus ||
        item.contract_active ===
          selectedContractStatus;

      return (
        matchesSearch &&
        matchesVendor &&
        matchesDocumentStatus &&
        matchesContractStatus
      );
    });
  }, [
    complianceContracts,
    complianceSearch,
    selectedVendors,
    selectedDocumentStatus,
    selectedContractStatus,
  ]);

  /*
   * ============================================================
   * FILTER MATERIAL DOCUMENTS
   * ============================================================
   */

  const filteredMaterialDocuments = useMemo(() => {
    const query =
      materialSearch.trim().toLowerCase();

    return materialDocuments.filter((item) => {
      const matchesSearch =
        !query ||
        item.item_type
          .toLowerCase()
          .includes(query) ||
        item.vendor
          .toLowerCase()
          .includes(query) ||
        item.document_status
          .toLowerCase()
          .includes(query);

      const matchesVendor =
        selectedVendors.length === 0 ||
        selectedVendors.includes(item.vendor);

      const matchesDocumentStatus =
        !selectedDocumentStatus ||
        item.document_status ===
          selectedDocumentStatus;

      return (
        matchesSearch &&
        matchesVendor &&
        matchesDocumentStatus
      );
    });
  }, [
    materialDocuments,
    materialSearch,
    selectedVendors,
    selectedDocumentStatus,
  ]);

  return (
    <div className="space-y-6">
      <DocumentsHeader />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          {/* ========================================================
              FILTERS
          ======================================================== */}

          <DocumentsFilters
            vendors={vendors}
            selectedVendors={selectedVendors}
            selectedDocumentStatus={
              selectedDocumentStatus
            }
            selectedContractStatus={
              selectedContractStatus
            }
            onVendorChange={setSelectedVendors}
            onDocumentStatusChange={
              setSelectedDocumentStatus
            }
            onContractStatusChange={
              setSelectedContractStatus
            }
            onReset={handleReset}
          />

          {/* ========================================================
              KPI
          ======================================================== */}

          <DocumentsKpiGrid
            totalVendors={
              loading ? 0 : kpi.total_vendors
            }
            activeContracts={
              loading ? 0 : kpi.active_contracts
            }
            completeDocuments={
              loading ? 0 : kpi.complete_documents
            }
          />

          {/* ========================================================
              COMPLIANCE & CONTRACT DOCUMENTS
          ======================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    Compliance & Contract Documents
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Vendor compliance and contract document status.
                  </p>
                </div>

                {/* SEARCH */}

                <div className="relative w-full lg:w-[320px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={complianceSearch}
                    onChange={(event) =>
                      setComplianceSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search vendor or document..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1D63B3] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800">
              <div className="max-h-[570px] overflow-y-auto overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#1D63B3]">
                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Vendor ID
                      </th>

                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Vendor
                      </th>

                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Document Status
                      </th>

                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Contract Status
                      </th>

                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Expiry Date
                      </th>

                      <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredComplianceContracts.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="h-[52px] border-b border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-white/[0.03]"
                        >
                          <td className="whitespace-nowrap px-4 text-slate-600 dark:text-slate-300">
                            {item.vendor_id}
                          </td>

                          <td className="px-4 font-medium text-slate-700 dark:text-slate-200">
                            {item.vendor_name}
                          </td>

                          {/* DOCUMENT STATUS */}

                          <td className="px-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                item.document_status ===
                                "Lengkap"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : item.document_status ===
                                      "Belum Lengkap"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                              }`}
                            >
                              {item.document_status}
                            </span>
                          </td>

                          {/* CONTRACT STATUS */}

                          <td className="px-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                item.contract_active ===
                                "Available"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                              }`}
                            >
                              {item.contract_active}
                            </span>
                          </td>

                          {/* EXPIRY DATE */}

                          <td className="whitespace-nowrap px-4 text-slate-600 dark:text-slate-300">
                            {item.contract_expiry_date
                              ? new Date(
                                  item.contract_expiry_date
                                ).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
                          </td>

                          {/* ACTION */}

                          <td className="px-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenVendorDetail(
                                  item.vendor_id
                                )
                              }
                              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#1D63B3] transition hover:border-[#1D63B3] hover:bg-blue-50 dark:border-neutral-700 dark:text-blue-400 dark:hover:bg-blue-500/10"
                            >
                              View Detail
                            </button>
                          </td>
                        </tr>
                      )
                    )}

                    {!loading &&
                      filteredComplianceContracts.length ===
                        0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-16 text-center"
                          >
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              No compliance and contract
                              documents found.
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              Try adjusting your filters.
                            </p>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Showing{" "}
              {filteredComplianceContracts.length} of{" "}
              {complianceContracts.length} records
            </div>
          </div>

          {/* ========================================================
              MATERIAL DOCUMENTS
          ======================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    Material Documents
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Material and item document status by vendor.
                  </p>
                </div>

                {/* SEARCH */}

                <div className="relative w-full lg:w-[320px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(event) =>
                      setMaterialSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search item or vendor..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1D63B3] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800">
              <div className="max-h-[570px] overflow-y-auto overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#1D63B3]">
                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Item
                      </th>

                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Vendor
                      </th>

                      <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                        Document Status
                      </th>

                      <th className="h-[50px] px-4 text-center text-xs font-semibold text-white">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMaterialDocuments.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="h-[52px] border-b border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-white/[0.03]"
                        >
                          {/* ITEM */}

                          <td className="px-4 font-medium text-slate-700 dark:text-slate-200">
                            {item.item_type}
                          </td>

                          {/* VENDOR */}

                          <td className="px-4 text-slate-600 dark:text-slate-300">
                            {item.vendor}
                          </td>

                          {/* DOCUMENT STATUS */}

                          <td className="px-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                item.document_status ===
                                "Lengkap"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : item.document_status ===
                                      "Belum Lengkap"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                              }`}
                            >
                              {item.document_status}
                            </span>
                          </td>

                          {/* ACTION */}

                          <td className="px-4 text-center">
                            {item.drive_url ? (
                              <a
                                href={item.drive_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#1D63B3] transition hover:border-[#1D63B3] hover:bg-blue-50 dark:border-neutral-700 dark:text-blue-400 dark:hover:bg-blue-500/10"
                              >
                                View Document
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                Not available
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    {!loading &&
                      filteredMaterialDocuments.length ===
                        0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-16 text-center"
                          >
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              No material documents found.
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              Try adjusting your filters.
                            </p>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Showing{" "}
              {filteredMaterialDocuments.length} of{" "}
              {materialDocuments.length} records
            </div>
          </div>
        </>
      )}

      {/* ============================================================
          VENDOR DETAIL MODAL
      ============================================================ */}

      <VendorDetailModal
        vendorId={selectedVendorId}
        open={detailOpen}
        onClose={handleCloseVendorDetail}
      />
    </div>
  );
}