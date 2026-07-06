"use client";

import {
  Menu,
  Search,
  Sun,
  Moon,
} from "lucide-react";

type MobileHeaderProps = {
  theme: "light" | "dark";

  search: string;

  handleSearch: (
    value: string
  ) => void;

  toggleTheme: () => void;

  onOpenMenu: () => void;
};

export default function MobileHeader({
  theme,
  search,
  handleSearch,
  toggleTheme,
  onOpenMenu,
}: MobileHeaderProps) {
  return (
    <header
      className={`
        sticky
        top-0
        z-50

        backdrop-blur-xl

        border-b

        px-4
        py-4

        ${
          theme === "dark"
            ? "bg-[#04192c]/90 border-cyan-400/10"
            : "bg-white/90 border-slate-200"
        }
      `}
    >
      <div className="flex items-center justify-between">

        {/* MENU */}

        <button
          onClick={onOpenMenu}
          className="
            w-10
            h-10

            flex
            items-center
            justify-center

            rounded-xl
          "
        >
          <Menu size={24} />
        </button>

        {/* LOGO */}

        <img
          src="/logo.png"
          className="h-10 object-contain"
        />

        {/* THEME */}

        <button
          onClick={toggleTheme}
          className={`
            w-10
            h-10

            rounded-xl

            flex
            items-center
            justify-center

            ${
              theme === "dark"
                ? "bg-cyan-500/10"
                : "bg-blue-50"
            }
          `}
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

      </div>

      {/* SEARCH */}

      <div className="mt-4 relative">

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            opacity-60
          "
        />

        <input
          value={search}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
          placeholder="Cari item..."
          className={`
            w-full

            pl-11
            pr-4

            py-3

            rounded-2xl

            border

            outline-none

            ${
              theme === "dark"
                ? `
                    bg-white/5
                    border-cyan-400/20
                  `
                : `
                    bg-white
                    border-slate-300
                  `
            }
          `}
        />

      </div>

    </header>
  );
}