"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createAuditLog } from "@/lib/audit";
import { supabase } from "@/lib/supabase";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ArrowLeft, ImagePlus, X } from "lucide-react";

type AddItemForm = {
  name: string;
  vendor: string;
  category: string;
  main_category: string;
  sub_category: string;
  price: string;
  item_code: string;
  UOM: string;
  Manufacture: string;
  type: string;
  Term: string;
  Remarks: string;
  description: string;
  tokopedia_url: string;
  shopee_url: string;
  whatsapp_url: string;
  official_url: string;
  image_urls: string[];
};

const initialForm: AddItemForm = {
  name: "",
  vendor: "",
  category: "",
  main_category: "",
  sub_category: "",
  price: "",
  item_code: "",
  UOM: "",
  Manufacture: "",
  type: "",
  Term: "",
  Remarks: "",
  description: "",
  tokopedia_url: "",
  shopee_url: "",
  whatsapp_url: "",
  official_url: "",
  image_urls: [],
};

const inputClass =
  "w-full rounded-xl border border-cyan-300/20 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10";

const selectClass =
  "w-full rounded-xl border border-cyan-300/20 bg-[#10283a] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10";

export default function AddItemPage() {
  const { loading: authLoading } = useRequireAuth(["admin", "procurement"]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<AddItemForm>(initialForm);
  const [categories, setCategories] = useState<string[]>([]);
  const [mainCategories, setMainCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      const { data, error } = await supabase
        .from("items")
        .select("category, main_category, sub_category");

      if (error) {
        console.error("Failed to load item categories:", error);
        return;
      }

      if (!active) return;

      const categorySet = new Set<string>();
      const mainSet = new Set<string>();
      const subSet = new Set<string>();

      data?.forEach((item) => {
        if (item.category) categorySet.add(item.category);
        if (item.main_category) mainSet.add(item.main_category);
        if (item.sub_category) subSet.add(item.sub_category);
      });

      setCategories(Array.from(categorySet).sort());
      setMainCategories(Array.from(mainSet).sort());
      setSubCategories(Array.from(subSet).sort());
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        alert("Sesi login tidak ditemukan. Silakan login kembali.");
        return;
      }

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          alert(`${file.name}: Format tidak didukung. Gunakan JPEG, PNG, atau WebP.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/admin/upload-item-image", {
            method: "POST",
            headers: { Authorization: `Bearer ${session.access_token}` },
            body: formData,
          });

          const result = await response.json();

          if (!response.ok || !result.success || !result.url) {
            alert(`${file.name}: ${result.error || "Gagal mengunggah gambar."}`);
            continue;
          }

          uploadedUrls.push(result.url as string);
        } catch (error) {
          console.error("Image upload request failed:", error);
          alert(`${file.name}: Terjadi kesalahan saat mengunggah gambar.`);
        }
      }

      if (uploadedUrls.length > 0) {
        setForm((current) => ({
          ...current,
          image_urls: [...current.image_urls, ...uploadedUrls],
        }));
      }
    } finally {
      setUploading(false);
      // Allow selecting the same file again if a previous upload failed.
      e.target.value = "";
    }
  }

  function removeImage(indexToRemove: number) {
    setForm((current) => ({
      ...current,
      image_urls: current.image_urls.filter((_, index) => index !== indexToRemove),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || uploading) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("items")
        .insert([
          {
            item_name: form.name,
            vendor: form.vendor,
            category: form.category,
            main_category: form.main_category,
            sub_category: form.sub_category,
            price: Number(form.price),
            item_code: form.item_code,
            UOM: form.UOM,
            Manufacture: form.Manufacture,
            type: form.type,
            Term: form.Term,
            Remarks: form.Remarks,
            description: form.description,
            tokopedia_url: form.tokopedia_url,
            shopee_url: form.shopee_url,
            whatsapp_url: form.whatsapp_url,
            official_url: form.official_url,
            image_url: form.image_urls[0] || null,
            image_urls: form.image_urls,
          },
        ])
        .select()
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      if (user?.email && data) {
        await createAuditLog({
          userEmail: user.email,
          action: "CREATE_ITEM",
          itemId: data.id,
          itemName: data.item_name,
          newData: data,
        });
      }

      alert("Item added!");
      setForm(initialForm);
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Terjadi kesalahan saat menyimpan item.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#031426] text-sm text-cyan-100">
        Checking permissions...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#031426] px-4 py-8 text-white sm:px-6 lg:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,112,166,0.24),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(0,190,220,0.12),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(50,180,220,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(50,180,220,0.05)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <section className="relative mx-auto w-full max-w-2xl rounded-2xl border border-cyan-300/20 bg-[#041a2c]/90 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7 lg:p-8">
        <header className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Add New Item
            </h1>
            <p className="mt-1 text-xs font-medium text-cyan-300">
              Create New Catalog Item
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/[0.06] px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/10"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Item Name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="item_code"
            placeholder="Item Code"
            value={form.item_code}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="vendor"
            placeholder="Vendor"
            value={form.vendor}
            onChange={handleChange}
            className={inputClass}
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="">Select Category (optional)</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            name="main_category"
            value={form.main_category}
            onChange={(e) => {
              setForm((current) => ({
                ...current,
                main_category: e.target.value,
                sub_category: "",
              }));
            }}
            className={selectClass}
          >
            <option value="">Select Main Category</option>
            {mainCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            {!mainCategories.includes("Main Material") && (
              <option value="Main Material">Main Material</option>
            )}
            {!mainCategories.includes("Asset") && (
              <option value="Asset">Asset</option>
            )}
          </select>

          <select
            name="sub_category"
            value={form.sub_category}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="">Select Sub Category</option>
            {subCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              name="price"
              type="number"
              min="0"
              step="any"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="UOM"
              placeholder="UOM"
              value={form.UOM}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <input
            name="Manufacture"
            placeholder="Manufacture"
            value={form.Manufacture}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="type"
            placeholder="Type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="Term"
            placeholder="Term"
            value={form.Term}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="Remarks"
            placeholder="Remarks"
            value={form.Remarks}
            onChange={handleChange}
            className={inputClass}
          />

          <section className="space-y-4 border-t border-cyan-300/15 pt-5">
            <h2 className="text-sm font-bold tracking-wide text-cyan-300">
              Marketplace Links
            </h2>
            <input
              name="tokopedia_url"
              placeholder="Tokopedia URL"
              value={form.tokopedia_url}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="shopee_url"
              placeholder="Shopee URL"
              value={form.shopee_url}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="whatsapp_url"
              placeholder="WhatsApp URL"
              value={form.whatsapp_url}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="official_url"
              placeholder="Official Website URL"
              value={form.official_url}
              onChange={handleChange}
              className={inputClass}
            />
          </section>

          <section className="space-y-3 border-t border-cyan-300/15 pt-5">
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <ImagePlus size={16} />
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-cyan-100`}
            />
            <p className="text-xs text-slate-400">
              JPEG, PNG, atau WebP. Gambar berukuran 200 KB atau lebih akan dicoba dikompresi otomatis.
            </p>

            {form.image_urls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.image_urls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="group relative overflow-hidden rounded-xl border border-cyan-300/20 bg-white/[0.04] p-2"
                  >
                    <Image
                      src={url}
                      alt={`Preview gambar ${index + 1}`}
                      width={300}
                      height={220}
                      className="h-32 w-full rounded-lg object-contain"
                    />
                    <span className="mt-2 block truncate text-xs text-slate-400">
                      Gambar {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Hapus gambar ${index + 1} dari form`}
                      className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-300/30 bg-red-500 text-white shadow transition hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3 border-t border-cyan-300/15 pt-5">
            <label htmlFor="description" className="block text-sm font-bold text-cyan-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              rows={8}
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} min-h-40 resize-y`}
            />
          </section>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3.5 text-sm font-bold text-cyan-200 transition hover:bg-cyan-500/20 hover:shadow-[0_0_25px_rgba(0,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : loading ? "Saving..." : "Add Item"}
          </button>
        </form>
      </section>
    </main>
  );
}
