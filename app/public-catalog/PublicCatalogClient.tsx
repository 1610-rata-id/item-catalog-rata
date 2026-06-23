"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useTheme } from "@/app/providers/ThemeProvider";
import {
  Sun,
  Moon,
  Share2
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PublicCatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

const {
  theme,
  toggleTheme
} = useTheme();

  const [items, setItems] = useState<any[]>([]);

  const [
    hierarchicalCategories,
    setHierarchicalCategories,
  ] = useState<Record<string, string[]>>({});

  const [
    expandedCategory,
    setExpandedCategory,
  ] = useState<string | null>(null);

  const [totalItems, setTotalItems] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  // MODAL
  const [selectedItem, setSelectedItem] =
    useState<any | null>(null);

  const [activeImage, setActiveImage] =
  useState<string | null>(null);

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const ITEMS_PER_PAGE = 100;

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [debouncedSearch, setDebouncedSearch] =
    useState(search);

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") || "All"
    );

  const [showCategory, setShowCategory] =
    useState(false);

  const [showSuggestion, setShowSuggestion] =
  useState(false);

const [
  suggestionCategory,
  setSuggestionCategory
] = useState("FEATURE_REQUEST");

const [
  suggestionMessage,
  setSuggestionMessage
] = useState("");

const [
  sendingSuggestion,
  setSendingSuggestion
] = useState(false);

const [
  senderName,
  setSenderName
] = useState("");

const [
  senderEmail,
  setSenderEmail
] = useState("");

const [
  division,
  setDivision
] = useState("");

