"use client";

import React from "react";
import type { CatalogItem } from "@/types/catalog";

type PublicItemCardProps = {
  theme: "light" | "dark";

  item: CatalogItem;

  setSelectedItem: React.Dispatch<any>;

  setActiveImage: React.Dispatch<any>;
};

export default function PublicItemCard({
  theme,
  item,

  setSelectedItem,
  setActiveImage,

}: PublicItemCardProps) {
  return (
    <div
     onClick={() => {

  setSelectedItem(item);

  setActiveImage(
    item.image_urls?.[0] ||
    item.image_url ||
    null
  );

}}
      className={`
        cursor-pointer

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
      {/* IMAGE */}

      <div
        className={`
          aspect-square

          flex
          items-center
          justify-center

          overflow-hidden

          ${
            theme === "dark"
              ? "bg-[#0b2745]"
              : "bg-slate-50"
          }
        `}
      >
        {item.image_url ? (

          <img
            src={item.image_url}
            alt={item.item_name}
            loading="lazy"
            className="
              w-full
              h-full

              object-cover

              transition-transform
              duration-500

              hover:scale-105
            "
          />

        ) : (

          <div
            className="
              text-sm
              text-slate-400
            "
          >
            No Image
          </div>

        )}
      </div>

      {/* CONTENT */}

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
          className={`
            mt-3

            text-xs

            uppercase

            tracking-[2px]

            ${
              theme === "dark"
                ? "text-cyan-300"
                : "text-blue-600"
            }
          `}
        >
          {item.category}
        </p>

      </div>

    </div>
  );
}