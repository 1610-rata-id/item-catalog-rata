import React from "react";
import { Sun, Moon } from "lucide-react";

interface PublicHeaderProps {
  theme: "light" | "dark";

  router: any;

  search: string;

  handleSearch: (value: string) => void;

  toggleTheme: () => void;

  showCategory: boolean;

  setShowCategory: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  catRef: React.RefObject<any>;

  catSearch: string;

  setCatSearch: React.Dispatch<
    React.SetStateAction<string>
  >;

  selectedCategory: string;

  hierarchicalCategories: Record<string, string[]>;

  expandedCategory: string | null;

  toggleCategory: (main: string) => void;

  handleCategoryChange: (value: string) => void;

  setShowSuggestion: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function PublicHeader({
  theme,
  router,
  search,
  handleSearch,
  toggleTheme,
  showCategory,
  setShowCategory,
  catRef,
  catSearch,
  setCatSearch,
  selectedCategory,
  hierarchicalCategories,
  expandedCategory,
  toggleCategory,
  handleCategoryChange,
  setShowSuggestion,
}: PublicHeaderProps) {

  return (


      <div
  className={`
    sticky
    top-0
    z-50

    backdrop-blur-xl

    border-b

    px-8
    py-6

    flex
    justify-between
    items-center

    ${
      theme === "dark"
        ? `
          bg-[#031427]/90
          border-cyan-300/10
        `
        : `
          bg-white/90
          border-slate-200
          shadow-sm
        `
    }
  `}
>

        <img
          src="/logo.png"
          className="h-28 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() =>
            router.push("/")
          }
        />

        <div className="flex items-center gap-6 text-sm flex-wrap justify-end">

          <button
            onClick={() =>
              router.push("/")
            }
            className="hover:text-cyan-600 transition"
          >
            Beranda
          </button>

          <button
  onClick={() =>
    setShowSuggestion(true)
  }
  className="hover:text-cyan-600 transition"
>
  Suggestions
</button>

          {/* CATEGORY */}
          <div
            ref={catRef}
            className="relative"
          >
            <button
              onClick={() =>
                setShowCategory(
                  !showCategory
                )
              }
              className="hover:text-cyan-600 transition"
            >
              Category ▾
            </button>

            {showCategory && (
  <div
    className={`
      absolute
      mt-3
      w-72
      rounded-3xl
      backdrop-blur-xl
      overflow-y-auto custom-scrollbar
      max-h-[420px]
      z-50

      ${
        theme === "dark"
          ? `
            border border-cyan-300/20
            bg-[#071d33]
            text-white
          `
          : `
            border border-slate-200
            bg-white
            text-slate-800
            shadow-xl
          `
      }
    `}
>

                <input
                  placeholder="Search..."
                  value={catSearch}
                  onChange={(e) =>
                    setCatSearch(
                      e.target.value
                    )
                  }
className={`
  w-full

  px-4
  py-4

  bg-transparent

  border-b

  outline-none

  ${
    theme === "dark"
      ? `
        border-cyan-300/10
        text-white
      `
      : `
        border-slate-200
        text-slate-800
      `
  }
`}
                />

                <div
  onClick={() => {
    handleCategoryChange("All");
    setShowCategory(false);
  }}
  className={`
    px-4
    py-3

    cursor-pointer

    transition

    border-b
    border-cyan-300/10

    hover:bg-cyan-500/10

    ${
      selectedCategory === "All"
  ? "bg-cyan-500/10 text-cyan-300 font-semibold"
  : theme === "dark"
    ? "text-white"
    : "text-slate-700"
    }
  `}
>
  All
</div>

                {Object.entries(
                  hierarchicalCategories
                )

                  .filter(
                    ([main, subs]) => {
                      const mainMatch =
                        main
                          .toLowerCase()
                          .includes(
                            catSearch.toLowerCase()
                          );

                      const subMatch =
                        subs.some((sub) =>
                          sub
                            .toLowerCase()
                            .includes(
                              catSearch.toLowerCase()
                            )
                        );

                      return (
                        mainMatch ||
                        subMatch ||
                        catSearch === ""
                      );
                    }
                  )

                  .sort(([a], [b]) =>
                    a.localeCompare(b)
                  )

                  .map(
                    ([main, subs]) => (
                      <div
                        key={main}
                        className="border-b border-cyan-300/10"
                      >
                        <button
                          onClick={() =>
                            toggleCategory(
                              main
                            )
                          }
 className={`
  w-full

  flex
  justify-between
  items-center

  px-4
  py-3

  transition

  font-semibold

  ${
    theme === "dark"
      ? `
        text-white
        hover:bg-cyan-500/10
      `
      : `
        text-slate-800
        hover:bg-slate-100
      `
  }
`}                        >
                          <span>
                            {main}
                          </span>

                          <span>
                            {expandedCategory ===
                            main
                              ? "−"
                              : "+"}
                          </span>
                        </button>

                        {expandedCategory ===
                          main && (
                          <div className="pb-2">

                            {subs.length ===
                              0 && (
                              <div
                                onClick={() => {
                                  handleCategoryChange(
                                    main
                                  );

                                  setShowCategory(
                                    false
                                  );
                                }}
                                className="
                                  px-8
  py-2

  cursor-pointer

  text-sm

  hover:bg-cyan-500/10

  transition
                                "
                              >
                                View All
                              </div>
                            )}

                            {subs.map(
                              (sub) => (
                                <div
                                  key={sub}
                                  onClick={() => {
                                    handleCategoryChange(
                                      sub
                                    );

                                    setShowCategory(
                                      false
                                    );
                                  }}
                                  className={`
                                    px-8
  py-2

  cursor-pointer

  text-sm

  hover:bg-cyan-500/10

  transition
                                    ${
                                      selectedCategory === sub
  ? "bg-cyan-500/10 text-cyan-300 font-medium"
  : theme === "dark"
    ? "text-white/70"
    : "text-slate-600"
                                    }
                                  `}
                                >
                                  └ {sub}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
              </div>
            )}
          </div>

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) =>
              handleSearch(
                e.target.value
              )
            }
            placeholder="Cari item..."
            className={`
  px-6
  py-3

  rounded-2xl

  border

  outline-none

  transition

  ${
    theme === "dark"
      ? `
        border-cyan-300/20
        bg-white/5
        text-white
        placeholder:text-white/40
      `
      : `
        border-slate-200
        bg-white
        text-slate-800
        placeholder:text-slate-400
      `
  }
`}
          />

<button
  onClick={toggleTheme}
  className={`
    w-11
    h-11

    rounded-xl

    flex
    items-center
    justify-center

    transition-all
    duration-300

    hover:scale-105

    ${
      theme === "dark"
        ? `
            bg-cyan-500/10
            border
            border-cyan-400/20

            hover:bg-cyan-500/20
          `
        : `
            bg-blue-50
            border
            border-blue-200

            hover:bg-blue-100
          `
    }
  `}
>

  {theme === "dark" ? (

    <Sun
      size={20}
      className="
        text-yellow-400
      "
    />

  ) : (

    <Moon
      size={20}
      className="
        text-blue-600
      "
    />

  )}

</button>

        </div>
      </div>

 );

}
