export interface CatalogItem {
  id: number;

  slug: string;

  item_code: string;

  item_name: string;

  vendor: string;

  price: number;

  description: string | null;

  image_url: string | null;

  image_urls: string[] | null;

  category: string | null;

  main_category: string | null;

  sub_category: string | null;

  UOM: string | null;

  Manufacture: string | null;

  type: string | null;

  Term: string | null;

  Remarks: string | null;

  Marketplace: string | null;

  tokopedia_url: string | null;

  shopee_url: string | null;

  whatsapp_url: string | null;

  official_url: string | null;

  created_at: string;
}