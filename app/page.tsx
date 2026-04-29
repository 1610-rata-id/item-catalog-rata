"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID").format(number || 0);
}

type Item = {
  id: number;
  item_name: string;
  category: string;
  image_url: string;
  price: number;
  vendor?: string;
  item_code?: string;
  uom?: string;
  description?: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    getItems();
  }, []);

  async function getItems() {
    const { data, error } = await supabase.from("items").select("*");

    if (error) {
      console.error(error.message);
      return;
    }

    const mapped = (data || []).map((item: any) => ({
      ...item,
      uom: item.UOM,
    }));

    setItems(mapped);

    // auto select pertama
    if (mapped.length > 0) {
      setSelectedItem(mapped[0]);
    }
  }

  const categories = ["All", ...new Set(items.map((i) => i.category))];

  const filteredItems = items.filter((item) => {
    const matchSearch = item.item_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <main className="bg-gray-100 min-h-screen text-black">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-6 py-3 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-8 object-contain" />
          <span className="font-semibold text-lg">
            VM Dental Product Database
          </span>
        </div>

        <div className="relative w-72">
          <input
            type="text"
            placeholder="Cari item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-4 pr-10 rounded-lg border text-black"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2 text-gray-400"
            >
              ✖
            </button>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">

        {/* SIDEBAR */}
        <aside className="hidden md:block w-64 bg-white rounded-2xl p-4 shadow-sm h-fit sticky top-20">
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

        {/* LIST + DETAIL */}
        <div className="flex-1 flex gap-6">

          {/* LIST ITEM */}
          <div className="w-full lg:w-2/3">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden ${
                    selectedItem?.id === item.id ? "ring-2 ring-black" : ""
                  }`}
                >
                  <div className="h-40 flex items-center justify-center bg-gray-50">
                    <img
                      src={item.image_url}
                      className="max-h-full object-contain"
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="text-sm font-semibold line-clamp-2">
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

          {/* DETAIL PANEL */}
          <div className="hidden lg:block w-1/3">
            {selectedItem ? (
              <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">

                <div className="h-52 flex items-center justify-center bg-gray-50 mb-4">
                  <img
                    src={selectedItem.image_url}
                    className="max-h-full object-contain"
                  />
                </div>

                <h2 className="text-xl font-bold">
                  {selectedItem.item_name}
                </h2>

                <p className="text-gray-500">
                  {selectedItem.category}
                </p>

                <div className="mt-3 text-sm space-y-1">
                  <p><b>Vendor:</b> {selectedItem.vendor || "-"}</p>
                  <p><b>Code:</b> {selectedItem.item_code || "-"}</p>
                  <p><b>UOM:</b> {selectedItem.uom || "-"}</p>
                </div>

                <p className="text-green-600 text-2xl font-bold mt-4">
                  Rp {formatRupiah(selectedItem.price)}
                </p>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {selectedItem.description || "Tidak ada deskripsi"}
                  </p>
                </div>

              </div>
            ) : (
              <div className="text-gray-400 text-center mt-20">
                Pilih item untuk melihat detail
              </div>
            )}
          </div>

        </div>
      </div>

    </main>
  );
}