"use client";

import { useEffect, useState, useRef } from "react";
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

  const catalogRef = useRef<HTMLDivElement>(null);

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

  // ESC CLOSE
  useEffect(() => {
    const esc = (e: any) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <main className="text-black">

      {/* 🔥 HERO SECTION */}
      <div className="relative h-screen">

        {/* BACKGROUND */}
        <img
          src="/hero.jpg" // 🔥 GANTI nama file kamu (gambar merah tadi)
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        {/* HEADER */}
        <div className="absolute top-0 w-full z-50 flex justify-between items-center px-8 py-4 text-white">

          <img src="/logo.png" className="h-10" />

          <div className="flex items-center gap-6">

            {/* CATEGORY */}
            <div className="relative">
              <button
                onClick={() => setShowCategory(!showCategory)}
                className="hover:underline"
              >
                Category
              </button>

              {showCategory && (
                <div className="absolute top-10 left-0 bg-white text-black rounded-lg shadow-lg w-52 max-h-64 overflow-y-auto">

                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategory(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {cat}
                    </div>
                  ))}

                </div>
              )}
            </div>

            <button className="hover:underline">Vendor</button>

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Cari item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-full text-black w-56"
            />

          </div>
        </div>

        {/* HERO TEXT */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center">

          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            ITEM CATALOG
          </h1>

          <p className="text-lg mb-6">
            By Procurement
          </p>

          <button
            onClick={() =>
              catalogRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Explore Catalog →
          </button>

        </div>

      </div>

      {/* 🔥 CATALOG */}
      <div ref={catalogRef} className="bg-gray-100 py-10 px-6">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-2xl font-bold mb-6">
            Product List
          </h2>

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
      </div>

      {/* 🔥 FULL PAGE DETAIL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">

          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-semibold">Detail Item</span>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-xl"
            >
              ✖
            </button>
          </div>

          <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

            <div className="bg-gray-50 rounded-xl flex items-center justify-center p-6">
              <img
                src={selectedItem.image_url}
                className="max-h-[400px]"
              />
            </div>

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