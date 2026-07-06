"use client";

import { useState } from "react";

type MobileCategoryProps = {
  theme: "light" | "dark";

  selectedCategory: string;

  handleCategoryChange: (
    value: string
  ) => void;

  hierarchicalCategories: Record<
    string,
    string[]
  >;
};

export default function MobileCategory({
  theme,
  selectedCategory,
  handleCategoryChange,
  hierarchicalCategories,
}: MobileCategoryProps) {

  const [open, setOpen] =
    useState(false);

  return (

    <section className="px-4 pt-4">

      <button
        onClick={() =>
          setOpen(!open)
        }
        className={`
          w-full

          px-4
          py-3

          rounded-2xl

          flex
          justify-between
          items-center

          ${
            theme === "dark"
              ? `
                  bg-[#08233d]
                  border border-cyan-400/10
                `
              : `
                  bg-white
                  border border-slate-200
                `
          }
        `}
      >

        <span>

          {selectedCategory === "All"
            ? "Category"
            : selectedCategory}

        </span>

        <span>

          {open ? "▲" : "▼"}

        </span>

      </button>

      {open && (

        <div
          className={`
            mt-3

            rounded-2xl

            overflow-hidden

            ${
              theme === "dark"
                ? `
                    bg-[#08233d]
                    border border-cyan-400/10
                  `
                : `
                    bg-white
                    border border-slate-200
                  `
            }
          `}
        >

          <button
            onClick={() => {

              handleCategoryChange(
                "All"
              );

              setOpen(false);

            }}
            className="
              w-full

              px-4
              py-3

              text-left
            "
          >
            All
          </button>

          {Object.keys(
            hierarchicalCategories
          )

            .sort()

            .map((cat) => (

              <button
                key={cat}

                onClick={() => {

                  handleCategoryChange(
                    cat
                  );

                  setOpen(false);

                }}

                className="
                  w-full

                  px-4
                  py-3

                  text-left

                  border-t

                  border-white/10
                "
              >

                {cat}

              </button>

            ))}

        </div>

      )}

    </section>

  );

}