const [
  office,
  setOffice
] = useState("");

  const [catSearch, setCatSearch] =
    useState("");

  const catRef = useRef<any>(null);

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  // GET FILTERS
  async function getFilters() {
    const { data, error } = await supabase
      .from("public_items")
      .select(`
        category,
        main_category,
        sub_category
      `);

    if (error) {
      console.log(error);
      return;
    }

    const hierarchyMap = new Map<
      string,
      Set<string>
    >();

    const legacySet = new Set<string>();

    data?.forEach((item: any) => {
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

      if (main !== "") {
        if (!hierarchyMap.has(main)) {
          hierarchyMap.set(
            main,
            new Set()
          );
        }

        if (sub !== "") {
          hierarchyMap
            .get(main)
            ?.add(sub);
        }
      }

      if (item.category) {
        legacySet.add(
          item.category.trim()
        );
      }
    });

    const hierarchyObject: Record<
      string,
      string[]
    > = {};

    hierarchyMap.forEach(
      (subs, main) => {
        hierarchyObject[main] =
          Array.from(subs).sort();
      }
    );

    Array.from(legacySet).forEach(
      (cat) => {
        if (!cat) return;

        const alreadyExists =
          Object.entries(
            hierarchyObject
          ).some(
            ([main, subs]) =>
              cat === main ||
              subs.includes(cat) ||
              cat.startsWith(main)
          );

        if (!alreadyExists) {
          hierarchyObject[cat] = [];
        }
      }
    );

    setHierarchicalCategories(
      hierarchyObject
    );
  }

  // GET ITEMS
  async function getItems() {
    setLoading(true);

    const from =
      (page - 1) * ITEMS_PER_PAGE;

    const to =
      from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from("public_items")
      .select(
        `
        id,
        slug,
        item_name,
        category,
        main_category,
        sub_category,
        description,
        image_url,
        image_urls,
        item_code,
        UOM
      `,
        { count: "exact" }
      )
      .order("item_name", {
        ascending: true,
      });

    // SEARCH
    if (debouncedSearch.trim()) {
      const keyword =
        debouncedSearch.trim();

      query = query.or(
        [
          `item_name.ilike.%${keyword}%`,
          `category.ilike.%${keyword}%`,
          `item_code.ilike.%${keyword}%`,
          `main_category.ilike.%${keyword}%`,
          `sub_category.ilike.%${keyword}%`,
        ].join(",")
      );
    }

    // CATEGORY
    if (selectedCategory !== "All") {
      query = query.or(
        [
          `category.eq.${selectedCategory}`,
          `main_category.eq.${selectedCategory}`,
          `sub_category.eq.${selectedCategory}`,
        ].join(",")
      );
    }

    query = query.range(from, to);

    const {
      data,
      error,
      count,
    } = await query;

    if (error) {
      console.log(error);
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

  useEffect(() => {
    getFilters();
  }, []);

  function updateURL(
    searchValue: string,
    categoryValue: string
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

    params.set("page", String(page));

    router.replace(
      `/public-catalog?${params.toString()}`
    );
  }

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

  function toggleCategory(main: string) {
    setExpandedCategory(
      expandedCategory === main
        ? null
        : main
    );
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () =>
      clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    getItems();

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
    page,
  ]);

  useEffect(() => {
    updateURL(
      debouncedSearch,
      selectedCategory
    );
  }, [
    debouncedSearch,
    selectedCategory,
    page,
  ]);

  async function submitSuggestion() {

  if (
  !senderName.trim() ||
  !senderEmail.trim() ||
  !division.trim() ||
  !office.trim() ||
  !suggestionMessage.trim()
) {
  alert(
    "Please complete all fields."
  );
  return;
}

  try {

    setSendingSuggestion(true);

    const { error } =
      await supabase
        .from("feedbacks")
        .insert([
          {
            user_email:
              "PUBLIC_USER",

            category:
              suggestionCategory,

            message:
              suggestionMessage,

            status:
              "OPEN",

            page:
              window.location.pathname,

            page_url:
              window.location.href,

            item_name:
              selectedItem
                ?.item_name || null,

            item_id:
  selectedItem
    ?.id || null,

source:
  "EXTERNAL",

sender_name:
  senderName,

sender_email:
  senderEmail,

division:
  division,

office:
  office,
          },
        ]);

    if (error) {
      throw error;
    }

    alert(
      "Suggestion submitted successfully!"
    );

    setSuggestionMessage("");

setSuggestionCategory(
  "FEATURE_REQUEST"
);

setSenderName("");

setSenderEmail("");

setDivision("");

setOffice("");

setShowSuggestion(false);

  } catch (err: any) {

    console.error(err);

    alert(
      err.message ||
      "Failed to submit suggestion."
    );

  } finally {

    setSendingSuggestion(false);

  }

}

  useEffect(() => {
    const close = (e: any) => {
      if (
        !catRef.current?.contains(e.target)
      ) {
        setShowCategory(false);
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

  return (
    <main
  className={`
    min-h-screen
    font-[Poppins]
    relative

    ${
      theme === "dark"
        ? "text-white bg-[#031427]"
        : "text-slate-800 bg-[#f5f7fb]"
    }
  `}
>

      {/* HEADER */}
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

      {/* MODAL DETAIL */}
      {selectedItem && (

        <div
          className="
            fixed inset-0 z-[999]
            bg-black/70
            backdrop-blur-sm
            overflow-y-auto custom-scrollbar
            p-4
          "
        >

          <div
            className="
              min-h-screen
              flex
              items-center
              justify-center
            "
          >

            <div
  className={`
    w-full
    max-w-7xl
    rounded-[32px]
    overflow-hidden
    relative
    shadow-2xl

    ${
      theme === "dark"
        ? `
          bg-[#071d33]
          text-white
        `
        : `
          bg-white
          text-slate-900
        `
    }
  `}
>

        {/* ACTION BUTTONS */}

<div
  className="
    absolute
    top-5
    right-6
    z-50

    flex
    items-center
    gap-3
  "
>

  {/* SHARE */}

  <button
    onClick={() => {

      const shareUrl =
        `${window.location.origin}/public-catalog/${selectedItem.slug}`;

      navigator.clipboard.writeText(
        shareUrl
      );

      alert(
        "Link copied to clipboard"
      );
    }}
    className={`
      w-11
      h-11

      rounded-xl

      flex
      items-center
      justify-center

      transition

      ${
        theme === "dark"
          ? `
              bg-cyan-500/10
              border border-cyan-300/20
              text-cyan-300
            `
          : `
              bg-blue-50
              border border-blue-200
              text-blue-600
            `
      }

      hover:scale-105
    `}
  >
    <Share2 size={20} />
  </button>

  {/* CLOSE */}

  <button
    onClick={() =>
      setSelectedItem(null)
    }
    className="
      text-5xl
      font-light

      hover:text-red-500

      transition
    "
  >
    ×
  </button>

</div>

              <div className="grid md:grid-cols-2 gap-10 p-6 md:p-10">

                {/* IMAGE */}
                <div>

                  <div
  className={`
    rounded-3xl
    p-8
    flex
    items-center
    justify-center
    h-[500px]

    ${
      theme === "dark"
        ? "bg-[#0b2745]"
        : "bg-slate-50"
    }
  `}
>

                    {activeImage ? (
  <img
    src={activeImage}
    alt={selectedItem.item_name}
    className="
      max-h-full
      object-contain
      transition-all
      duration-300
      hover:scale-105
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
      text-slate-400
    "
  >
    No Image Available
  </div>
)}

                  </div>

                  {/* THUMB */}
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                    {(
  selectedItem.image_urls &&
  selectedItem.image_urls.length > 0
    ? selectedItem.image_urls
    : selectedItem.image_url
      ? [selectedItem.image_url]
      : []
)
.map(
                      (
                        img: string,
                        index: number
                      ) => (

                        <img
                          key={index}
                          src={img}
                          onClick={() =>
                            setActiveImage(img)
                          }
                          className={`
                            w-24
                            h-24
                            rounded-2xl
                            object-cover
                            border-2
                            cursor-pointer
                            transition
                            hover:scale-105
                            ${
                              activeImage === img
  ? "border-cyan-400"
  : theme === "dark"
    ? "border-cyan-300/20"
    : "border-slate-200"
                            }
                          `}
                        />

                      )
                    )}

                  </div>

                </div>

                {/* DETAIL */}
                <div className="py-2">

                  <h1
                    className="
                      text-4xl
                      font-bold
                      leading-tight
                    "
                  >
                    {selectedItem.item_name}
                  </h1>

                  <p
  className={`
    mt-3
    text-lg

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-blue-600"
    }
  `}
>
                    {selectedItem.category}
                  </p>

                  {/* INFO */}
                  <div className="mt-10 space-y-4 text-base">

                    <p>
                      <span className="font-bold">
                        Code:
                      </span>{" "}
                      {selectedItem.item_code || "-"}
                    </p>

                    <p>
                      <span className="font-bold">
                        UOM:
                      </span>{" "}
                      {selectedItem.UOM || "-"}
                    </p>

                    <p>
                      <span className="font-bold">
                        Main Category:
                      </span>{" "}
                      {selectedItem.main_category || "-"}
                    </p>

                    <p>
                      <span className="font-bold">
                        Sub Category:
                      </span>{" "}
                      {selectedItem.sub_category || "-"}
                    </p>

                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-12">

                    <h2
                      className="
                        text-2xl
                        font-bold
                        mb-5
                      "
                    >
                      Description
                    </h2>

                    <div
  className={`
    whitespace-pre-line
    leading-8

    ${
      theme === "dark"
        ? "text-white/80"
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

        </div>

      )}

{showSuggestion && (

  <div
    className="
      fixed
      inset-0
      z-[999]

      bg-black/70

      flex
      items-center
      justify-center

      p-4
    "
  >

    <div
      className={`
        w-full
        max-w-xl
        rounded-3xl
        p-8
        relative
        max-h-[90vh]
        overflow-y-auto

        ${
          theme === "dark"
            ? `
              bg-[#071d33]
              text-white
              border border-cyan-300/20
            `
            : `
              bg-white
              text-slate-900
              border border-slate-200
            `
        }
      `}
    >

      <button
        onClick={() =>
          setShowSuggestion(false)
        }
        className="
  absolute
  top-4
  right-5

  text-3xl

  z-50
"
      >
        ×
      </button>

      <h2
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Suggestion Box
      </h2>

      {/* NAME */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Name *
  </label>

  <input
    value={senderName}
    onChange={(e) =>
      setSenderName(
        e.target.value
      )
    }
    placeholder="Your name"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

{/* EMAIL */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Email *
  </label>

  <input
    type="email"
    value={senderEmail}
    onChange={(e) =>
      setSenderEmail(
        e.target.value
      )
    }
    placeholder="your@email.com"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

{/* DIVISION */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Division *
  </label>

  <input
    value={division}
    onChange={(e) =>
      setDivision(
        e.target.value
      )
    }
    placeholder="Procurement"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

{/* OFFICE */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Office *
  </label>

  <input
    value={office}
    onChange={(e) =>
      setOffice(
        e.target.value
      )
    }
    placeholder="Jakarta"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

      {/* CATEGORY */}

      <div className="mb-4">

        <label
          className="
            block
            mb-2
            text-sm
            opacity-70
          "
        >
          Category
        </label>

        <select
          value={suggestionCategory}
          onChange={(e) =>
            setSuggestionCategory(
              e.target.value
            )
          }
          className={`
            w-full

            px-4
            py-3

            rounded-xl

            border

            ${
              theme === "dark"
                ? `
                    bg-[#0d2742]
                    border-cyan-300/20
                    text-white
                  `
                : `
                    bg-white
                    border-slate-300
                    text-slate-900
                  `
            }
          `}
        >
          <option value="BUG">
                  Bug Report
                </option>

                <option value="FEATURE_REQUEST">
                  Feature Request
                </option>

                <option value="CATALOG_DATA">
                  Catalog Data Issue
                </option>

                <option value="UI_SUGGESTION">
                  UI/UX Suggestion
                </option>

                <option value="OTHER">
                  Other
                </option>


        </select>

      </div>

      {/* MESSAGE */}

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            opacity-70
          "
        >
          Message
        </label>

        <textarea
          rows={6}
          value={suggestionMessage}
          onChange={(e) =>
            setSuggestionMessage(
              e.target.value
            )
          }
          placeholder="Describe your suggestion..."
          className={`
            w-full

            px-4
            py-3

            rounded-xl

            border

            resize-none

            ${
              theme === "dark"
                ? `
                    bg-[#0d2742]
                    border-cyan-300/20
                    text-white
                  `
                : `
                    bg-white
                    border-slate-300
                    text-slate-900
                  `
            }
          `}
        />
      </div>

      <button
        onClick={
          submitSuggestion
        }
        disabled={
          sendingSuggestion
        }
        className="
          mt-6

          w-full

          py-3

          rounded-xl

          bg-cyan-500

          text-white

          font-semibold

          hover:bg-cyan-600

          transition

          disabled:opacity-50
        "
      >
        {sendingSuggestion
          ? "Submitting..."
          : "Submit Suggestion"}
      </button>

    </div>

  </div>

)}
    </main>
  );
}