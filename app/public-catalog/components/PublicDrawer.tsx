"use client";

import { useState } from "react";

type PublicDrawerProps = {
  theme: "light" | "dark";

  open: boolean;

  onClose: () => void;

  hierarchicalCategories: Record<
    string,
    string[]
  >;

  selectedCategory: string;

  handleCategoryChange: (
    value: string
  ) => void;

  onSuggestionClick: () => void;
};

export default function PublicDrawer({
  theme,
  open,
  onClose,

  hierarchicalCategories,
  selectedCategory,
  handleCategoryChange,

  onSuggestionClick,

}: PublicDrawerProps) {

  const [
    showCategory,
    setShowCategory,
  ] = useState(false);

  const [
  expandedCategory,
  setExpandedCategory,
] = useState<string | null>(null);

const [
  categorySearch,
  setCategorySearch,
] = useState("");

  function toggleCategory(
  category: string
) {
  setExpandedCategory((prev) =>
    prev === category
      ? null
      : category
  );
}

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className={`
          absolute
          left-0
          top-0

          h-full
          w-[85%]
          max-w-[340px]

          overflow-y-auto

          ${
            theme === "dark"
              ? "bg-[#04192c] text-white"
              : "bg-white text-slate-900"
          }
        `}
      >

        {/* HEADER */}

        <div
          className={`
            relative
            px-6
            pt-8
            pb-8

            border-b

            ${
              theme === "dark"
                ? "border-cyan-400/10"
                : "border-slate-200"
            }
          `}
        >

          <button
            onClick={onClose}
            className="
              absolute
              top-5
              right-5

              text-3xl

              opacity-60

              hover:opacity-100

              transition
            "
          >
            ×
          </button>

          <img
            src="/logo.png"
            className="
              h-16
              mx-auto
              object-contain
            "
          />

          <h2
            className="
              mt-5
              text-center
              text-xl
              font-bold
            "
          >
            ITEM CATALOG RATA
          </h2>

          <p
            className={`
              mt-2
              text-center
              text-sm

              ${
                theme === "dark"
                  ? "text-white/60"
                  : "text-slate-500"
              }
            `}
          >
            Procurement System
          </p>

        </div>

        {/* MENU */}

        <div className="px-6 py-4">

          {/* BERANDA */}

          <button
            onClick={() => {
              onClose();
              window.location.href = "/";
            }}
            className="w-full text-left py-4 text-lg font-medium"
          >
            Beranda
          </button>

          {/* CATEGORY */}

<button
  onClick={() =>
    setShowCategory(!showCategory)
  }
  className="
    w-full
    flex
    justify-between
    items-center
    py-4
    text-lg
  "
>
  <span>Category</span>

  <span>
    {showCategory ? "▾" : "▸"}
  </span>
</button>

{showCategory && (

<div className="mb-5">

  <input
    type="text"
    placeholder="Search category..."
    value={categorySearch}
    onChange={(e) =>
      setCategorySearch(
        e.target.value
      )
    }
    className={`
      w-full

      rounded-xl

      px-4
      py-3

      text-sm

      mb-4

      ${
        theme === "dark"
          ? "bg-[#08233b] border border-cyan-500/20"
          : "bg-slate-100 border"
      }
    `}
  />

  <div
    className="
      max-h-[45vh]

      overflow-y-auto

      rounded-xl
    "
  >

<button
  onClick={() => {
    handleCategoryChange("All");
    onClose();
  }}
  className={`
    w-full

    text-left

    px-4
    py-3

    rounded-xl

    mb-2

    transition

    ${
      selectedCategory === "All"
        ? theme === "dark"
          ? "bg-cyan-900 text-cyan-200 font-semibold"
          : "bg-blue-100 text-blue-700 font-semibold"
        : ""
    }
  `}
>
  All
</button>

{Object.entries(hierarchicalCategories)

  .filter(([main, subs]) => {

    const keyword =
      categorySearch.toLowerCase();

    const mainMatch =
      main
        .toLowerCase()
        .includes(keyword);

    const subMatch =
      subs.some((sub) =>
        sub
          .toLowerCase()
          .includes(keyword)
      );

    return (
      keyword === "" ||
      mainMatch ||
      subMatch
    );

  })

  .sort(([a], [b]) =>
    a.localeCompare(b)
  )

  .map(([main, subs]) => (

    <div
      key={main}
      className="mb-2"
    >

      <button
        onClick={() =>
          toggleCategory(main)
        }
        className={`
          w-full

          flex
          items-center
          justify-between

          px-4
          py-3

          rounded-xl

          transition

          ${
            selectedCategory === main
              ? theme === "dark"
                ? "bg-cyan-900 text-cyan-200 font-semibold"
                : "bg-blue-100 text-blue-700 font-semibold"
              : ""
          }
        `}
      >

        <span>
          {main}
        </span>

        <span>
          {expandedCategory === main
            ? "−"
            : "+"}
        </span>

      </button>

      {expandedCategory === main && (

  <div className="ml-5 mt-2">

    {subs.length === 0 ? (

      <button
        onClick={() => {

          handleCategoryChange(main);

          onClose();

        }}
        className={`
          w-full

          text-left

          px-3
          py-3

          rounded-lg

          transition

          ${
            selectedCategory === main
              ? theme === "dark"
                ? "text-cyan-300 font-semibold"
                : "text-blue-600 font-semibold"
              : ""
          }
        `}
      >
        View All
      </button>

    ) : (

      subs
        .sort()

        .map((sub) => (

          <button
            key={sub}
            onClick={() => {

              handleCategoryChange(
                sub
              );

              onClose();

            }}
            className={`
              w-full

              text-left

              px-3
              py-3

              rounded-lg

              transition

              ${
                selectedCategory === sub
                  ? theme === "dark"
                    ? "text-cyan-300 font-semibold"
                    : "text-blue-600 font-semibold"
                  : ""
              }
            `}
          >

            └ {sub}

          </button>

        ))

    )}

  </div>

)}

    </div>

  ))}

  </div>

</div>

)}

                   {/* SUGGESTIONS */}

          <button
            onClick={() => {
              onClose();
              onSuggestionClick();

  }}
  className="
    w-full
    text-left
    py-4
    text-lg
  "
>
  Suggestions
</button>

        </div>

      </div>

    </div>
  );
}