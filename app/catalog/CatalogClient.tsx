"use client";

import { useEffect, useState, useRef } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/app/providers/ThemeProvider";

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID").format(number || 0);
}

export default function Catalog() {
  const router = useRouter();
const { theme } = useTheme();
const { role } =
  useRequireAuth();

const searchParams = useSearchParams();

const [authLoading, setAuthLoading] =
  useState(true);

const [items, setItems] = useState<any[]>([]);

  // NEW
const [
  hierarchicalCategories,
  setHierarchicalCategories,
] = useState<
  Record<string, string[]>
>({});

const [
  expandedCategory,
  setExpandedCategory,
] = useState<string | null>(null);

  const [vendors, setVendors] = useState<
    string[]
  >([]);

  // TOTAL COUNT
  const [totalItems, setTotalItems] =
    useState(0);

  // LOADING
  const [loading, setLoading] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState<any | null>(null);

  const [activeImage, setActiveImage] =
    useState("");

  // PAGINATION
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // 100 ITEMS
  const ITEMS_PER_PAGE = 100;

  // URL STATE
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  // DEBOUNCED SEARCH
  const [debouncedSearch, setDebouncedSearch] =
    useState(search);

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") || "All"
    );

  const [selectedVendor, setSelectedVendor] =
    useState(
      searchParams.get("vendor") || "All"
    );

  const [showCategory, setShowCategory] =
    useState(false);

  const [showVendor, setShowVendor] =
    useState(false);

  const [catSearch, setCatSearch] =
    useState("");

  const [vendorSearch, setVendorSearch] =
    useState("");

  const catRef = useRef<any>(null);
  const vendorRef = useRef<any>(null);

  // TOTAL PAGE
  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

// AUTH CHECK
useEffect(() => {
  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    setAuthLoading(false);
  }

  checkUser();
}, [router]);

  // GET FILTERS
