import React from "react";
import PublicHeader from "./PublicHeader";

interface PublicDesktopCatalogProps {
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

  hierarchicalCategories: Record<
    string,
    string[]
  >;

  expandedCategory: string | null;

  toggleCategory: (
    main: string
  ) => void;

  handleCategoryChange: (
    value: string
  ) => void;

  setShowSuggestion: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  items: any[];

  totalItems: number;

  loading: boolean;

  page: number;

  totalPages: number;

  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;

  setSelectedCategory: React.Dispatch<
    React.SetStateAction<string>
  >;

  selectedItem: any;

activeImage: string | null;

showShareMenu: boolean;

  setSelectedItem: React.Dispatch<any>;

  setActiveImage: React.Dispatch<any>;

  setShowShareMenu: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function PublicDesktopCatalog(
  props: PublicDesktopCatalogProps
) {

const {
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

  items,
  totalItems,
  loading,
  page,
  totalPages,
  setPage,

  setSelectedCategory,
  selectedItem,
  setSelectedItem,

  activeImage,
  setActiveImage,

  showShareMenu,
  setShowShareMenu,

} = props;

  return (
    <>
      <PublicHeader
  theme={theme}
  router={router}
  search={search}
  handleSearch={handleSearch}
  toggleTheme={toggleTheme}
  showCategory={showCategory}
  setShowCategory={setShowCategory}
  catRef={catRef}
  catSearch={catSearch}
  setCatSearch={setCatSearch}
  selectedCategory={selectedCategory}
  hierarchicalCategories={hierarchicalCategories}
  expandedCategory={expandedCategory}
  toggleCategory={toggleCategory}
  handleCategoryChange={handleCategoryChange}
  setShowSuggestion={setShowSuggestion}
/>

           {/* BANNER */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div
          className={`
  relative
  overflow-hidden
  rounded-[32px]

  ${
    theme === "dark"
      ? `
        border border-cyan-300/10
        shadow-[0_0_30px_rgba(0,255,255,0.08)]
      `
      : `
        border border-slate-200
        shadow-xl
      `
  }
`}
        >
          <img
  src={
    theme === "dark"
      ? "/dark/catalog-banner.jpg"
      : "/light/catalog-banner.jpg"
  }
            className="
              w-full
              h-[220px] md:h-[300px]
              object-cover
            "
          />
        </div>
      </div>


 {/* RESULT */}
<div className="max-w-7xl mx-auto px-6 pt-10 flex justify-between items-center flex-wrap gap-3">

  <p
    className={
      theme === "dark"
        ? "text-cyan-300"
        : "text-slate-500"
    }
  >
    Menampilkan{" "}
    <span
      className={`
        font-semibold
        ${
          theme === "dark"
            ? "text-cyan-400"
            : "text-blue-600"
        }
      `}
    >
      {items.length}
    </span>{" "}
    dari{" "}
    <span
      className={`
        font-semibold
        ${
          theme === "dark"
            ? "text-cyan-400"
            : "text-blue-600"
        }
      `}
    >
      {totalItems}
    </span>{" "}
    item
  </p>

  <div className="flex gap-2 flex-wrap">

    {selectedCategory !== "All" && (
      <button
        onClick={() =>
          setSelectedCategory("All")
        }
        className="
          px-4
          py-2

          rounded-full

          bg-cyan-400/20

          border
          border-cyan-400/30

          text-cyan-300

          text-sm

          hover:bg-cyan-400/30

          transition
        "
      >
        {selectedCategory} ✕
      </button>
    )}

  </div>

</div>


  {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <div
            className="
              w-14 h-14 rounded-full
              border-4 border-gray-300
              border-t-red-500
              animate-spin
            "
          />
        </div>
      )}

  {/* GRID */}
      {!loading && (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {items.map((item) => (

            <div
              key={item.id}

              onClick={() => {
               setShowShareMenu(false);
                setSelectedItem(item);

                if (
                  item.image_urls &&
                  item.image_urls.length > 0
                ) {

                  setActiveImage(
                    item.image_urls[0]
                  );

                } else {

                  setActiveImage(
  item.image_url || null
);

                }

              }}
              className={`
    rounded-[28px]
    border
    overflow-hidden
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-2

    ${
      theme === "dark"
        ? `
          border-cyan-300/20
          bg-[#071d33]
          hover:border-cyan-400/50
          hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]
        `
        : `
          border-slate-200
          bg-white
          shadow-lg
          hover:shadow-2xl
        `
    }
  `}
>

              {/* IMAGE */}
              <div
  className={`
    h-60
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
                      h-40
                      object-contain
                      transition-transform
                      duration-500
                      hover:scale-110
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      w-full
                      h-full
                      text-sm
                      text-gray-400
                    "
                  >
                    No Image
                  </div>

                )}

              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h2
  className={`
    font-semibold
    text-base
    line-clamp-2
    min-h-[52px]

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-800"
    }
  `}
>
                  {item.item_name}
                </h2>

                <p
  className={`
    uppercase
    tracking-[2px]
    text-xs
    mt-3

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

          ))}

        </div>
      )}


  {/* EMPTY */}
      {!loading &&
        items.length === 0 && (
          <div className="text-center py-20">

            <h2 className="text-2xl font-bold">
              Item tidak ditemukan
            </h2>

            <p className="text-gray-500 mt-2">
              Coba keyword atau filter lain
            </p>
          </div>
        )}


  {/* PAGINATION */}
<div className="flex justify-center items-center gap-2 pb-14 flex-wrap">

  {/* PREVIOUS */}
  <button
    disabled={page === 1}
    onClick={() =>
      setPage(page - 1)
    }
    className={`
  px-4
  py-2
  rounded-xl
  border
  transition

  ${
    theme === "dark"
      ? `
        bg-[#071d33]
        text-white
        border-cyan-300/20
      `
      : `
        bg-white
        text-slate-700
        border-slate-300
        shadow-md
      `
  }

  disabled:opacity-40
`}
  >
    ←
  </button>

  {/* PAGE NUMBERS */}
  {Array.from(
    { length: totalPages },
    (_, i) => i + 1
  )

    // LIMIT BUTTONS
    .filter((p) => {

      // ALWAYS SHOW
      if (
        p === 1 ||
        p === totalPages
      ) {
        return true;
      }

      // SHOW AROUND CURRENT PAGE
      return (
        p >= page - 2 &&
        p <= page + 2
      );
    })

    .map((p, index, arr) => {

      // ADD ...
      const prev =
        arr[index - 1];

      const showDots =
        prev &&
        p - prev > 1;

      return (
        <div
          key={p}
          className="flex items-center"
        >

          {showDots && (
            <span className="px-1">
              ...
            </span>
          )}

          <button
            onClick={() =>
              setPage(p)
            }
            className={`
  min-w-[42px]
  h-[42px]
  rounded-xl
  transition
  border

  ${
    page === p
      ? `
          bg-cyan-400
          text-[#031427]
          border-cyan-400
          shadow-lg
        `
      : theme === "dark"
        ? `
            bg-[#071d33]
            text-white
            border-cyan-300/20
          `
        : `
            bg-white
            text-slate-700
            border-slate-300
          `
  }
`}
          >
            {p}
          </button>

        </div>
      );
    })}

  {/* NEXT */}
  <button
    disabled={
      page >= totalPages
    }
    onClick={() =>
      setPage(page + 1)
    }
    className={`
  px-4
  py-2
  rounded-xl
  border
  transition

  ${
    theme === "dark"
      ? `
        bg-[#071d33]
        text-white
        border-cyan-300/20
      `
      : `
        bg-white
        text-slate-700
        border-slate-300
        shadow-md
      `
  }

  disabled:opacity-40
`}
  >
    →
  </button>

</div>


    </>
  );
}