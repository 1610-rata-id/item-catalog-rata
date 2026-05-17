"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function formatRupiah(number: number) {
  return new Intl.NumberFormat(
    "id-ID"
  ).format(number || 0);
}

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [items, setItems] = useState<
    any[]
  >([]);

  const [search, setSearch] =
    useState("");
  const [page, setPage] =
  useState(1);

const ITEMS_PER_PAGE = 100;

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/admin/login");
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
    `item_name.ilike.%${search}%,
    vendor.ilike.%${search}%,
    category.ilike.%${search}%,
    description.ilike.%${search}%,
    item_code.ilike.%${search}%,
    type.ilike.%${search}%,
    Manufacture.ilike.%${search}%,
    Term.ilike.%${search}%,
    Remarks.ilike.%${search}%`
  );
}

  const { data, error } =
    await query;

  if (error) {
    console.error(error);
    return;
  }

  setItems(data || []);
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

  if (loading) {
    return (
      <main className="p-10 text-black">
        Checking auth...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f7] p-10 text-black">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1
              className="
                text-5xl font-bold
                text-black
              "
            >
              Admin Dashboard
            </h1>

            <p
              className="
                text-gray-700
                mt-2 text-lg
              "
            >
              Manage catalog items
            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={() =>
                router.push(
                  "/admin/add-item"
                )
              }
              className="
                bg-black text-white
                px-6 py-3 rounded-xl
                hover:opacity-90
                transition
                font-medium
              "
            >
              + Add Item
            </button>

            <button
              onClick={() =>
                router.push("/")
              }
              className="
                border border-gray-400
                bg-white
                text-black
                px-6 py-3 rounded-xl
                hover:bg-gray-100
                transition
                font-medium
              "
            >
              Back
            </button>

            <button
              onClick={handleLogout}
              className="
                border border-red-500
                text-red-600
                bg-white
                px-6 py-3 rounded-xl
                hover:bg-red-500
                hover:text-white
                transition
                font-medium
              "
            >
              Logout
            </button>

          </div>

        </div>

        {/* SEARCH */}
        <div className="mb-8">

          <input
            placeholder="Search item..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full bg-white border
              border-gray-300
              rounded-2xl p-4
              outline-none
              text-black
              placeholder:text-gray-500
              focus:ring-2
              focus:ring-black
            "
          />

        </div>

        {/* TABLE */}
        <div
          className="
            bg-white rounded-3xl
            shadow-lg overflow-hidden
            border border-gray-200
          "
        >

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr
                  className="
                    text-left
                    text-black
                  "
                >

                  <th
                    className="
                      p-5 font-bold
                      text-black
                    "
                  >
                    Image
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-black
                    "
                  >
                    Item Name
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-black
                    "
                  >
                    Vendor
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-black
                    "
                  >
                    Category
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-black
                    "
                  >
                    Price
                  </th>

                  <th
                    className="
                      p-5 font-bold
                      text-black
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
                      border-t
                      hover:bg-gray-50
                      transition
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
                            bg-gray-100
                            flex items-center
                            justify-center
                            text-xs text-gray-500
                          "
                        >
                          No Image
                        </div>
                      )}

                    </td>

                    {/* NAME */}
                    <td
                      className="
                        p-5 font-semibold
                        text-black
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
                        text-gray-800
                        font-medium
                      "
                    >
                      {item.vendor || "-"}
                    </td>

                    {/* CATEGORY */}
                    <td
                      className="
                        p-5
                        text-gray-800
                        font-medium
                      "
                    >
                      {item.category || "-"}
                    </td>

                    {/* PRICE */}
                    <td
                      className="
                        p-5 font-bold
                        text-green-700
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
                            px-4 py-2 rounded-xl
                            bg-gray-200
                            text-black
                            hover:bg-gray-300
                            transition
                            font-medium
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
                            px-4 py-2 rounded-xl
                            bg-red-500 text-white
                            hover:opacity-90
                            transition
                            font-medium
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
    </main>
  );
}