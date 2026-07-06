"use client";

import type { CatalogItem } from "@/types/catalog";

type MobileDetailProps = {
  theme: "light" | "dark";

  item: CatalogItem;

  onClose: () => void;
};

export default function MobileDetail({
  theme,
  item,
  onClose,
}: MobileDetailProps) {
  return (
    <main
      className={
        theme === "dark"
          ? "min-h-screen bg-[#02111f] text-white"
          : "min-h-screen bg-white text-slate-900"
      }
    >
      Mobile Detail
    </main>
  );
}