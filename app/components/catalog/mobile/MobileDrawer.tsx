"use client";

import { useState } from "react";

type MobileDrawerProps = {
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

  vendors: string[];

  selectedVendor: string;

  handleVendorChange: (
    value: string
  ) => void;

  onSuggestionClick: () => void;

  onLogout: () => Promise<void>;

  onDashboardClick: () => void;

onAddItemClick: () => void;
};

export default function MobileDrawer({
  theme,
  open,
  onClose,

  hierarchicalCategories,
  selectedCategory,
  handleCategoryChange,

  vendors,
  selectedVendor,
  handleVendorChange,

  onSuggestionClick,

  onLogout,

  onDashboardClick,

onAddItemClick,

}: MobileDrawerProps) {

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

  const [
    showVendor,
    setShowVendor,
  ] = useState(false);

  const [
  vendorSearch,
  setVendorSearch,
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

          {/* VENDOR */}

<button
  onClick={() =>
    setShowVendor(!showVendor)
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
  <span>Vendor</span>

  <span>
    {showVendor ? "▾" : "▸"}
  </span>

</button>

{showVendor && (

<div className="mb-5">

  <input
    type="text"
    placeholder="Search vendor..."
    value={vendorSearch}
    onChange={(e) =>
      setVendorSearch(
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
      max-h-[40vh]

      overflow-y-auto

      rounded-xl
    "
  >

<button
  onClick={() => {
    handleVendorChange("All");
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
      selectedVendor === "All"
        ? theme === "dark"
          ? "bg-cyan-900 text-cyan-200 font-semibold"
          : "bg-blue-100 text-blue-700 font-semibold"
        : ""
    }
  `}
>
  All Vendors
</button>

{vendors

  .filter(
    (vendor) =>
      vendor !== "All" &&
      vendor
        .toLowerCase()
        .includes(
          vendorSearch.toLowerCase()
        )
  )

  .sort()

  .map((vendor) => (

    <button
      key={vendor}
      onClick={() => {

        handleVendorChange(
          vendor
        );

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
          selectedVendor === vendor
            ? theme === "dark"
              ? "bg-cyan-900 text-cyan-200 font-semibold"
              : "bg-blue-100 text-blue-700 font-semibold"
            : ""
        }
      `}
    >

      {vendor}

    </button>

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

        {/* ADMIN */}

        <div
          className={`
            mt-2

            border-t

            ${
              theme === "dark"
                ? "border-cyan-400/10"
                : "border-slate-200"
            }
          `}
        >

          <div className="px-6 py-6">

            <p
              className={`
                text-xs
                uppercase
                tracking-[0.2em]
                mb-4

                ${
                  theme === "dark"
                    ? "text-white/40"
                    : "text-slate-400"
                }
              `}
            >
              ADMIN
            </p>

            <button
  onClick={() => {
    onClose();
    onDashboardClick();
  }}
  className="
    w-full
    text-left
    py-4
    text-lg

    transition

    hover:opacity-70
  "
>
  Dashboard
</button>

            <button
  onClick={() => {
    onClose();
    onAddItemClick();
  }}
  className="
    w-full
    text-left
    py-4
    text-lg

    transition

    hover:opacity-70
  "
>
  Add Item
</button>

          </div>

        </div>

        {/* FOOTER */}

        <div
          className={`
            mt-auto

            border-t

            ${
              theme === "dark"
                ? "border-cyan-400/10"
                : "border-slate-200"
            }
          `}
        >

          <button
            onClick={async () => {
              onClose();
              await onLogout();
            }}
            className="
              w-full

              px-6
              py-5

              text-left

              text-lg
              font-semibold

              text-red-400

              transition

              hover:opacity-70
            "
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}