async function getFilters() {

  const { data, error } = await supabase
    .from("items")
    .select(`
      category,
      vendor,
      main_category,
      sub_category
    `);

  if (error) {
    console.error(error);
    return;
  }

  console.log("TOTAL DATA:", data?.length);

  const hierarchyMap = new Map<
    string,
    Set<string>
  >();

  const legacySet = new Set<string>();

  const vendorSet = new Set<string>();

  data?.forEach((item: any, index) => {

    const main = String(
  item.main_category || ""
)
  .replace(/\s+/g, " ")
  .trim();

const sub = String(
  item.sub_category || ""
)
  .replace(/\s+/g, " ")
  .trim();

    // DEBUG
    console.log(
      index,
      "MAIN:",
      main,
      "SUB:",
      sub
    );

    // VENDOR
    if (item.vendor) {
      vendorSet.add(
        item.vendor.trim()
      );
    }

    // CATEGORY
    if (main !== "") {

      if (!hierarchyMap.has(main)) {

        console.log(
          "ADD MAIN:",
          main
        );

        hierarchyMap.set(
          main,
          new Set()
        );
      }

      if (sub !== "") {

        console.log(
          "ADD SUB:",
          main,
          sub
        );

        hierarchyMap
          .get(main)
          ?.add(sub);
      }
    }

    // LEGACY
    if (item.category) {
      legacySet.add(
        item.category.trim()
      );
    }

  });

  // CONVERT
const hierarchyObject: Record<
  string,
  string[]
> = {};

// MAIN + SUB
hierarchyMap.forEach(
  (subs, main) => {

    hierarchyObject[main] =
      Array.from(subs).sort();

  }
);

// LEGACY CATEGORY
Array.from(legacySet).forEach(
  (cat) => {

    // skip all
    if (!cat) return;

    // kalau category lama
    // BELUM ADA di hierarchy
    const alreadyExists =
      Object.entries(
        hierarchyObject
      ).some(
        ([main, subs]) =>
          cat === main ||
          subs.includes(cat) ||
          cat.startsWith(main)
      );

    // masukkan sebagai
    // MAIN CATEGORY BARU
    if (!alreadyExists) {

      hierarchyObject[cat] = [];

    }

  }
);

console.log(
  "FINAL HIERARCHY",
  hierarchyObject
);

setHierarchicalCategories(
  hierarchyObject
);

setVendors([
  "All",
  ...Array.from(vendorSet).sort(),
]);
}

  // GET ITEMS
  async function getItems() {
  setLoading(true);

  const from =
    (page - 1) * ITEMS_PER_PAGE;

  const to =
    from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("items")
    .select("*", { count: "exact" })
    .order("item_name", {
      ascending: true,
    });

  // SEARCH
  if (debouncedSearch.trim()) {
  query = query.or(
    `item_name.ilike.%${debouncedSearch}%,vendor.ilike.%${debouncedSearch}%,category.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,item_code.ilike.%${debouncedSearch}%,Manufacture.ilike.%${debouncedSearch}%,type.ilike.%${debouncedSearch}%,Term.ilike.%${debouncedSearch}%,Remarks.ilike.%${debouncedSearch}%`
  );
}

  // CATEGORY
if (selectedCategory !== "All") {

  query = query.or(
    `category.eq.${selectedCategory},main_category.eq.${selectedCategory},sub_category.eq.${selectedCategory}`
  );

}

  // VENDOR
  if (selectedVendor !== "All") {
    query = query.eq(
      "vendor",
      selectedVendor
    );
  }

  // PAGINATION
  query = query.range(from, to);

  console.log(
  "SELECTED CATEGORY:",
  selectedCategory
);
  const {
    data,
    error,
    count,
  } = await query;

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  setItems(data || []);

  setTotalItems(count || 0);

  setLoading(false);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  // LOAD FILTERS ONCE
  useEffect(() => {
    getFilters();
  }, []);

  // UPDATE URL
  function updateURL(
    searchValue: string,
    categoryValue: string,
    vendorValue: string
  ) {
    const params = new URLSearchParams();

    if (searchValue) {
      params.set("search", searchValue);
    }

    if (categoryValue !== "All") {
      params.set(
        "category",
        categoryValue
      );
    }

    if (vendorValue !== "All") {
      params.set("vendor", vendorValue);
    }

    params.set("page", String(page));

    router.replace(
      `/catalog?${params.toString()}`
    );
  }

  // HANDLERS
  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(
    value: string
  ) {
    setSelectedCategory(value);
    setPage(1);
  }

function toggleCategory(
  main: string
) {
  setExpandedCategory(
    expandedCategory === main
      ? null
      : main
  );
}

  function handleVendorChange(
    value: string
  ) {
    setSelectedVendor(value);
    setPage(1);
  }

  // DEBOUNCE EFFECT
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // FETCH ITEMS
  useEffect(() => {
    getItems();

// REALTIME
  const channel = supabase
    .channel("catalog-realtime")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "items",
      },
      () => {
        getItems();
      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(
      channel
    );
  };
  }, [
    debouncedSearch,
    selectedCategory,
    selectedVendor,
    page,
  ]);

  // UPDATE URL
  useEffect(() => {
    updateURL(
      debouncedSearch,
      selectedCategory,
      selectedVendor
    );
  }, [
    debouncedSearch,
    selectedCategory,
    selectedVendor,
    page,
  ]);

  // CLOSE DROPDOWN WHEN CLICK OUTSIDE
  useEffect(() => {
    const close = (e: any) => {
      if (
        !catRef.current?.contains(e.target)
      ) {
        setShowCategory(false);
      }

      if (
        !vendorRef.current?.contains(e.target)
      ) {
        setShowVendor(false);
      }
    };

    window.addEventListener(
      "click",
      close
    );

    return () =>
      window.removeEventListener(
        "click",
        close
      );
  }, []);

  if (authLoading) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      Checking authentication...
    </main>
  );
}

