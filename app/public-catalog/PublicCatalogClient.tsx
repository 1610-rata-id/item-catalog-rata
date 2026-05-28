"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PublicCatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    useState("");

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
          `description.ilike.%${keyword}%`,
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
    <main className="bg-[#f8f8f7] min-h-screen font-[Poppins] text-black">

      {/* HEADER */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center z-50">

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
            className="hover:text-red-600 transition"
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
              className="hover:text-red-600 transition"
            >
              Category ▾
            </button>

            {showCategory && (
              <div className="absolute mt-2 bg-white shadow-2xl rounded-xl w-56 max-h-64 overflow-y-auto border z-50">

                <input
                  placeholder="Search..."
                  value={catSearch}
                  onChange={(e) =>
                    setCatSearch(
                      e.target.value
                    )
                  }
                  className="w-full p-3 border-b outline-none"
                />

                <div
                  onClick={() => {
                    handleCategoryChange(
                      "All"
                    );

                    setShowCategory(false);
                  }}
                  className={`
                    px-4 py-3 cursor-pointer transition
                    hover:bg-gray-100 border-b
                    ${
                      selectedCategory ===
                      "All"
                        ? "bg-red-50 text-red-600 font-semibold"
                        : ""
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
                        className="border-b"
                      >
                        <button
                          onClick={() =>
                            toggleCategory(
                              main
                            )
                          }
                          className="
                            w-full
                            flex
                            justify-between
                            items-center
                            px-4 py-3
                            hover:bg-gray-50
                            transition
                            font-semibold
                          "
                        >
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
                                  px-8 py-2
                                  text-sm
                                  text-gray-500
                                  cursor-pointer
                                  hover:bg-gray-100
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
                                    px-8 py-2
                                    cursor-pointer
                                    text-sm
                                    hover:bg-gray-100
                                    transition
                                    ${
                                      selectedCategory ===
                                      sub
                                        ? "bg-red-50 text-red-600 font-medium"
                                        : "text-gray-600"
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
            className="
              px-5 py-2 rounded-full
              border bg-white
              outline-none
              focus:ring-2 focus:ring-red-500
              transition
            "
          />
        </div>
      </div>

      {/* BANNER */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div
          className="
            relative overflow-hidden rounded-[32px]
            shadow-sm border border-gray-100
            bg-white
          "
        >
          <img
            src="/banner-catalog.png"
            alt="Catalog Banner"
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

        <p className="text-sm text-gray-500">
          Menampilkan{" "}
          <span className="font-semibold">
            {items.length}
          </span>{" "}
          dari{" "}
          <span className="font-semibold">
            {totalItems}
          </span>{" "}
          item
        </p>
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
                    item.image_url || ""
                  );

                }

              }}
              className="
                bg-white rounded-2xl overflow-hidden
                shadow-sm cursor-pointer
                transition-all duration-300
                hover:-translate-y-2
                hover:shadow-2xl
              "
            >

              {/* IMAGE */}
              <div className="h-52 bg-gray-50 flex items-center justify-center overflow-hidden">

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

                <h2 className="text-sm font-semibold line-clamp-2 min-h-[40px]">
                  {item.item_name}
                </h2>

                <p className="text-xs text-gray-500 mt-2">
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
    className="
      px-4 py-2 rounded-xl border
      bg-white hover:bg-gray-100
      disabled:opacity-40
      transition
    "
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
                  ? "bg-red-500 text-white border-red-500 shadow-lg"
                  : "bg-white hover:bg-gray-100"
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
    className="
      px-4 py-2 rounded-xl border
      bg-white hover:bg-gray-100
      disabled:opacity-40
      transition
    "
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
            overflow-y-auto
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
              className="
                bg-white
                w-full
                max-w-7xl
                rounded-[32px]
                overflow-hidden
                relative
                shadow-2xl
              "
            >

              {/* CLOSE */}
              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="
                  absolute
                  top-5
                  right-6
                  text-5xl
                  font-light
                  z-50
                  hover:text-red-500
                  transition
                "
              >
                ×
              </button>

              <div className="grid md:grid-cols-2 gap-10 p-6 md:p-10">

                {/* IMAGE */}
                <div>

                  <div
                    className="
                      bg-gray-100
                      rounded-3xl
                      p-8
                      flex
                      items-center
                      justify-center
                      h-[500px]
                    "
                  >

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

                  </div>

                  {/* THUMB */}
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                    {(
                      selectedItem.image_urls &&
                      selectedItem.image_urls.length > 0
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
                                ? "border-red-500"
                                : "border-gray-200"
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

                  <p className="text-gray-500 mt-3 text-lg">
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
                      className="
                        whitespace-pre-line
                        text-gray-700
                        leading-8
                      "
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

    </main>
  );
}