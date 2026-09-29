import { supabaseAdmin } from "@/lib/supabase-admin";

import {
  DocumentsKpi,
  VendorComplianceContract,
  VendorDetails,
  VendorMaterialDocument,
} from "@/types/vendor-documents";

export interface VendorDocumentsFilters {
  vendors?: string[];
  items?: string[];
}

export class VendorDocumentsRepository {
  async getComplianceContracts(
    filters: VendorDocumentsFilters = {}
  ): Promise<VendorComplianceContract[]> {
    let query = supabaseAdmin
      .from("vendor_compliance_contracts")
      .select(`
        id,
        vendor_id,
        vendor_name,
        document_status,
        contract_active,
        contract_expiry_date,
        drive_url,
        created_at,
        updated_at
      `)
      .order("id", { ascending: true });

    if (filters.vendors && filters.vendors.length > 0) {
      query = query.in("vendor_name", filters.vendors);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to load vendor compliance contracts: ${error.message}`
      );
    }

    return data ?? [];
  }

  async getMaterialDocuments(
    filters: VendorDocumentsFilters = {}
  ): Promise<VendorMaterialDocument[]> {
    let query = supabaseAdmin
      .from("vendor_material_documents")
      .select(`
        id,
        item_type,
        vendor,
        document_status,
        drive_url,
        created_at,
        updated_at
      `)
      .order("item_type", { ascending: true });

    if (filters.vendors && filters.vendors.length > 0) {
      query = query.in("vendor", filters.vendors);
    }

    if (filters.items && filters.items.length > 0) {
      query = query.in("item_type", filters.items);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to load vendor material documents: ${error.message}`
      );
    }

    return data ?? [];
  }

  async getVendorDetails(
    vendorId: string
  ): Promise<VendorDetails | null> {
    const { data, error } = await supabaseAdmin
      .from("vendor_details")
      .select(`
        id,
        vendor_id,
        vendor_name,
        pic,
        email,
        phone,
        address,
        pakta_integritas,
        akta_pendirian,
        surat_pernyataan,
        tdp,
        ktp,
        skt,
        cover_buku_tabungan,
        nib,
        surat_kuasa_direksi,
        spp,
        npwp,
        siup,
        link_dokumen_kontrak,
        created_at,
        updated_at
      `)
      .eq("vendor_id", vendorId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to load vendor details: ${error.message}`
      );
    }

    return data;
  }

  async getKpi(): Promise<DocumentsKpi> {
    const { count: totalVendors, error: vendorError } =
      await supabaseAdmin
        .from("vendor_compliance_contracts")
        .select("vendor_id", {
          count: "exact",
          head: true,
        });

    if (vendorError) {
      throw new Error(
        `Failed to count active vendors: ${vendorError.message}`
      );
    }

    const { count: activeContracts, error: contractError } =
      await supabaseAdmin
        .from("vendor_compliance_contracts")
        .select("vendor_id", {
          count: "exact",
          head: true,
        })
        .eq("contract_active", "Available");

    if (contractError) {
      throw new Error(
        `Failed to count active contracts: ${contractError.message}`
      );
    }

    const {
      count: completeDocuments,
      error: documentError,
    } = await supabaseAdmin
      .from("vendor_compliance_contracts")
      .select("vendor_id", {
        count: "exact",
        head: true,
      })
      .eq("document_status", "Lengkap");

    if (documentError) {
      throw new Error(
        `Failed to count complete documents: ${documentError.message}`
      );
    }

    return {
      total_vendors: totalVendors ?? 0,
      active_contracts: activeContracts ?? 0,
      complete_documents: completeDocuments ?? 0,
    };
  }

  async getVendors(): Promise<string[]> {
    const { data, error } = await supabaseAdmin
      .from("vendor_compliance_contracts")
      .select("vendor_name")
      .order("vendor_name", { ascending: true });

    if (error) {
      throw new Error(
        `Failed to load document vendors: ${error.message}`
      );
    }

    return Array.from(
      new Set(
        (data ?? [])
          .map((row) => row.vendor_name)
          .filter(Boolean)
      )
    );
  }
}

export const vendorDocumentsRepository =
  new VendorDocumentsRepository();