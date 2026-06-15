"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import {
  Package,
  Building2,
  Tags,
  User,
  PlusSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";


function formatRupiah(number: number) {
  return new Intl.NumberFormat(
    "id-ID"
  ).format(number || 0);
}

function getActionBadge(
  action: string
) {
  switch (action) {
    case "LOGIN":
      return "🟢 Login";

    case "LOGOUT":
      return "⚪ Logout";

    case "CREATE_ITEM":
      return "🔵 Add Item";

    case "UPDATE_ITEM":
      return "🟡 Edit Item";

    case "DELETE_ITEM":
      return "🔴 Delete Item";

    default:
      return action;
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const { theme } = useTheme();

  const {
    loading: authLoading,
    role,
  } = useRequireAuth([
    "admin",
  ]);

  const [loading, setLoading] =
    useState(true);

  const [items, setItems] = useState<
    any[]
  >([]);

  const [activityStats, setActivityStats] =
  useState({
    login: 0,
    create: 0,
    update: 0,
    delete: 0,
  });

  const [recentLogs, setRecentLogs] =
  useState<any[]>([]);
  
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

   async function getActivityStats() {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const { data } =
    await supabase
      .from("audit_logs")
      .select(
        "action, created_at"
      );

  const rows =
    (data || []).filter(
      (log) =>
        log.created_at?.startsWith(
          today
        )
    );

  setActivityStats({
    login: rows.filter(
      (x) =>
        x.action === "LOGIN"
    ).length,

    create: rows.filter(
      (x) =>
        x.action ===
        "CREATE_ITEM"
    ).length,

    update: rows.filter(
      (x) =>
        x.action ===
        "UPDATE_ITEM"
    ).length,

    delete: rows.filter(
      (x) =>
        x.action ===
        "DELETE_ITEM"
    ).length,
  });
}

  async function getRecentLogs() {
  const { data, error } =
    await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

  if (error) {
    console.log(error);
    return;
  }

  setRecentLogs(data || []);
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

    const {
  data: { user },
} = await supabase.auth.getUser();

   const { data: itemToDelete } =
  await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

    const { error } =
      await supabase
        .from("items")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }
    if (
  user?.email &&
  itemToDelete
) {
  await createAuditLog({
    userEmail: user.email,

    action: "DELETE_ITEM",

    itemId: itemToDelete.id,

    itemName:
      itemToDelete.item_name,

    oldData:
      itemToDelete,
  });
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
getActivityStats();
getRecentLogs();

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
      getStats();
      getActivityStats();
      getRecentLogs();
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
    <main
  className={`
    relative
    min-h-screen

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
>

  <img
  src={
    theme === "dark"
      ? "/dark/home-hero.jpg"
      : "/light/home-hero.jpg"
  }
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
  className={`
    relative
    overflow-hidden
    rounded-[32px]

    border

    mb-8
    min-h-[340px]

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

  {/* Banner Background */}
  <img
  src={
    theme === "dark"
      ? "/dark/dashboard-hero.jpg"
      : "/light/dashboard-hero.jpg"
  }
  alt="banner"
  className="
    absolute
    inset-0
    w-full
    h-full
    object-cover
  "
/>

  {/* Overlay */}
  <div
  className={`
    absolute inset-0

    ${
      theme === "dark"
        ? `
          bg-gradient-to-r
          from-[#031427]
          via-[#031427]/80
          to-transparent
        `
        : `
          bg-gradient-to-r
          from-white/70
          via-white/30
          to-transparent
        `
    }
  `}
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
  className={`
    mt-4
    text-7xl
    font-bold

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
>
      Admin Dashboard
    </h1>

    <p
  className={`
    mt-3
    text-lg

    ${
      theme === "dark"
        ? "text-white/70"
        : "text-slate-600"
    }
  `}
>
      Manage Internal Catalog
    </p>

  </div>

</div>

        {/* STATS */}

<div className="grid grid-cols-3 gap-6 mb-8">

  {/* TOTAL ITEMS */}

  <div
  className={`
    rounded-[28px]

    border

    p-6

    flex
    justify-between
    items-center

    ${
      theme === "dark"
        ? `
          border-cyan-300/20
          bg-white/5
          backdrop-blur-xl
        `
        : `
          border-slate-200
          bg-white/80
          backdrop-blur-md
          shadow-lg
        `
    }
  `}
>
    <div>
      <p
  className={`
    text-sm
    uppercase
    tracking-[3px]

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-blue-600"
    }
  `}
>
  Total Items
</p>

      <h2
  className={`
    text-5xl
    font-bold
    mt-3

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
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
  className={
    theme === "dark"
      ? "text-cyan-300"
      : "text-blue-600"
  }
/>
    </div>
  </div>

  {/* VENDORS */}

  <div
  className={`
    rounded-[28px]

    border

    p-6

    flex
    justify-between
    items-center

    ${
      theme === "dark"
        ? `
          border-cyan-300/20
          bg-white/5
          backdrop-blur-xl
        `
        : `
          border-slate-200
          bg-white/80
          backdrop-blur-md
          shadow-lg
        `
    }
  `}
>
    <div>
      <p
  className={`
    text-sm
    uppercase
    tracking-[3px]

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-blue-600"
    }
  `}
>
  Vendors
</p>

      <h2
  className={`
    text-5xl
    font-bold
    mt-3

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
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
        className={
    theme === "dark"
      ? "text-cyan-300"
      : "text-blue-600"
  }
/>
    </div>
  </div>

  {/* CATEGORIES */}

  <div
  className={`
    rounded-[28px]

    border

    p-6

    flex
    justify-between
    items-center

    ${
      theme === "dark"
        ? `
          border-cyan-300/20
          bg-white/5
          backdrop-blur-xl
        `
        : `
          border-slate-200
          bg-white/80
          backdrop-blur-md
          shadow-lg
        `
    }
  `}
>
    <div>
      <p
  className={`
    text-sm
    uppercase
    tracking-[3px]

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-blue-600"
    }
  `}
>
  Categories
</p>

      <h2
  className={`
    text-5xl
    font-bold
    mt-3

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
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
        className={
    theme === "dark"
      ? "text-cyan-300"
      : "text-blue-600"
  }
/>
    </div>
  </div>

</div>

        {/* ACTIVITY STATS */}

<div className="grid grid-cols-4 gap-6 mb-8">

  {/* LOGIN */}

  <div
    className={`
      rounded-[28px]
      border
      p-6

      ${
        theme === "dark"
          ? `
            border-green-400/20
            bg-white/5
          `
          : `
            border-slate-200
            bg-white
            shadow-lg
          `
      }
    `}
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm opacity-70">
          LOGIN TODAY
        </p>

        <h2 className="text-4xl font-bold mt-3 text-green-400">
          {activityStats.login}
        </h2>

      </div>

      <div
        className="
          w-16 h-16
          rounded-full

          flex
          items-center
          justify-center

          bg-green-500/10
          border
          border-green-400/20
        "
      >
        <User
          size={30}
          className="text-green-400"
        />
      </div>

    </div>

  </div>

  {/* ADD */}

  <div
    className={`
      rounded-[28px]
      border
      p-6

      ${
        theme === "dark"
          ? `
            border-cyan-400/20
            bg-white/5
          `
          : `
            border-slate-200
            bg-white
            shadow-lg
          `
      }
    `}
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm opacity-70">
          ADD ITEM
        </p>

        <h2 className="text-4xl font-bold mt-3 text-cyan-400">
          {activityStats.create}
        </h2>

      </div>

      <div
        className="
          w-16 h-16
          rounded-full

          flex
          items-center
          justify-center

          bg-cyan-500/10
          border
          border-cyan-400/20
        "
      >
        <PlusSquare
          size={30}
          className="text-cyan-400"
        />
      </div>

    </div>

  </div>

  {/* EDIT */}

  <div
    className={`
      rounded-[28px]
      border
      p-6

      ${
        theme === "dark"
          ? `
            border-yellow-400/20
            bg-white/5
          `
          : `
            border-slate-200
            bg-white
            shadow-lg
          `
      }
    `}
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm opacity-70">
          EDIT ITEM
        </p>

        <h2 className="text-4xl font-bold mt-3 text-yellow-400">
          {activityStats.update}
        </h2>

      </div>

      <div
        className="
          w-16 h-16
          rounded-full

          flex
          items-center
          justify-center

          bg-yellow-500/10
          border
          border-yellow-400/20
        "
      >
        <Pencil
          size={30}
          className="text-yellow-400"
        />
      </div>

    </div>

  </div>

  {/* DELETE */}

  <div
    className={`
      rounded-[28px]
      border
      p-6

      ${
        theme === "dark"
          ? `
            border-red-400/20
            bg-white/5
          `
          : `
            border-slate-200
            bg-white
            shadow-lg
          `
      }
    `}
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm opacity-70">
          DELETE ITEM
        </p>

        <h2 className="text-4xl font-bold mt-3 text-red-400">
          {activityStats.delete}
        </h2>

      </div>

      <div
        className="
          w-16 h-16
          rounded-full

          flex
          items-center
          justify-center

          bg-red-500/10
          border
          border-red-400/20
        "
      >
        <Trash2
          size={30}
          className="text-red-400"
        />
      </div>

    </div>

  </div>

</div>

<div className="grid lg:grid-cols-[380px_1fr] gap-8 mb-8">

  {/* LEFT SIDE */}

  <div>

    {/* RECENT ACTIVITY */}

    <div
      className={`
        rounded-[32px]
        border
        overflow-hidden

        ${
          theme === "dark"
            ? `
              border-cyan-300/20
              bg-white/5
              backdrop-blur-xl
            `
            : `
              border-slate-200
              bg-white/80
              backdrop-blur-md
              shadow-xl
            `
        }
      `}
    >

      <div className="p-6">

        <div className="flex justify-between items-center mb-6">

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            Recent Activity
          </h2>

          <button
            onClick={() =>
              router.push(
                "/admin/history"
              )
            }
            className={`
              text-sm
              font-medium

              ${
                theme === "dark"
                  ? "text-cyan-300"
                  : "text-blue-600"
              }

              hover:underline
            `}
          >
            View All →
          </button>

        </div>

        <div className="space-y-4">

          {recentLogs.map(
            (log) => (

              <div
  key={log.id}
  className={`
    rounded-2xl
    border
    p-4

    ${
      theme === "dark"
        ? `
          border-cyan-300/10
          bg-white/5
        `
        : `
          border-slate-200
          bg-slate-50
        `
    }
  `}
>

  <div className="flex justify-between items-start">

    <div className="flex gap-4">

      {/* ICON */}

      <div
        className={`
          w-12
          h-12

          rounded-xl

          flex
          items-center
          justify-center

          ${
            log.action === "LOGIN"
              ? "bg-green-500/10 border border-green-400/20"
              : log.action === "CREATE_ITEM"
              ? "bg-cyan-500/10 border border-cyan-400/20"
              : log.action === "UPDATE_ITEM"
              ? "bg-yellow-500/10 border border-yellow-400/20"
              : log.action === "DELETE_ITEM"
              ? "bg-red-500/10 border border-red-400/20"
              : "bg-slate-500/10 border border-slate-400/20"
          }
        `}
      >

        {log.action === "LOGIN" ? (
          <User
            size={22}
            className="text-green-400"
          />
        ) : log.action ===
          "CREATE_ITEM" ? (
          <PlusSquare
            size={22}
            className="text-cyan-400"
          />
        ) : log.action ===
          "UPDATE_ITEM" ? (
          <Pencil
            size={22}
            className="text-yellow-400"
          />
        ) : log.action ===
          "DELETE_ITEM" ? (
          <Trash2
            size={22}
            className="text-red-400"
          />
        ) : (
          <User
            size={22}
            className="text-slate-300"
          />
        )}

      </div>

      {/* CONTENT */}

      <div>

        <div
          className={`
            font-semibold

            ${
              log.action === "LOGIN"
                ? "text-green-400"
                : log.action ===
                  "CREATE_ITEM"
                ? "text-cyan-400"
                : log.action ===
                  "UPDATE_ITEM"
                ? "text-yellow-400"
                : log.action ===
                  "DELETE_ITEM"
                ? "text-red-400"
                : ""
            }
          `}
        >
          {getActionBadge(
            log.action
          )}
        </div>

        <div
          className="
            text-sm
            opacity-70
          "
        >
          {log.user_email}
        </div>

        <div className="text-sm mt-1">
          {log.item_name || "-"}
        </div>

      </div>

    </div>

    {/* TIME */}

    <div
      className="
        text-right
        text-xs
        opacity-60
      "
    >

      <div>
        {new Date(
          log.created_at
        ).toLocaleTimeString()}
      </div>

      <div className="mt-1">
        {new Date(
          log.created_at
        ).toLocaleDateString()}
      </div>

  </div>

  </div>

</div>

            )
          )}

        </div>

      </div>

    </div>

  </div>


  {/* RIGHT SIDE */}

  <div>

        {/* SEARCH */}

<div
  className={`
  mb-8

  rounded-[28px]

  border

  px-6
  py-5

  flex
  items-center
  gap-4

  ${
    theme === "dark"
      ? `
        border-cyan-300/20
        bg-white/5
        backdrop-blur-xl
      `
      : `
        border-slate-200
        bg-white/80
        backdrop-blur-md
        shadow-lg
      `
  }
`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={
    theme === "dark"
      ? "text-cyan-300"
      : "text-blue-500"
  }
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
    className={`
  flex-1
  bg-transparent
  outline-none

  ${
    theme === "dark"
      ? `
        text-white
        placeholder:text-white/40
      `
      : `
        text-slate-900
        placeholder:text-slate-400
      `
  }
`}
  />
</div>

        {/* TABLE */}
        <div
  className={`
    rounded-[32px]

    border

    overflow-hidden

    ${
      theme === "dark"
        ? `
          border-cyan-300/20
          bg-white/5
          backdrop-blur-xl
        `
        : `
          border-slate-200
          bg-white/80
          backdrop-blur-md
          shadow-xl
        `
    }
  `}
>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-transparent">

                <tr
  className={`
    text-left

    ${
      theme === "dark"
        ? "text-cyan-200"
        : "text-slate-500"
    }
  `}
>

                  <th
                    className={`
  p-5
  font-bold

  ${
    theme === "dark"
      ? "text-cyan-200"
      : "text-slate-500"
  }
`}
                  >
                    Image
                  </th>

                  <th
                    className={`
  p-5
  font-bold

  ${
    theme === "dark"
      ? "text-cyan-200"
      : "text-slate-500"
  }
`}
                  >
                    Item Name
                  </th>

                  <th
                    className={`
  p-5
  font-bold

  ${
    theme === "dark"
      ? "text-cyan-200"
      : "text-slate-500"
  }
`}
                  >
                    Vendor
                  </th>

                  <th
                    className={`
  p-5
  font-bold

  ${
    theme === "dark"
      ? "text-cyan-200"
      : "text-slate-500"
  }
`}
                  >
                    Category
                  </th>

                  <th
                    className={`
  p-5
  font-bold

  ${
    theme === "dark"
      ? "text-cyan-200"
      : "text-slate-500"
  }
`}
                  >
                    Price
                  </th>

                  <th
                    className={`
  p-5
  font-bold

  ${
    theme === "dark"
      ? "text-cyan-200"
      : "text-slate-500"
  }
`}
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
  className={`
    p-5
    font-bold

    ${
      theme === "dark"
        ? `
          text-cyan-300
          drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]
        `
        : `
          text-green-600
        `
    }
  `}
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