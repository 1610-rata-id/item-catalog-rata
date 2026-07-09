"use client";

import { useState } from "react";
import { X } from "lucide-react";

import PublicHeader from "./PublicHeader";
import PublicDrawer from "./PublicDrawer";
import PublicHero from "./PublicHero";
import PublicResult from "./PublicResult";
import PublicGrid from "./PublicGrid";
import PublicPagination from "./PublicPagination";

import type { CatalogItem } from "@/types/catalog";

type PublicMobileCatalogProps = {
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

  setSelectedItem: React.Dispatch<any>;

setActiveImage: React.Dispatch<any>;

  onSuggestionClick: () => void;
};

export default function PublicMobileCatalog({
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

  setSelectedItem,

setActiveImage,

onSuggestionClick,

}: PublicMobileCatalogProps) {

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

      <PublicHeader
        theme={theme}
        search={search}
        handleSearch={handleSearch}
        toggleTheme={toggleTheme}
        onOpenMenu={() =>
          setDrawerOpen(true)
        }
      />

      <PublicDrawer
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
        onSuggestionClick={() => {

  setDrawerOpen(false);

  onSuggestionClick();

}}
      />

      <PublicHero
        theme={theme}
      />

      {selectedCategory !== "All" && (

        <div className="px-4 pt-4">

          <button
            onClick={() =>
              handleCategoryChange(
                "All"
              )
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

        </div>

      )}

      <PublicResult
        theme={theme}
        currentItems={
          items.length
        }
        totalItems={
          totalItems
        }
        selectedCategory={
          selectedCategory
        }
        handleCategoryChange={
          handleCategoryChange
        }
      />

      <PublicGrid
  theme={theme}
  items={items}
  setSelectedItem={setSelectedItem}
  setActiveImage={setActiveImage}
/>

      <PublicPagination
        theme={theme}
        page={page}
        totalPages={
          totalPages
        }
        setPage={setPage}
      />

    </main>
  );
}