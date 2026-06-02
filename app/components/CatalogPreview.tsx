"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Item {
  id: number;
  item_name: string;
  category: string;
  vendor: string;
  image_url: string | null;
  slug: string;
}

export default function CatalogPreview() {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestItems();
  }, []);

  async function fetchLatestItems() {
    const { data, error } = await supabase
      .from("items")
      .select(`
        id,
        item_name,
        category,
        vendor,
        image_url,
        slug
      `)
      .order("created_at", { ascending: false })
      .limit(6);

    if (!error && data) {
      setItems(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">
            Latest Catalog Items
          </h2>

          <p className="text-gray-400">
            Loading catalog...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-10">

          <div>
            <h2 className="text-3xl font-bold">
              Latest Catalog Items
            </h2>

            <p className="text-gray-400 mt-2">
              Recently added procurement items.
            </p>
          </div>

          <button
            onClick={() => router.push("/public-catalog")}
            className="border border-white/20 px-5 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            View Full Catalog
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {items.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                router.push(`/public-catalog/${item.slug}`)
              }
              className="cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/30 transition"
            >

              <div className="aspect-[4/3] bg-zinc-900">

                <img
                  src={
                    item.image_url ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={item.item_name}
                  className="w-full h-full object-cover"
                />

              </div>

              <div className="p-5">

                <p className="text-xs text-gray-400">
                  {item.category}
                </p>

                <h3 className="mt-2 font-semibold line-clamp-2">
                  {item.item_name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {item.vendor || "No Vendor"}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}