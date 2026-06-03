"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import {
  Package,
  Building2,
  Tags,
} from "lucide-react";


function formatRupiah(number: number) {
  return new Intl.NumberFormat(
    "id-ID"
  ).format(number || 0);
}

export default function AdminDashboard() {
  const router = useRouter();

  const {
    loading: authLoading,
    role,
  } = useRequireAuth([
    "admin",
    "procurement",
  ]);

  const [loading, setLoading] =
    useState(true);

  const [items, setItems] = useState<
    any[]
  >([]);
  
  const [stats, setStats] = useState({
  totalItems: 0,
  totalVendors: 0,
  totalCategories: 0,
});

  const [search, setSearch] =
    useState("");
  const [page, setPage] =
  useState(1);

const ITEMS_PER_PAGE = 100;

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/admin/login");
  }

  async function getStats() {
  const { data } =
    await supabase
      .from("items")
      .select(
        "vendor, main_category, category"
      );

  const rows = data || [];

  setStats({
    totalItems: rows.length,

    totalVendors: new Set(
      rows
        .map((i) => i.vendor)
        .filter(Boolean)
    ).size,

    totalCategories: new Set(
      rows
        .map(
          (i) =>
            i.main_category ||
            i.category
        )
        .filter(Boolean)
    ).size,
  });
}

  async function getItems() {
  const from =
    (page - 1) *
    ITEMS_PER_PAGE;

  const to =
    from +
    ITEMS_PER_PAGE -
    1;

  let query = supabase
  .from("items")
  .select("*")
  .order("created_at", {
    ascending: false,
  })
  .range(from, to);

if (search.trim()) {
  query = query.or(
    `item_name.ilike.%${search}%,vendor.ilike.%${search}%,category.ilike.%${search}%,description.ilike.%${search}%,item_code.ilike.%${search}%,type.ilike.%${search}%`
  );
}

  const { data, error } =
    await query;

  if (error) {
  console.log("SUPABASE ERROR");
  console.log(error.message);
  console.log(error.details);
  console.log(error.hint);
  console.log(error.code);
  return;
}

  const allItems = data || [];

setItems(allItems);

setStats({
  totalItems: allItems.length,

  totalVendors: new Set(
    allItems
      .map((i) => i.vendor)
      .filter(Boolean)
  ).size,

  totalCategories: new Set(
    allItems
      .map(
        (i) =>
          i.main_category ||
          i.category
      )
      .filter(Boolean)
  ).size,
});

}

  async function deleteItem(
    id: string
  ) {
    const confirmDelete = confirm(
      "Delete this item?"
    );

    if (!confirmDelete) return;

    const { error } =
      await supabase
        .from("items")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    getItems();
  }

  useEffect(() => {
  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    setLoading(false);
	
    getItems();
  }

  checkUser();

getStats();

  // REALTIME
  const channel = supabase
    .channel("items-realtime")

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
}, [router]);

  useEffect(() => {
    getItems();
  }, [search, page]);

  if (
  loading ||
  authLoading
) {
    return (
      <main className="p-10 text-cyan-200">
        Checking auth...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen text-white">

  <img
    src="/hero-v2.jpg"
    alt="background"
    className="
      absolute inset-0
      w-full h-full
      object-cover
    "
  />

  <div className="relative z-10 p-10">

      <div className="max-w-[1800px] mx-auto px-8 flex gap-8">
   <AdminSidebar />

<div className="flex-1">

        {/* HERO */}
<div
  className="
    relative
    overflow-hidden
    rounded-[32px]
    border border-cyan-300/20
    bg-white/5
    backdrop-blur-xl
    mb-8
    min-h-[340px]
  "
>

  {/* Banner Background */}
  <img
    src="/admin-hero.png"
    alt="banner"
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      opacity-90
    "
  />

  {/* Overlay */}
  <div
    className="
      absolute inset-0
      bg-gradient-to-r
      from-[#031427]
      via-[#031427]/80
      to-transparent
    "
  />

  {/* Content */}
  <div className="relative z-10 p-10">

    <p
      className="
        uppercase
        tracking-[6px]
        text-cyan-300
        text-sm
      "
    >
      ITEM CATALOG SYSTEM
    </p>

    <h1
      className="
        mt-4
        text-7xl
        font-bold
        text-white
      "
    >
      Admin Dashboard
    </h1>

    <p
      className="
        mt-3
        text-white/70
        text-lg
      "
    >
      Manage Internal Catalog
    </p>

  </div>

</div>

        {/* STATS */}

<div className="grid grid-cols-3 gap-6 mb-8">

  {/* TOTAL ITEMS */}

  <div
    className="
      rounded-[28px]
      border border-cyan-300/20
      bg-white/5
      backdrop-blur-xl
      p-6

      flex
      justify-between
      items-center
    "
  >
    <div>
      <p className="text-cyan-300 text-sm uppercase tracking-[3px]">
        Total Items
      </p>

      <h2
        className="
          text-5xl
          font-bold
          mt-3

          text-white
          drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]
        "
      >
        {stats.totalItems}
      </h2>
    </div>

    <div
      className="
        w-16 h-16
        rounded-full
        border border-cyan-300/20

        flex
        items-center
        justify-center
      "
    >
      <Package
        size={28}
        className="text-cyan-300"
      />
    </div>
  </div>

  {/* VENDORS */}

  <div
    className="
      rounded-[28px]
      border border-cyan-300/20
      bg-white/5
      backdrop-blur-xl
      p-6

      flex
      justify-between
      items-center
    "
  >
    <div>
      <p className="text-cyan-300 text-sm uppercase tracking-[3px]">
        Vendors
      </p>

      <h2
        className="
          text-5xl
          font-bold
          mt-3

          text-white
          drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]
        "
      >
        {stats.totalVendors}
      </h2>
    </div>

    <div
      className="
        w-16 h-16
        rounded-full
        border border-cyan-300/20

        flex
        items-center
        justify-center
      "
    >
      <Building2
        size={28}
        className="text-cyan-300"
      />
    </div>
  </div>

  {/* CATEGORIES */}

  <div
    className="
      rounded-[28px]
      border border-cyan-300/20
      bg-white/5
      backdrop-blur-xl
      p-6

      flex
      justify-between
      items-center
    "
  >
    <div>
      <p className="text-cyan-300 text-sm uppercase tracking-[3px]">
        Categories
      </p>

      <h2
        className="
          text-5xl
          font-bold
          mt-3

          text-white
          drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]
        "
      >
        {stats.totalCategories}
      </h2>
    </div>

    <div
      className="
        w-16 h-16
        rounded-full
        border border-cyan-300/20

        flex
        items-center
        justify-center
      "
    >
      <Tags
        size={28}
        className="text-cyan-300"
      />
    </div>
  </div>

</div>

        {/* SEARCH */}

<div
  className="
    mb-8
    rounded-[28px]
    border border-cyan-300/20
    bg-white/5
    backdrop-blur-xl
    px-6 py-5

    flex items-center gap-4
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="text-cyan-300"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
    />
  </svg>

  <input
    placeholder="Search item..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="
      flex-1
      bg-transparent
      text-white
      outline-none
      placeholder:text-white/40
    "
  />
</div>

        {/* TABLE */}
        <div
  className="
    rounded-[32px]
    border border-cyan-300/20
    bg-white/5
    backdrop-blur-xl
    overflow-hidden
  "
>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-transparent">

                <tr
                  className="
                    text-left
                    text-cyan-200
                  "
                >

                  <th
                    className="
                      p-5 font-bold
                      text-cyan-200                    "
                  >
                    Image
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-cyan-200
                    "
                  >
                    Item Name
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-cyan-200
                    "
                  >
                    Vendor
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-cyan-200
                    "
                  >
                    Category
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-cyan-200
                    "
                  >
                    Price
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-cyan-200
                    "
                  >
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="
                      border-t border-cyan-300/10
                      hover:bg-cyan-400/5
                      transition-all
                      duration-300
                    "
                  >

                    {/* IMAGE */}
                    <td className="p-5">

                      {item.image_url ? (
                        <Image
  src={item.image_url}
  alt={item.item_name}
  width={80}
  height={80}
  className="
    w-16 h-16
    object-cover
    rounded-xl
    border
    border-gray-300
  "
/>
                      ) : (
                        <div
                          className="
                            w-16 h-16
                            rounded-xl border
                            border-gray-300
                            bg-cyan-500/5
                            flex items-center
                            justify-center
                            text-xs text-cyan-100/80
                          "
                        >
                          IMG
                        </div>
                      )}

                    </td>

                    {/* NAME */}
                    <td
                      className="
                        p-5 font-semibold
                        text-white-200
                      "
                    >
                      {
                        item.item_name
                      }
                    </td>

                    {/* VENDOR */}
                    <td
                      className="
                        p-5
                        text-white-800
                        font-medium
                      "
                    >
                      {item.vendor || "-"}
                    </td>

                    {/* CATEGORY */}
                    <td
                      className="
                        p-5
                        text-white-800
                        font-medium
                      "
                    >
                      {item.category || "-"}
                    </td>

                    {/* PRICE */}
                    <td
                      className="
                        p-5 font-bold
                        text-cyan-300
drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]
                      "
                    >
                      Rp{" "}
                      {formatRupiah(
                        item.price
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="p-5">

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            router.push(
                              `/admin/edit-item/${item.id}`
                            )
                          }
                          className="
px-5 py-2

rounded-xl

border
border-cyan-400/30

bg-cyan-500/10

text-cyan-300

hover:bg-cyan-500/20

transition
"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteItem(
                              item.id
                            )
                          }
                          className="
px-5 py-2

rounded-xl

border
border-red-400/30

bg-red-500/10

text-red-300

hover:bg-red-500/20

transition
"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

{/* PAGINATION */}
<div className="flex justify-center gap-4 mt-10">

  <button
    disabled={page === 1}
    onClick={() =>
      setPage(page - 1)
    }
    className="
      px-5 py-3 rounded-xl
      border bg-white
      disabled:opacity-50
    "
  >
    Previous
  </button>

  <div className="px-4 py-3 font-semibold">
    Page {page}
  </div>

  <button
    onClick={() =>
      setPage(page + 1)
    }
    className="
      px-5 py-3 rounded-xl
      border bg-white
    "
  >
    Next
  </button>

</div>

</div>

</div>

</div>

</main>
  );
}