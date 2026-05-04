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
  manufacture?: string;
  type?: string;
  term?: string;
  remarks?: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategory, setShowCategory] = useState(false);

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

  // ESC close popup
  useEffect(() => {
    const handleEsc = (e: any) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <main className="bg-gray-100 min-h-screen text-black">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-6 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <img src="/logo.png" className="h-8 object-contain" />

          <span className="font-semibold text-lg">
            Item Catalog
          </span>

          {/* CATEGORY */}
          <div className="relative">
            <button
              onClick={() => setShowCategory(!showCategory)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
            >
              {selectedCategory} ▾
            </button>

            {showCategory && (
              <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-52 max-h-64 overflow-y-auto z-50">

                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategory(false);
                    }}
                    className={`px-4 py-2 cursor-pointer text-sm ${
                      selectedCategory === cat
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>

        {/* SEARCH */}
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

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer overflow-hidden"
            >
              <div className="h-44 flex items-center justify-center bg-gray-50">
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

                <p className="text-xs text-gray-400">
                  {item.vendor || "-"}
                </p>

                <p className="text-green-600 font-bold mt-2">
                  Rp {formatRupiah(item.price)}
                </p>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* FULLSCREEN POPUP */}
      {selectedItem && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">

          {/* TOP BAR */}
          <div className="sticky top-0 bg-white border-b px-6 py-3 flex justify-between items-center">

            <div className="font-semibold">
              Detail Item
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="text-xl"
            >
              ✖
            </button>

          </div>

          {/* CONTENT */}
          <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

            {/* IMAGE */}
            <div className="bg-gray-50 rounded-xl flex items-center justify-center p-6">
              <img
                src={selectedItem.image_url}
                className="max-h-[400px] object-contain"
              />
            </div>

            {/* DETAIL */}
            <div>

              <h1 className="text-2xl font-bold mb-2">
                {selectedItem.item_name}
              </h1>

              <p className="text-gray-500 mb-4">
                {selectedItem.category}
              </p>

              <p className="text-green-600 text-3xl font-bold mb-6">
                Rp {formatRupiah(selectedItem.price)}
              </p>

              <div className="space-y-2 text-sm">

                <p><b>Vendor:</b> {selectedItem.vendor || "-"}</p>
                <p><b>Code:</b> {selectedItem.item_code || "-"}</p>
                <p><b>UOM:</b> {selectedItem.uom || "-"}</p>
                <p><b>Manufacture:</b> {selectedItem.manufacture || "-"}</p>
                <p><b>Type:</b> {selectedItem.type || "-"}</p>
                <p><b>Term:</b> {selectedItem.term || "-"}</p>
                <p><b>Remarks:</b> {selectedItem.remarks || "-"}</p>

              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Description</h3>

                <p className="text-sm text-gray-700 whitespace-pre-line">
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