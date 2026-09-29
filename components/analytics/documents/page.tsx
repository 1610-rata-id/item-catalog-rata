"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";

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
    return complianceContracts.filter((item) => {
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
        matchesVendor &&
        matchesDocumentStatus &&
        matchesContractStatus
      );
    });
  }, [
    complianceContracts,
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
    return materialDocuments.filter((item) => {
      const matchesVendor =
        selectedVendors.length === 0 ||
        selectedVendors.includes(item.vendor);

      const matchesDocumentStatus =
        !selectedDocumentStatus ||
        item.document_status ===
          selectedDocumentStatus;

      return (
        matchesVendor &&
        matchesDocumentStatus
      );
    });
  }, [
    materialDocuments,
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
              COMPLIANCE & CONTRACT
          ======================================================== */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                Compliance & Contract Documents
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Vendor compliance and contract document
                status.
              </p>
            </div>

            <div className="max-h-[520px] overflow-auto rounded-lg border">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Vendor ID
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Vendor
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Status Dokumen
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Kontrak Aktif
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Tanggal Berakhir
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplianceContracts.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b last:border-0 hover:bg-muted/40"
                      >
                        <td className="whitespace-nowrap px-3 py-3">
                          {item.vendor_id}
                        </td>

                        <td className="px-3 py-3 font-medium">
                          {item.vendor_name}
                        </td>

                        <td className="px-3 py-3">
                          {item.document_status}
                        </td>

                        <td className="px-3 py-3">
                          {item.contract_active}
                        </td>

                        <td className="whitespace-nowrap px-3 py-3">
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

                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenVendorDetail(
                                item.vendor_id
                              )
                            }
                            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                          >
                            Lihat Detail
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
                          className="px-3 py-8 text-center text-sm text-muted-foreground"
                        >
                          No compliance and contract
                          documents found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Showing{" "}
              {filteredComplianceContracts.length} of{" "}
              {complianceContracts.length} records
            </div>
          </div>

          {/* ========================================================
              MATERIAL DOCUMENTS
          ======================================================== */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                Material Documents
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Material and item document status by
                vendor.
              </p>
            </div>

            <div className="max-h-[520px] overflow-auto rounded-lg border">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Item
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Vendor
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 font-medium">
                      Status Dokumen
                    </th>

                    <th className="sticky top-0 z-10 bg-card px-3 py-3 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMaterialDocuments.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-3 py-3 font-medium">
                          {item.item_type}
                        </td>

                        <td className="px-3 py-3">
                          {item.vendor}
                        </td>

                        <td className="px-3 py-3">
                          {item.document_status}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {item.drive_url ? (
                            <a
                              href={item.drive_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                            >
                              Lihat Dokumen
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Tidak tersedia
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
                          className="px-3 py-8 text-center text-sm text-muted-foreground"
                        >
                          No material documents found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
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