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
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

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

  // ZOOM
  const handleWheel = (e: any) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom((z) => Math.min(3, Math.max(1, z + delta)));
  };

  const handleMouseDown = (e: any) => {
    dragging.current = true;
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: any) => {
    if (!dragging.current) return;

    setPosition({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleDoubleClick = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closePopup = () => {
    setSelectedItem(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <main className="bg-gray-100 min-h-screen text-black">

      {/* 🔥 HEADER WITH LOGO */}
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
            className="w-full p-2 pl-4 pr-10 rounded-lg border text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
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
          <h2 className="font-bold text-lg mb-4 text-black">Kategori</h2>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg mb-1 text-sm ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* CONTENT */}
        <div className="flex-1">

          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Item Catalog
          </h1>

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

                  <p className="text-green-600 font-bold mt-2">
                    Rp {formatRupiah(item.price)}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* POPUP */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="bg-white w-full md:max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col relative">

            <button
              onClick={closePopup}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow"
            >
              ✖
            </button>

            <div
              className="w-full h-64 bg-gray-100 overflow-hidden cursor-grab flex items-center justify-center"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
            >
              <img
                src={selectedItem.image_url}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                }}
                className="max-h-full object-contain select-none pointer-events-none"
              />
            </div>

            <div className="p-5 overflow-y-auto">

              <h2 className="text-xl font-bold">
                {selectedItem.item_name}
              </h2>

              <p className="text-gray-500">
                {selectedItem.category}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm mt-3 text-gray-700">
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
          </div>
        </div>
      )}
    </main>
  );
}