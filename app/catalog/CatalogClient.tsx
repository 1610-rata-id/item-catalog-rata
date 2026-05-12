"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID").format(number || 0);
}

export default function Catalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<any | null>(null);

  const [activeImage, setActiveImage] = useState("");

  // PAGINATION
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const ITEMS_PER_PAGE = 20;

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

  // GET ITEMS
  async function getItems() {
    const from =
      (page - 1) * ITEMS_PER_PAGE;

    const to =
      from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from("items")
      .select("*")
      .order("item_name", {
        ascending: true,
      });

    // SEARCH
    if (debouncedSearch) {
      query = query.ilike(
        "item_name",
        `%${debouncedSearch}%`
      );
    }

    // CATEGORY
    if (selectedCategory !== "All") {
      query = query.eq(
        "category",
        selectedCategory
      );
    }

    // VENDOR
    if (selectedVendor !== "All") {
      query = query.eq(
        "vendor",
        selectedVendor
      );
    }

    const { data, error } =
      await query.range(from, to);

    if (error) {
      console.error(error);
      return;
    }

    setItems(data || []);
  }

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

  const categories = [
    "All",
    ...new Set(
      items.map((i) => i.category)
    ),
  ];

  const vendors = [
    "All",
    ...new Set(
      items.map((i) => i.vendor)
    ),
  ];

  return (
    <main className="bg-gray-100 min-h-screen font-[Poppins] text-black">

      {/* HEADER */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center z-50">

        {/* LOGO */}
        <img
          src="/logo.png"
          className="h-28 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() =>
            router.push("/")
          }
        />

        <div className="flex items-center gap-6 text-sm">

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

                {categories
                  .filter((c) =>
                    c
                      ?.toLowerCase()
                      .includes(
                        catSearch.toLowerCase()
                      )
                  )
                  .map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        handleCategoryChange(
                          cat
                        );

                        setShowCategory(
                          false
                        );
                      }}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                    >
                      {cat}
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
              className="hover:text-red-600 transition"
            >
              Vendor ▾
            </button>

            {showVendor && (
              <div className="absolute mt-2 bg-white shadow-2xl rounded-xl w-56 max-h-64 overflow-y-auto border z-50">

                <input
                  placeholder="Search..."
                  value={vendorSearch}
                  onChange={(e) =>
                    setVendorSearch(
                      e.target.value
                    )
                  }
                  className="w-full p-3 border-b outline-none"
                />

                {vendors
                  .filter((v) =>
                    v
                      ?.toLowerCase()
                      .includes(
                        vendorSearch.toLowerCase()
                      )
                  )
                  .slice(0, 10)
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
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
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

      {/* GRID */}
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
                  item.image_url
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

              <img
                src={item.image_url}
                className="
                  h-40 object-contain
                  transition-transform duration-500
                  hover:scale-110
                "
              />

            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="text-sm font-semibold line-clamp-2 min-h-[40px]">
                {item.item_name}
              </h2>

              <p className="text-xs text-gray-500 mt-2">
                {item.category}
              </p>

              <p className="text-xs text-gray-400">
                {item.vendor}
              </p>

              <p className="text-green-600 font-bold mt-3 text-lg">
                Rp{" "}
                {formatRupiah(
                  item.price
                )}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 pb-10">

        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="
            px-5 py-2 rounded-xl border
            bg-white hover:bg-gray-100
            disabled:opacity-50
          "
        >
          Previous
        </button>

        <div className="px-4 py-2 font-semibold">
          Page {page}
        </div>

        <button
          onClick={() =>
            setPage(page + 1)
          }
          className="
            px-5 py-2 rounded-xl border
            bg-white hover:bg-gray-100
          "
        >
          Next
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
            className="
              bg-white w-full max-w-6xl rounded-3xl
              overflow-hidden relative
              max-h-[90vh] overflow-y-auto
              shadow-2xl
            "
          >

            {/* CLOSE */}
            <button
              onClick={() =>
                setSelectedItem(null)
              }
              className="
                absolute top-4 right-5 z-50
                text-4xl font-light
                hover:text-red-500 transition
              "
            >
              ×
            </button>

            <div className="grid md:grid-cols-2 gap-10 p-8 md:p-12">

              {/* IMAGE SECTION */}
              <div>

                {/* MAIN IMAGE */}
                <div className="flex items-center justify-center bg-gray-100 rounded-2xl p-10">

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
                            activeImage ===
                            img
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
              <div>

                <h1 className="text-4xl font-bold leading-tight">
                  {
                    selectedItem.item_name
                  }
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                  {
                    selectedItem.category
                  }
                </p>

                <p className="text-green-600 text-5xl font-bold mt-6">
                  Rp{" "}
                  {formatRupiah(
                    selectedItem.price
                  )}
                </p>

                {/* INFO */}
                <div className="mt-10 space-y-4 text-sm">

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

                {/* DESCRIPTION */}
                <div className="mt-12">

                  <h2 className="font-bold text-2xl mb-5">
                    Description
                  </h2>

                  <div className="whitespace-pre-line text-gray-700 leading-8">
                    {selectedItem.description ||
                      "-"}
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