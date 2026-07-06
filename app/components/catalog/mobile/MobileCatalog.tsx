"use client";

import { useState } from "react";

import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";
import MobileHero from "./MobileHero";
import MobileResult from "./MobileResult";
import MobileGrid from "./MobileGrid";

import type { CatalogItem } from "@/types/catalog";

type MobileCatalogProps = {
  theme: "light" | "dark";

  items: CatalogItem[];

  totalItems: number;

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

      <MobileResult
        theme={theme}
        currentItems={items.length}
        totalItems={totalItems}
      />

      <MobileGrid
        theme={theme}
        items={items}
      />

    </main>
  );
}