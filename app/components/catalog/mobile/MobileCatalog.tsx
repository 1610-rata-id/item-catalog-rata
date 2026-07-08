"use client";

import { useState } from "react";
import { X } from "lucide-react";

import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";
import MobileHero from "./MobileHero";
import MobileResult from "./MobileResult";
import MobileGrid from "./MobileGrid";
import MobilePagination from "./MobilePagination";

import type { CatalogItem } from "@/types/catalog";

type MobileCatalogProps = {
  theme: "light" | "dark";

  items: CatalogItem[];

  totalItems: number;

  page: number;

totalPages: number;

setPage: (
  page: number
) => void;

  search: string;

  handleSearch: (
    value: string
  ) => void;

  toggleTheme: () => void;

  selectedCategory: string;

  handleCategoryChange: (
    value: string
  ) => void;

  hierarchicalCategories: Record<
    string,
    string[]
  >;

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


export default function MobileCatalog({
  theme,

  items,

  totalItems,

  page,

totalPages,

setPage,

  search,

  handleSearch,

  toggleTheme,

  selectedCategory,

  handleCategoryChange,

  hierarchicalCategories,

  vendors,

selectedVendor,

handleVendorChange,

onSuggestionClick,
onLogout,

onDashboardClick,

onAddItemClick,

}: MobileCatalogProps) {

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  return (
    <main
      className={`
        min-h-screen

        ${
          theme === "dark"
            ? "bg-[#02111f] text-white"
            : "bg-[#f5f7fb] text-slate-900"
        }
      `}
    >

      <MobileHeader
        theme={theme}
        search={search}
        handleSearch={handleSearch}
        toggleTheme={toggleTheme}
        onOpenMenu={() =>
          setDrawerOpen(true)
        }
      />

      <MobileDrawer
        theme={theme}
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
       hierarchicalCategories={
  hierarchicalCategories
}

selectedCategory={
  selectedCategory
}

handleCategoryChange={
  handleCategoryChange
}

vendors={vendors}

selectedVendor={selectedVendor}

handleVendorChange={
  handleVendorChange
}

onSuggestionClick={
  onSuggestionClick
}

onLogout={onLogout}

onDashboardClick={
  onDashboardClick
}

onAddItemClick={
  onAddItemClick
}

      />

      <MobileHero
        theme={theme}
      />

      {(selectedCategory ||
  selectedVendor) && (

  <div className="px-4 pt-4 flex flex-wrap gap-2">

    {selectedCategory &&
 selectedCategory !== "All" && (

      <button
        onClick={() =>
          handleCategoryChange("All")
        }
        className={`
          flex
          items-center
          gap-2

          px-3
          py-2

          rounded-full

          text-sm
          font-medium

          ${
            theme === "dark"
              ? "bg-cyan-900 text-cyan-200"
              : "bg-blue-100 text-blue-700"
          }
        `}
      >

        {selectedCategory}

        <X size={14} />

      </button>

    )}

    {selectedVendor &&
 selectedVendor !== "All" && (

      <button
        onClick={() =>
          handleVendorChange("All")
        }
        className={`
          flex
          items-center
          gap-2

          px-3
          py-2

          rounded-full

          text-sm
          font-medium

          ${
            theme === "dark"
              ? "bg-cyan-900 text-cyan-200"
              : "bg-blue-100 text-blue-700"
          }
        `}
      >

        {selectedVendor}

        <X size={14} />

      </button>

    )}

  </div>

)}

      <MobileResult
        theme={theme}
        currentItems={items.length}
        totalItems={totalItems}
      />

      <MobileGrid
  theme={theme}
  items={items}
/>

<MobilePagination
  theme={theme}
  page={page}
  totalPages={totalPages}
  setPage={setPage}
/>

</main>
  );
}