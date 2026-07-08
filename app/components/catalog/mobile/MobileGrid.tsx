"use client";

import MobileItemCard from "./MobileItemCard";
import Link from "next/link";

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID").format(number || 0);
}

import type { CatalogItem } from "@/types/catalog";

type MobileGridProps = {
  theme: "light" | "dark";
  items: CatalogItem[];
};

export default function MobileGrid({
  theme,
  items,
}: MobileGridProps) { 

  return (
    <section className="px-4 pb-8">

      <div className="grid grid-cols-2 gap-4">

        {items.map((item) => (

          <Link
  key={item.id}
  href={`/catalog/${item.slug}`}
  className="block"
>

  <MobileItemCard
    item={item}
    theme={theme}
  />

</Link>

        ))}

      </div>

    </section>
  );
}