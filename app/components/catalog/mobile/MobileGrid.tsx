"use client";

import MobileItemCard from "./MobileItemCard";
import { useRouter } from "next/navigation";

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
const router = useRouter();
  return (
    <section className="px-4 pb-8">

      <div className="grid grid-cols-2 gap-4">

        {items.map((item) => (

          <MobileItemCard
    key={item.id}
    item={item}
    theme={theme}
    onClick={() => {
    router.push(`/catalog/${item.slug}`);
}}
/>

        ))}

      </div>

    </section>
  );
}