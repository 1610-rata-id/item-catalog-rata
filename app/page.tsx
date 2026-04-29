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

  // 🔥 ZOOM STATE
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

  // 🔥 HANDLE ZOOM SCROLL
  const handleWheel = (e: any) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom((z) => Math.min(3, Math.max(1, z + delta)));
  };

  // 🔥 DRAG START
  const handleMouseDown = (e: any) => {
    dragging.current = true;
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // 🔥 DRAG MOVE
  const handleMouseMove = (e: any) => {
    if (!dragging.current) return;

    setPosition({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  };

  // 🔥 DRAG END
  const handleMouseUp = () => {
    dragging.current = false;
  };

  // 🔥 DOUBLE CLICK RESET
  const handleDoubleClick = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // 🔥 RESET SAAT CLOSE
  const closePopup = () => {
    setSelectedItem(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <main className="bg-gray-100 min-h-screen">

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

  {/* 🔥 TEST VERSION */}
  <h1 className="text-red-500 text-xl">
    VERSION: FINAL-TEST-123
  </h1>

  <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">
    Item Catalog
  </h1>

          {/* SEARCH */}
          <div className="sticky top-0 z-40 bg-gray-100 pb-4">
            <div className="relative max-w-xl">
              <span className="absolute left-4 top-3 text-gray-400">🔍</span>

              <input
                type="text"
                placeholder="Cari item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 pr-10 rounded-full border bg-white"
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

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">

            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition cursor-pointer overflow-hidden"
              >
                <img
                  src={item.image_url}
                  className="w-full h-44 object-contain bg-white"
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

      {/* POPUP */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="bg-white w-full md:max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">

            <button
              onClick={closePopup}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow"
            >
              ✖
            </button>

            {/* 🔥 ADVANCED IMAGE */}
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
                className="max-h-full object-contain select-none pointer-events-none transition-transform duration-100"
              />
            </div>

            <div className="p-5 overflow-y-auto">

              <h2 className="text-xl font-bold">
                {selectedItem.item_name}
              </h2>

              <p className="text-gray-500">
                {selectedItem.category}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
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