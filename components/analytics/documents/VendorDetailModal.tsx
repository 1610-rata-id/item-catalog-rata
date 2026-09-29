"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  User,
  X,
  XCircle,
} from "lucide-react";

interface VendorDetails {
  id: number;
  vendor_id: string;
  vendor_name: string;
  pic: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;

  pakta_integritas: boolean;
  akta_pendirian: boolean;
  surat_pernyataan: boolean;
  tdp: boolean;
  ktp: boolean;
  skt: boolean;
  cover_buku_tabungan: boolean;
  nib: boolean;
  surat_kuasa_direksi: boolean;
  spp: boolean;
  npwp: boolean;
  siup: boolean;

  link_dokumen_kontrak: string | null;

  created_at: string;
  updated_at: string;
}

interface VendorDetailModalProps {
  vendorId: string | null;
  open: boolean;
  onClose: () => void;
}

interface VendorDetailApiResponse {
  success: boolean;
  data?: VendorDetails;
  error?: string;
}

interface DocumentChecklistItem {
  label: string;
  value: boolean;
}

export default function VendorDetailModal({
  vendorId,
  open,
  onClose,
}: VendorDetailModalProps) {
  const [vendor, setVendor] =
    useState<VendorDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !vendorId) {
      setVendor(null);
      setError(null);
      return;
    }

    const loadVendorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setVendor(null);

        const response = await fetch(
          `/api/analytics/documents/${encodeURIComponent(
            vendorId
          )}`,
          {
            cache: "no-store",
          }
        );

        const result: VendorDetailApiResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.error ||
              "Failed to load vendor details"
          );
        }

        setVendor(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load vendor details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVendorDetails();
  }, [open, vendorId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const checklist: DocumentChecklistItem[] = vendor
    ? [
        {
          label: "Pakta Integritas",
          value: vendor.pakta_integritas,
        },
        {
          label: "Akta Pendirian",
          value: vendor.akta_pendirian,
        },
        {
          label: "Surat Pernyataan",
          value: vendor.surat_pernyataan,
        },
        {
          label: "TDP",
          value: vendor.tdp,
        },
        {
          label: "KTP",
          value: vendor.ktp,
        },
        {
          label: "SKT",
          value: vendor.skt,
        },
        {
          label: "Cover Buku Tabungan",
          value: vendor.cover_buku_tabungan,
        },
        {
          label: "NIB",
          value: vendor.nib,
        },
        {
          label: "Surat Kuasa Direksi",
          value: vendor.surat_kuasa_direksi,
        },
        {
          label: "SPP",
          value: vendor.spp,
        },
        {
          label: "NPWP",
          value: vendor.npwp,
        },
        {
          label: "SIUP",
          value: vendor.siup,
        },
      ]
    : [];

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl">
        {/* ========================================================
            HEADER
        ======================================================== */}
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">
              Detail Vendor
            </h2>

            {vendor && (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {vendor.vendor_name}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ========================================================
            CONTENT
        ======================================================== */}
        <div className="overflow-y-auto px-6 py-6">
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-sm text-muted-foreground">
                Loading vendor details...
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && vendor && (
            <div className="space-y-6">
              {/* ==================================================
                  VENDOR INFORMATION
              ================================================== */}
              <section className="rounded-xl border bg-background p-5">
                <div className="mb-5">
                  <h3 className="text-base font-semibold">
                    Vendor Information
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Basic information of the vendor.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Vendor ID
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {vendor.vendor_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Vendor
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {vendor.vendor_name}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <User className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        PIC
                      </p>

                      <p className="mt-1 text-sm">
                        {vendor.pic || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <Mail className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm">
                        {vendor.email || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <Phone className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Phone
                      </p>

                      <p className="mt-1 text-sm">
                        {vendor.phone || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 md:col-span-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Address
                      </p>

                      <p className="mt-1 text-sm leading-6">
                        {vendor.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  DOCUMENT CHECKLIST
              ================================================== */}
              <section className="rounded-xl border bg-background p-5">
                <div className="mb-5">
                  <h3 className="text-base font-semibold">
                    Document Checklist
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Availability of required vendor documents.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {checklist.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border px-4 py-3"
                    >
                      <span className="pr-3 text-sm">
                        {item.label}
                      </span>

                      {item.value ? (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                          <XCircle className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ==================================================
                  CONTRACT DOCUMENT
              ================================================== */}
              <section className="rounded-xl border bg-background p-5">
                <div className="mb-4">
                  <h3 className="text-base font-semibold">
                    Dokumen Kontrak
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Contract document provided for this vendor.
                  </p>
                </div>

                {vendor.link_dokumen_kontrak ? (
                  <a
                    href={vendor.link_dokumen_kontrak}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                  >
                    Lihat Dokumen Kontrak
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="rounded-lg border border-dashed px-4 py-4 text-sm text-muted-foreground">
                    Dokumen kontrak belum tersedia.
                  </div>
                )}
              </section>
            </div>
          )}

          {!loading && !error && !vendor && (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
              Vendor details not found.
            </div>
          )}
        </div>

        {/* ========================================================
            FOOTER
        ======================================================== */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}