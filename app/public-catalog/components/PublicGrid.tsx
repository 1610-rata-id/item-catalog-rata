"use client";

import Link from "next/link";

import type { CatalogItem } from "@/types/catalog";

import PublicItemCard from "./PublicItemCard";

type PublicGridProps = {
  theme: "light" | "dark";

  items: CatalogItem[];

  setSelectedItem: React.Dispatch<any>;

  setActiveImage: React.Dispatch<any>;
};

export default function PublicGrid({
  theme,
  items,

  setSelectedItem,
  setActiveImage,

}: PublicGridProps) {
  return (
    <section className="px-4 pb-8">

      <div className="grid grid-cols-2 gap-4">

        {items.map((item) => (

   <div
  key={item.id}
  className="block"
>

           <PublicItemCard
    item={item}
    theme={theme}
    setSelectedItem={setSelectedItem}
    setActiveImage={setActiveImage}
  />

</div>

        ))}

      </div>

    </section>
  );
}