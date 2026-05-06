"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID").format(number || 0);
}

export default function Catalog() {
  const router = useRouter();
  const params = useSearchParams();

  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState(params.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");

  const [showCategory, setShowCategory] = useState(false);
  const [showVendor, setShowVendor] = useState(false);

  const [catSearch, setCatSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");

  const catRef = useRef<any>(null);
  const vendorRef = useRef<any>(null);

  useEffect(() => {
    getItems();
  }, []);

  async function getItems() {
    const { data } = await supabase.from("items").select("*");
    setItems(data || []);
  }

  // CLICK OUTSIDE CLOSE
  useEffect(() => {
    const close = (e: any) => {
      if (!catRef.current?.contains(e.target)) setShowCategory(false);
      if (!vendorRef.current?.contains(e.target)) setShowVendor(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const categories = ["All", ...new Set(items.map(i => i.category))];
  const vendors = ["All", ...new Set(items.map(i => i.vendor))];

  const filteredItems = items.filter((item) => {
    return (
      item.item_name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (selectedVendor === "All" || item.vendor === selectedVendor)
    );
  });

  return (
    <main className="bg-gray-100 min-h-screen font-[Poppins] text-black">

      {/* HEADER */}
      <div className="sticky top-0 bg-white shadow-sm px-6 py-3 flex justify-between items-center z-50">

        <img src="/logo.png" className="h-8 cursor-pointer" onClick={() => router.push("/")} />

        <div className="flex items-center gap-6 text-sm">

          <button onClick={() => router.push("/")}>Beranda</button>

          {/* CATEGORY */}
          <div ref={catRef} className="relative">
            <button onClick={() => setShowCategory(!showCategory)}>Category ▾</button>

            {showCategory && (
              <div className="absolute bg-white shadow-lg rounded-lg w-56 max-h-64 overflow-y-auto">

                <input
                  placeholder="Search..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full p-2 border-b"
                />

                {categories
                  .filter(c => c.toLowerCase().includes(catSearch.toLowerCase()))
                  .map(cat => (
                    <div
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategory(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {cat}
                    </div>
                  ))}

              </div>
            )}
          </div>

          {/* VENDOR */}
          <div ref={vendorRef} className="relative">
            <button onClick={() => setShowVendor(!showVendor)}>Vendor ▾</button>

            {showVendor && (
              <div className="absolute bg-white shadow-lg rounded-lg w-56 max-h-64 overflow-y-auto">

                <input
                  placeholder="Search..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="w-full p-2 border-b"
                />

                {vendors
                  .filter(v => v?.toLowerCase().includes(vendorSearch.toLowerCase()))
                  .slice(0, 5)
                  .map(v => (
                    <div
                      key={v}
                      onClick={() => {
                        setSelectedVendor(v);
                        setShowVendor(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {v}
                    </div>
                  ))}

              </div>
            )}
          </div>

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari item..."
            className="px-4 py-2 border rounded-lg"
          />

        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm">
            <img src={item.image_url} className="h-40 mx-auto object-contain" />
            <h2 className="text-sm font-semibold mt-2">{item.item_name}</h2>
            <p className="text-xs text-gray-500">{item.category}</p>
            <p className="text-xs text-gray-400">{item.vendor}</p>
            <p className="text-green-600 font-bold mt-1">
              Rp {formatRupiah(item.price)}
            </p>
          </div>
        ))}

      </div>

    </main>
  );
}