return (
  <main
  className={`
    min-h-screen
    font-[Poppins]
    relative

    ${
      theme === "dark"
        ? `
          text-white
          bg-[#02111f]
        `
        : `
          text-slate-900
          bg-[#f5f7fb]
        `
    }
  `}
>

    <img
      src={
  theme === "dark"
    ? "/dark/dashboard-hero.jpg"
    : "/light/dashboard-hero.jpg"
}
      alt="background"
      className={`
        absolute
        inset-0
        w-full
        h-full
        object-cover
        ${
  theme === "dark"
    ? "opacity-60"
    : "opacity-100"
}
      `}
    />

    <div className="relative z-10">

      {/* HEADER */}
      <div
  className={`
  sticky
  top-0
  z-50

  backdrop-blur-xl

  border-b

  px-8
  py-5

  flex
  justify-between
  items-center

  ${
    theme === "dark"
      ? `
          bg-[#04192c]/80
          border-cyan-400/10
        `
      : `
          bg-white/90
          border-slate-200
          shadow-sm
        `
  }
`}
>

        {/* LOGO */}
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
            className={`
  transition

  ${
    theme === "dark"
      ? `
          text-white
          hover:text-cyan-300
        `
      : `
          text-slate-700
          hover:text-blue-600
        `
  }
`}
          >
            Beranda
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
    className={`
  transition

  ${
    theme === "dark"
      ? `
          text-white
          hover:text-cyan-300
        `
      : `
          text-slate-700
          hover:text-blue-600
        `
  }
`}
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

  overflow-y-auto

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

      {/* ALL */}
      <div
        onClick={() => {
          handleCategoryChange(
            "All"
          );

          setShowCategory(false);
        }}
        className={`
          px-4 py-3 cursor-pointer transition
          hover:bg-cyan-500/10
border-b
border-cyan-300/10
          ${
  selectedCategory === "All"
    ? theme === "dark"
      ? "bg-cyan-500/10 text-cyan-300 font-semibold"
      : "bg-blue-50 text-blue-600 font-semibold"
    : theme === "dark"
      ? "text-white"
      : "text-slate-700"
}
        `}
      >
        All
      </div>

      {/* HIERARCHICAL CATEGORY */}
{Object.entries(hierarchicalCategories)

  .filter(([main, subs]) => {

    // SEARCH MAIN
    const mainMatch =
      main
        .toLowerCase()
        .includes(
          catSearch.toLowerCase()
        );

    // SEARCH SUB
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
  })

  .sort(([a], [b]) =>
    a.localeCompare(b)
  )

  .map(([main, subs]) => (
        <div
          key={main}
          className="border-b"
        >

          {/* MAIN */}
          <button
            onClick={() =>
              toggleCategory(main)
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
          hover:bg-slate-50
        `
  }
`}
          >
            <span>{main}</span>

            <span>
              {expandedCategory === main
                ? "−"
                : "+"}
            </span>
          </button>

          {/* SUB */}
{expandedCategory === main && (
  <div className="pb-2">

    {/* EMPTY SUB */}
    {subs.length === 0 && (
      <div
        onClick={() => {
          handleCategoryChange(main);

          setShowCategory(false);
        }}
        className={`
  px-8
  py-2

  text-sm

  cursor-pointer

  ${
    theme === "dark"
      ? `
          text-white/70
          hover:bg-cyan-500/10
        `
      : `
          text-slate-600
          hover:bg-slate-50
        `
  }
`}
      >
        View All
      </div>
    )}

    {/* SUB CATEGORY */}
    {subs
  .sort((a, b) =>
    a.localeCompare(b)
  )
  .map((sub) => (
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
                    px-8 py-2
                    cursor-pointer
                    text-sm
                    hover:bg-cyan-500/10
                    transition
                    ${
                      selectedCategory === sub
  ? theme === "dark"
    ? "bg-cyan-500/10 text-cyan-300 font-medium"
    : "bg-blue-50 text-blue-600 font-medium"
  : theme === "dark"
    ? "text-white/70"
    : "text-slate-600"
                    }
                  `}
                >
                  └ {sub}
                </div>
              ))}

            </div>
          )}

                </div>
      ))}

    </div>
  )}

</div>

          {/* VENDOR */}
          <div
            ref={vendorRef}
            className="relative"
          >

            <button
              onClick={() =>
                setShowVendor(
                  !showVendor
                )
              }
              className={`
  transition

  ${
    theme === "dark"
      ? `
          text-white
          hover:text-cyan-300
        `
      : `
          text-slate-700
          hover:text-blue-600
        `
  }
`}
            >
              Vendor ▾
            </button>

            {showVendor && (
              <div
  className={`
  absolute
  mt-3

  w-72

  rounded-3xl

  backdrop-blur-xl

  overflow-y-auto

  max-h-[420px]

  z-50

  ${
    theme === "dark"
      ? `
          border border-cyan-300/20
          bg-[#071d33]
          shadow-[0_0_30px_rgba(0,255,255,0.1)]
        `
      : `
          border border-slate-200
          bg-white
          shadow-xl
        `
  }
`}
>

                <input
                  placeholder="Search..."
                  value={vendorSearch}
                  onChange={(e) =>
                    setVendorSearch(
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

                {vendors
                  .filter((v) =>
                    v
                      ?.toLowerCase()
                      .includes(
                        vendorSearch.toLowerCase()
                      )
                  )
                  .map((v) => (
                    <div
                      key={v}
                      onClick={() => {
                        handleVendorChange(
                          v
                        );

                        setShowVendor(
                          false
                        );
                      }}
                      className={`
                        px-4 py-3 cursor-pointer transition
                        hover:bg-cyan-500/10
                        ${
                          selectedVendor === v
  ? theme === "dark"
    ? "bg-cyan-500/10 text-cyan-300 font-semibold"
    : "bg-blue-50 text-blue-600 font-semibold"
  : theme === "dark"
    ? "text-white"
    : "text-slate-700"
                        }
                      `}
                    >
                      {v}
                    </div>
                  ))}
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
  w-[280px]

  px-5
  py-3

  rounded-2xl

  border

  outline-none

  transition

  ${
    theme === "dark"
      ? `
          bg-white/5
          border-cyan-400/30
          text-white
        `
      : `
          bg-white
          border-slate-300
          text-slate-800
          shadow-sm
        `
  }
`}
/>

{/* ADMIN MENU */}
{role === "admin" && (
  <>
    <button
      onClick={() =>
        router.push(
          "/admin/dashboard"
        )
      }
      className={`
  h-12
  px-8

  rounded-2xl

  border

  font-medium

  transition

  ${
    theme === "dark"
      ? `
          border-cyan-400/30
          bg-cyan-500/15
          text-cyan-300
    hover:bg-blue-500/10
          shadow-[0_0_25px_rgba(0,255,255,0.25)]
        `
      : `
          border-slate-300
          bg-white
          text-slate-700
    hover:bg-blue-500/10
          shadow-sm
        `
  }
`}
    >
      Dashboard
    </button>

    <button
      onClick={() =>
        router.push(
          "/admin/add-item"
        )
      }
   className={`
  h-12
  px-8

  rounded-2xl

  border

  font-medium

  transition

  ${
    theme === "dark"
      ? `
          border-cyan-400/30
          bg-cyan-500/15
          text-cyan-300
    hover:bg-blue-500/10
          shadow-[0_0_25px_rgba(0,255,255,0.25)]
        `
      : `
          border-slate-300
          bg-white
          text-slate-700
    hover:bg-blue-500/10
          shadow-sm
        `
  }
`}
    >
      Add Item
    </button>
  </>
)}

<button
  onClick={async () => {
    await supabase.auth.signOut();

    router.push("/");
  }}
  className={`
  h-12
  px-8

  rounded-2xl

  border

  font-medium

  transition

  ${
    theme === "dark"
      ? `
          border-red-400/30
          bg-red-500/15
          text-red-300
    hover:bg-red-500/10
          shadow-[0_0_25px_rgba(0,255,255,0.25)]
        `
      : `
          border-red-200
          bg-white
          text-red-500
    hover:bg-red-500/10
          shadow-sm
        `
  }
`}
>
  Logout
</button>

</div>
      </div>

      {/* HERO BANNER */}
<div className="px-8 pt-8">

  <div
    className={`
  relative
  overflow-hidden
  rounded-[32px]

  border

  mb-8

  ${
    theme === "dark"
      ? `
          border-cyan-300/20
          bg-white/5
          backdrop-blur-xl
        `
      : `
          border-slate-200
          bg-white/70
          backdrop-blur-md
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
      alt="Catalog Banner"
      className="
        w-full
        h-[420px]
        object-cover
      "
    />

  </div>

</div>

      {/* TOTAL RESULT */}
      <div className="max-w-7xl mx-auto px-6 pt-10 flex justify-between items-center flex-wrap gap-3">

        <div className="mt-10 mb-8">
  <p
  className={`
    text-lg

    ${
      theme === "dark"
        ? "text-white/70"
        : "text-slate-600"
    }
  `}
>
  Menampilkan{" "}
  <span className={`
  font-semibold

  ${
    theme === "dark"
      ? "text-cyan-300"
      : "text-blue-600"
  }
`}
>
    {items.length}
  </span>{" "}
  dari{" "}
  <span className={`
  font-semibold

  ${
    theme === "dark"
      ? "text-cyan-300"
      : "text-blue-600"
  }
`}
>
    {totalItems}
  </span>{" "}
  item
</p>
</div>

        {/* ACTIVE FILTER */}
        <div className="flex gap-2 flex-wrap">

          {selectedCategory !== "All" && (
            <button
              onClick={() =>
                handleCategoryChange("All")
              }
              className={`
  px-3
  py-1

  rounded-full

  text-xs
  font-medium

  ${
    theme === "dark"
      ? `
          bg-cyan-500/20
          text-cyan-300
        `
      : `
          bg-blue-50
          text-blue-600
          border border-blue-200
        `
  }
`}
            >
              {selectedCategory} ✕
            </button>
          )}

          {selectedVendor !== "All" && (
            <button
              onClick={() =>
                handleVendorChange("All")
              }
              className={`
  px-3
  py-1

  rounded-full

  text-xs
  font-medium

  ${
    theme === "dark"
      ? `
          bg-cyan-500/20
          text-cyan-300
        `
      : `
          bg-blue-50
          text-blue-600
          border border-blue-200
        `
  }
`}
            >
              {selectedVendor} ✕
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
        <div className="max-w-[1700px] mx-auto p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-6">

          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
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
                    item.image_url
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
          border-cyan-400/20
          bg-[#051a2e]/80
          backdrop-blur-xl

          hover:border-cyan-400/50
          hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]
        `
      : `
          border-slate-200
          bg-white

          shadow-md

          hover:shadow-xl
        `
  }
`}
            >

              {/* IMAGE */}
<div
  className={`
  h-64

  flex
  items-center
  justify-center

  overflow-hidden

  ${
    theme === "dark"
      ? "bg-[#071f35]"
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
              <div className="p-4">

               <h2
  className={`
    font-semibold
    text-lg

    line-clamp-2
    min-h-[56px]

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
>
                  {item.item_name}
                </h2>

                <p
  className={`
    text-xs
    mt-2

    ${
      theme === "dark"
        ? "text-gray-500"
        : "text-slate-500"
    }
  `}
>
                  {item.category}
                </p>

                <p
  className={`
    text-xs

    ${
      theme === "dark"
        ? "text-gray-400"
        : "text-slate-400"
    }
  `}
>
                  {item.vendor}
                </p>

                <p
  className={`
    font-bold
    mt-3
    text-lg

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-green-600"
    }
  `}
>
                  Rp{" "}
                  {formatRupiah(
                    item.price
                  )}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <div className="text-center py-20">

          <h2
  className={`
    text-2xl
    font-bold

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
>
            Item tidak ditemukan
          </h2>

          <p
  className={`
    mt-2

    ${
      theme === "dark"
        ? "text-gray-500"
        : "text-slate-500"
    }
  `}
>
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

  disabled:opacity-40

  transition

  ${
    theme === "dark"
      ? `
          bg-[#071d33]
          border-cyan-300/20
          text-white
          hover:border-cyan-400
        `
      : `
          bg-white
          border-slate-300
          text-slate-700
          hover:bg-slate-50
        `
  }
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
  ? theme === "dark"
    ? "bg-cyan-400 text-[#031427] border-cyan-400 shadow-lg"
    : "bg-blue-600 text-white border-blue-600 shadow-lg"
  : theme === "dark"
    ? "bg-[#071d33] text-white border-cyan-300/20 hover:border-cyan-400"
    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
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

  disabled:opacity-40

  transition

  ${
    theme === "dark"
      ? `
          bg-[#071d33]
          border-cyan-300/20
          text-white
          hover:border-cyan-400
        `
      : `
          bg-white
          border-slate-300
          text-slate-700
          hover:bg-slate-50
        `
  }
`}
  >
    →
  </button>

</div>

      {/* MODAL DETAIL */}
      {selectedItem && (
        <div
          onClick={() =>
            setSelectedItem(null)
          }
          className="
            fixed inset-0 bg-black/60 backdrop-blur-sm
            z-50 flex items-center justify-center p-6
          "
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
   className={`
  w-full
  max-w-6xl

  rounded-[32px]

  overflow-hidden

  relative

  max-h-[90vh]
  overflow-y-auto

  ${
    theme === "dark"
      ? `
          border border-cyan-400/20
          bg-[#051a2e]
          backdrop-blur-xl
          shadow-[0_0_50px_rgba(0,255,255,0.15)]
        `
      : `
          border border-slate-200
          bg-white
          shadow-2xl
        `
  }
`}
          >

            {/* CLOSE */}
            <button
              onClick={() =>
                setSelectedItem(null)
              }
              className={`
  absolute
  top-4
  right-5
  z-50

  text-4xl
  font-light

  transition

  ${
    theme === "dark"
      ? `
          text-cyan-300
          hover:text-cyan-100
        `
      : `
          text-slate-500
          hover:text-slate-900
        `
  }
`}
            >
              ×
            </button>

            <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12">

              {/* IMAGE SECTION */}
              <div>

                {/* MAIN IMAGE */}
                <div className={`
  flex
  items-center
  justify-center

  rounded-2xl
  p-10

  ${
    theme === "dark"
      ? "bg-[#071f35]"
      : "bg-slate-50"
  }
`}
>

                  <img
                    src={activeImage}
                    className="
                      max-h-[500px]
                      object-contain
                      transition-all duration-300
                      hover:scale-105
                    "
                  />

                </div>

                {/* THUMBNAIL */}
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                  {(
                    selectedItem.image_urls &&
                    selectedItem.image_urls
                      .length > 0
                      ? selectedItem.image_urls
                      : [
                          selectedItem.image_url,
                        ]
                  ).map(
                    (
                      img: string,
                      index: number
                    ) => (
                      <img
                        key={index}
                        src={img}
                        onClick={() =>
                          setActiveImage(
                            img
                          )
                        }
                        className={`
                          w-20 h-20 object-cover rounded-xl
                          border-2 cursor-pointer transition-all duration-300
                          hover:scale-105 flex-shrink-0
                          ${
                           activeImage === img
  ? theme === "dark"
    ? "border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
    : "border-blue-500"
  : theme === "dark"
    ? "border-cyan-400/20"
    : "border-slate-200"
                          }
                        `}
                      />
                    )
                  )}

                </div>

              </div>

              {/* DETAIL */}
              <div>

                <h1
  className={`
  text-4xl
  font-bold
  leading-tight

  ${
    theme === "dark"
      ? "text-white"
      : "text-slate-900"
  }
`}
>
                  {
                    selectedItem.item_name
                  }
                </h1>

                <p className={`
  mt-3
  text-lg

  ${
    theme === "dark"
      ? "text-gray-500"
      : "text-slate-500"
  }
`}>
                  {
                    selectedItem.category
                  }
                </p>

                <p className={`
  text-5xl
  font-bold
  mt-6

  ${
    theme === "dark"
      ? "text-cyan-300"
      : "text-green-600"
  }
`}>
                  Rp{" "}
                  {formatRupiah(
                    selectedItem.price
                  )}
                </p>

                {/* INFO */}
                <div
  className={`
  mt-10
  space-y-4

  text-sm

  border-t

  pt-6

  ${
    theme === "dark"
      ? `
          text-white/80
          border-cyan-400/10
        `
      : `
          text-slate-700
          border-slate-200
        `
  }
`}
>

                  <p>
                    <span className="font-bold">
                      Vendor:
                    </span>{" "}
                    {selectedItem.vendor ||
                      "-"}
                  </p>

                  <p>
                    <span className="font-bold">
                      Code:
                    </span>{" "}
                    {selectedItem.item_code ||
                      "-"}
                  </p>

                  <p>
                    <span className="font-bold">
                      UOM:
                    </span>{" "}
                    {selectedItem.UOM ||
                      "-"}
                  </p>

                  <p>
                    <span className="font-bold">
                      Manufacture:
                    </span>{" "}
                    {selectedItem.Manufacture ||
                      "-"}
                  </p>

                  <p>
                    <span className="font-bold">
                      Type:
                    </span>{" "}
                    {selectedItem.type ||
                      "-"}
                  </p>

                  <p>
                    <span className="font-bold">
                      Term:
                    </span>{" "}
                    {selectedItem.Term ||
                      "-"}
                  </p>

                  <p>
                    <span className="font-bold">
                      Remarks:
                    </span>{" "}
                    {selectedItem.Remarks ||
                      "-"}
                  </p>

                </div>

                {/* BUY BUTTONS */}
<div className="mt-10">

  <h2
    className="
      font-bold
      text-2xl
      mb-5
    "
  >
    Purchase Links
  </h2>

  <div className="flex flex-wrap gap-4">

    {/* TOKOPEDIA */}
    {selectedItem.tokopedia_url && (
      <a
        href={selectedItem.tokopedia_url}
        target="_blank"
        className="
          px-6 py-4 rounded-2xl
          bg-green-600
hover:bg-green-500
          text-white
          font-semibold
          hover:scale-105
          hover:shadow-xl
          transition-all
          duration-300
        "
      >
        Tokopedia
      </a>
    )}

    {/* SHOPEE */}
    {selectedItem.shopee_url && (
      <a
        href={selectedItem.shopee_url}
        target="_blank"
        className="
          px-6 py-4 rounded-2xl
          bg-orange-600
hover:bg-orange-500
          text-white
          font-semibold
          hover:scale-105
          hover:shadow-xl
          transition-all
          duration-300
        "
      >
        Shopee
      </a>
    )}

    {/* WHATSAPP */}
    {selectedItem.whatsapp_url && (
      <a
        href={selectedItem.whatsapp_url}
        target="_blank"
        className="
          px-6 py-4 rounded-2xl
          bg-black
          text-white
          font-semibold
          hover:scale-105
          hover:shadow-xl
          transition-all
          duration-300
        "
      >
        WhatsApp
      </a>
    )}

    {/* OFFICIAL */}
    {selectedItem.official_url && (
      <a
        href={selectedItem.official_url}
        target="_blank"
        className={`
  px-6
  py-4

  rounded-2xl

  border

  font-semibold

  transition-all
  duration-300

  hover:scale-105
  hover:shadow-xl

  ${
    theme === "dark"
      ? `
          border-cyan-400/30
          bg-cyan-500/10
          text-cyan-300
        `
      : `
          border-blue-200
          bg-blue-50
          text-blue-600
        `
  }
`}
      >
        Official Site
      </a>
    )}

  </div>

</div>

                {/* DESCRIPTION */}
                <div className="mt-12">

                  <h2 className="font-bold text-2xl mb-5">
                    Description
                  </h2> 

                  <div
  className={`
  whitespace-pre-line
  leading-8

  ${
    theme === "dark"
      ? "text-white/70"
      : "text-slate-600"
  }
`}
>
                    {selectedItem.description ||
                      "-"}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}
      </div>
    </main>
  );
}