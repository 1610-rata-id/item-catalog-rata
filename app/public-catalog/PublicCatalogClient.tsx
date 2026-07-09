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
import ImageViewer from "@/app/components/catalog/ImageViewer";
import ShareMenu from "@/app/components/catalog/ShareMenu";
import PublicMobileCatalog from "./components/PublicMobileCatalog";
import PublicHeader from "./desktop/PublicHeader";
import PublicDesktopCatalog from "./desktop/PublicDesktopCatalog";
import PublicDetailModal from "./modals/PublicDetailModal";
import PublicSuggestionModal from "./modals/PublicSuggestionModal";
import PublicImageViewer from "./viewers/PublicImageViewer";
import PublicMobileDetail from "./detail/PublicMobileDetail";

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

const [
  showImageViewer,
  setShowImageViewer,
] = useState(false);

const [
  showShareMenu,
  setShowShareMenu,
] = useState(false);

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

<>

  {/* MOBILE */}

  <div className="block md:hidden">

    <PublicMobileCatalog

      theme={theme}

      items={items}

      totalItems={totalItems}

      page={page}

      totalPages={totalPages}

      setPage={setPage}

      search={search}

      handleSearch={handleSearch}

      toggleTheme={toggleTheme}

      selectedCategory={selectedCategory}

      handleCategoryChange={handleCategoryChange}

      hierarchicalCategories={hierarchicalCategories}

      setSelectedItem={setSelectedItem}
      setActiveImage={setActiveImage}

      onSuggestionClick={() => {

        setShowSuggestion(true);

      }}

    />

  </div>

  {/* DESKTOP */}

  <div className="hidden md:block">

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

      <PublicDesktopCatalog
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
        items={items}
        totalItems={totalItems}
        loading={loading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        setSelectedCategory={setSelectedCategory}
        setSelectedItem={setSelectedItem}
        setActiveImage={setActiveImage}
        setShowShareMenu={setShowShareMenu}
      />

    </main>

  </div>

{/* ===== GLOBAL DETAIL ===== */}

{selectedItem && (
  <>
    {/* MOBILE */}

    <div className="block md:hidden">

      <PublicMobileDetail
  theme={theme}
  selectedItem={selectedItem}
  setSelectedItem={setSelectedItem}
/>

    </div>

    {/* DESKTOP */}

    <div className="hidden md:block">

      <PublicDetailModal
        theme={theme}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        showImageViewer={showImageViewer}
        setShowImageViewer={setShowImageViewer}
        showShareMenu={showShareMenu}
        setShowShareMenu={setShowShareMenu}
        shareUrl={`${window.location.origin}/public-catalog/${selectedItem.slug}`}
      />

    </div>
  </>
)}

  <PublicSuggestionModal
    theme={theme}
    showSuggestion={showSuggestion}
    setShowSuggestion={setShowSuggestion}
    suggestionCategory={suggestionCategory}
    setSuggestionCategory={setSuggestionCategory}
    suggestionMessage={suggestionMessage}
    setSuggestionMessage={setSuggestionMessage}
    sendingSuggestion={sendingSuggestion}
    senderName={senderName}
    setSenderName={setSenderName}
    senderEmail={senderEmail}
    setSenderEmail={setSenderEmail}
    division={division}
    setDivision={setDivision}
    office={office}
    setOffice={setOffice}
    submitSuggestion={submitSuggestion}
  />

  <PublicImageViewer
    open={showImageViewer}
    image={activeImage || ""}
    images={
      selectedItem?.image_urls &&
      selectedItem.image_urls.length > 0
        ? selectedItem.image_urls
        : selectedItem?.image_url
        ? [selectedItem.image_url]
        : []
    }
    onClose={() =>
      setShowImageViewer(false)
    }
  />

</>

);
}