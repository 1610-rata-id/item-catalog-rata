export type DocumentStatus =
  | "Lengkap"
  | "Belum Lengkap"
  | "Tidak Lengkap";

export interface VendorComplianceContract {
  id: number;
  vendor_id: string;
  vendor_name: string;
  document_status: DocumentStatus;
  contract_active: string;
  contract_expiry_date: string | null;
  drive_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorMaterialDocument {
  id: number;
  item_type: string;
  vendor: string;
  document_status: DocumentStatus;
  drive_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorDetails {
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

export interface DocumentsKpi {
  total_vendors: number;
  active_contracts: number;
  complete_documents: number;
}

export interface VendorDocumentsFilters {
  vendors?: string[];
  items?: string[];
}