"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔥 DEBUG ENV
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY:", supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error("ENV ERROR: Supabase URL / KEY tidak terbaca");
}

const supabase = createClient(
  supabaseUrl || "",
  supabaseKey || ""
);

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID").format(number || 0);
}

// 🔥 TYPE (UPDATED)
type Item = {
  id: number;
  item_name: string;
  category: string;
  image_url: string;
  price: number;
  vendor?: string;
  item_code?: string;
  uom?: string; // ✅ NEW FIELD
  description?: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getItems();
  }, []);

  async function getItems() {
    const { data, error } = await supabase.from("items").select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setErrorMsg("Data kosong dari Supabase");
    }

    setItems(data || []);
  }

  const categories = ["All", ...new Set(items.map((i) => i.category))];

  const filteredItems = items.filter((item) => {
    const matchSearch = (item.item_name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <main className="bg-gray-100 min-h-screen">

      {/* 🔥 DEBUG */}
      <div className="p-4 text-xs text-red-500">
        <p>ENV URL: {supabaseUrl || "❌ undefined"}</p>
        <p>ENV KEY: {supabaseKey ? "✅ loaded" : "❌ undefined"}</p>
        {errorMsg && <p>ERROR: {errorMsg}</p>}
      </div>

      <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">

        {/* SIDEBAR */}
        <aside className="hidden md:block w-64 bg-white rounded-2xl p-4 shadow-sm h-fit sticky top-6">
          <h2 className="font-bold text-lg mb-4">Kategori</h2>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg mb-1 text-sm ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* CONTENT */}
        <div className="flex-1">

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-black">
              Item Catalog
            </h1>
          </div>

          {/* SEARCH */}
          <div className="sticky top-0 z-40 bg-gray-100 pb-4">
            <div className="relative max-w-xl">
              <span className="absolute left-4 top-3 text-gray-400">🔍</span>

              <input
                type="text"
                placeholder="Cari item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 pr-10 rounded-full border border-gray-300 bg-white text-black shadow-sm"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-3 text-gray-400"
                >
                  ✖
                </button>
              )}
            </div>
          </div>

          {/* MOBILE CATEGORY */}
          <div className="md:hidden mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-xl border bg-white"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* EMPTY */}
          {filteredItems.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              Tidak ada item ditemukan
            </div>
          )}

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <img
                  src={item.image_url}
                  className="w-full h-44 md:h-48 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-sm font-semibold text-black line-clamp-2">
                    {item.item_name}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.category}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    Rp {formatRupiah(item.price)}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* 🔥 POPUP FIXED */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full md:max-w-2xl rounded-2xl overflow-hidden relative max-h-[90vh] flex flex-col">

            {/* CLOSE */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow z-10"
            >
              ✖
            </button>

            {/* IMAGE */}
            <div className="w-full h-64 md:h-72 bg-gray-100">
              <img
                src={selectedItem.image_url}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5 overflow-y-auto">

              <h2 className="text-xl md:text-2xl font-bold text-black">
                {selectedItem.item_name}
              </h2>

              <p className="text-gray-500 mt-1">
                {selectedItem.category}
              </p>

              {/* INFO */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p><span className="font-medium">Vendor:</span> {selectedItem.vendor || "-"}</p>
                <p><span className="font-medium">Code:</span> {selectedItem.item_code || "-"}</p>
                <p><span className="font-medium">UOM:</span> {selectedItem.uom || "-"}</p> {/* ✅ NEW */}
              </div>

              {/* PRICE */}
              <p className="text-green-600 text-2xl font-bold mt-4">
                Rp {formatRupiah(selectedItem.price)}
              </p>

              {/* DESCRIPTION */}
              <div className="mt-4">
                <h3 className="font-semibold text-black mb-2">
                  Description
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
                  {selectedItem.description || "Tidak ada deskripsi"}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}