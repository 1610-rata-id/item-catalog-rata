"use client";

import type { CatalogItem } from "@/types/catalog";

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID").format(number || 0);
}

type MobileItemCardProps = {
  theme: "light" | "dark";
  item: CatalogItem;
};

export default function MobileItemCard({
  theme,
  item,
}: MobileItemCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        overflow-hidden

        transition-all
        duration-300

        active:scale-[0.98]

        ${
          theme === "dark"
            ? `
                bg-[#08233d]
                border border-cyan-400/10
                shadow-[0_0_25px_rgba(0,255,255,0.05)]
              `
            : `
                bg-white
                border border-slate-200
                shadow-md
              `
        }
      `}
    >
      <img
        src={item.image_url || "/no-image.png"}
        alt={item.item_name}
        className="
          w-full
          aspect-square
          object-cover
        "
      />

      <div className="p-4">

        <h3
          className="
            text-sm
            font-semibold
            leading-5
            line-clamp-2
            min-h-[40px]
          "
        >
          {item.item_name}
        </h3>

        <p
          className="
            mt-2
            text-xs
            opacity-70
            truncate
          "
        >
          {item.vendor}
        </p>

        <p
          className={`
            mt-4
            text-base
            font-bold

            ${
              theme === "dark"
                ? "text-cyan-300"
                : "text-green-600"
            }
          `}
        >
          Rp {formatRupiah(item.price)}
        </p>

      </div>
    </div>
  );
}