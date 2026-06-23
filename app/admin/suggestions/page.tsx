"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function SuggestionsPage() {
  const { theme } = useTheme();

  const [suggestions, setSuggestions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [sourceFilter, setSourceFilter] =
  useState("ALL");

  const [selectedSuggestion, setSelectedSuggestion] =
    useState<any | null>(null);

  async function getSuggestions() {

    const { data, error } =
      await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      alert(error.message);
      return;
    }

    setSuggestions(data || []);
    setLoading(false);
  }

    async function updateStatus(
  id: number,
  status: string
) {

  const { error } =
    await supabase
      .from("feedbacks")
      .update({
        status,
      })
      .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  setSuggestions((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
          }
        : item
    )
  );

  setSelectedSuggestion(
    (prev: any) =>
      prev
        ? {
            ...prev,
            status,
          }
        : null
  );
}

  useEffect(() => {
    getSuggestions();
  }, []);

  const filteredSuggestions =
    suggestions.filter((item) => {

      const keyword =
        search.toLowerCase();

      const matchSearch =
        !keyword ||

        item.user_email
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.message
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.category
          ?.toLowerCase()
          .includes(keyword);

      const matchStatus =
        statusFilter === "ALL"
          ? true
          : item.status === statusFilter;

      const matchSource =
  sourceFilter === "ALL"
    ? true
    : item.source === sourceFilter;

      return (
  matchSearch &&
  matchStatus &&
  matchSource
);
    });

  return (
    <main
      className={`
        min-h-screen

        ${
          theme === "dark"
            ? "bg-[#031427] text-white"
            : "bg-slate-100 text-slate-900"
        }
      `}
    >
      <div className="p-10">

        <div className="max-w-[1800px] mx-auto flex gap-8">

          <AdminSidebar />

          <div className="flex-1">

            <h1 className="text-5xl font-bold mb-8">
              Suggestions Center
            </h1>

            {/* SEARCH */}

            <div className="mb-6">

              <input
                type="text"
                placeholder="Search suggestion..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className={`
                  w-full
                  max-w-md

                  px-4
                  py-3

                  rounded-xl
                  border

                  ${
                    theme === "dark"
                      ? `
                        bg-white/5
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

            {/* FILTER */}

            <div className="flex gap-3 mb-8">

              <button
                onClick={() =>
                  setStatusFilter(
                    "ALL"
                  )
                }
                className={`
                  px-4 py-2 rounded-xl

                  ${
                    statusFilter === "ALL"
                      ? "bg-cyan-500 text-white"
                      : theme === "dark"
                      ? "bg-white/10"
                      : "bg-white border"
                  }
                `}
              >
                All
              </button>

              <button
                onClick={() =>
                  setStatusFilter(
                    "OPEN"
                  )
                }
                className={`
                  px-4 py-2 rounded-xl

                  ${
                    statusFilter === "OPEN"
                      ? "bg-cyan-500 text-white"
                      : theme === "dark"
                      ? "bg-white/10"
                      : "bg-white border"
                  }
                `}
              >
                Open
              </button>

               <button
  onClick={() =>
    setStatusFilter(
      "IN_PROGRESS"
    )
  }
  className={`
    px-4 py-2 rounded-xl

    ${
      statusFilter ===
      "IN_PROGRESS"
        ? "bg-yellow-500 text-white"
        : theme === "dark"
        ? "bg-white/10"
        : "bg-white border"
    }
  `}
>
  In Progress
</button>

<button
  onClick={() =>
    setStatusFilter(
      "CLOSED"
    )
  }
  className={`
    px-4 py-2 rounded-xl

    ${
      statusFilter ===
      "CLOSED"
        ? "bg-green-500 text-white"
        : theme === "dark"
        ? "bg-white/10"
        : "bg-white border"
    }
  `}
>
  Closed
</button>

           <button
  onClick={() =>
    setSourceFilter(
      "INTERNAL"
    )
  }
  className={`
    px-4 py-2 rounded-xl

    ${
      sourceFilter === "INTERNAL"
        ? "bg-green-500 text-white"
        : theme === "dark"
        ? "bg-white/10"
        : "bg-white border"
    }
  `}
>
  Internal
</button>

<button
  onClick={() =>
    setSourceFilter(
      "EXTERNAL"
    )
  }
  className={`
    px-4 py-2 rounded-xl

    ${
      sourceFilter === "EKSTERNAL"
        ? "bg-blue-500 text-white"
        : theme === "dark"
        ? "bg-white/10"
        : "bg-white border"
    }
  `}
>
  External
</button>

            </div>

            {loading ? (

              <div>
                Loading...
              </div>

            ) : (

              <>

                <div
                  className={`
                    mb-6
                    font-medium

                    ${
                      theme === "dark"
                        ? "text-cyan-300"
                        : "text-slate-500"
                    }
                  `}
                >
                  Total Suggestions: {filteredSuggestions.length}
                </div>

                <div className="space-y-4">

                  {filteredSuggestions.map(
                    (item) => (

                      <div
                        key={item.id}
                        onClick={() =>
                          setSelectedSuggestion(
                            item
                          )
                        }
                        className={`
                          rounded-2xl
                          border
                          p-5

                          cursor-pointer

                          transition
                          hover:scale-[1.01]

                          ${
                            theme === "dark"
                              ? `
                                border-cyan-300/20
                                bg-white/5
                              `
                              : `
                                border-slate-200
                                bg-white
                                shadow-md
                              `
                          }
                        `}
                      >

                        <div className="flex justify-between flex-wrap gap-4">

                          <div>

                            <div className="text-sm opacity-70">
                              Category
                            </div>

                            <div className="font-semibold">
                              {item.category}
                            </div>

                          </div>

                          <div>

                            <div className="text-sm opacity-70">
                              User
                            </div>

                            <div>
                              {item.user_email}
                            </div>

                          </div>

                          <div>

  <div className="text-sm opacity-70">
    Source
  </div>

  <div>
    {item.source}
  </div>

</div>

                          <div>

                            <div className="text-sm opacity-70">
                              Status
                            </div>

                            <div
                              className="
                                text-cyan-400
                                font-semibold
                              "
                            >
                              {item.status}
                            </div>

                          </div>

                        </div>

                        <div className="mt-4 line-clamp-2 opacity-80">

                          {item.message}

                        </div>

                      </div>

                    )
                  )}

                </div>

              </>

            )}

          </div>

        </div>

      </div>

      {selectedSuggestion && (

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
              max-w-3xl

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
                  `
                  : `
                    bg-white
                    text-slate-900
                  `
              }
            `}
          >

            <button
              onClick={() =>
                setSelectedSuggestion(
                  null
                )
              }
              className="
                absolute
                top-4
                right-5

                text-3xl
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
              Suggestion Detail
            </h2>

            <div className="space-y-4">

              <div>
                <strong>User:</strong>{" "}
                {selectedSuggestion.user_email}
              </div>

              <div>
  <strong>Name:</strong>{" "}
  {selectedSuggestion.sender_name || "-"}
</div>

<div>
  <strong>Email:</strong>{" "}
  {selectedSuggestion.sender_email || "-"}
</div>

<div>
  <strong>Division:</strong>{" "}
  {selectedSuggestion.division || "-"}
</div>

<div>
  <strong>Office:</strong>{" "}
  {selectedSuggestion.office || "-"}
</div>

<div>
  <strong>Source:</strong>{" "}
  {selectedSuggestion.source || "-"}
</div>

              <div>
                <strong>Category:</strong>{" "}
                {selectedSuggestion.category}
              </div>

              <div>

  <strong>Status:</strong>

  <select
    value={
      selectedSuggestion.status
    }
    onChange={(e) =>
      updateStatus(
        selectedSuggestion.id,
        e.target.value
      )
    }
    className={`
      ml-3

      px-3
      py-2

      rounded-lg

      ${
        theme === "dark"
          ? `
            bg-[#0d2742]
            text-white
            border border-cyan-300/20
          `
          : `
            bg-white
            text-slate-900
            border border-slate-300
          `
      }
    `}
  >

    <option value="OPEN">
      OPEN
    </option>

    <option value="IN_PROGRESS">
      IN PROGRESS
    </option>

    <option value="CLOSED">
      CLOSED
    </option>

  </select>

</div>

              <div>
                <strong>Page:</strong>{" "}
                {selectedSuggestion.page}
              </div>

              <div>
                <strong>Item:</strong>{" "}
                {selectedSuggestion.item_name || "-"}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(
                  selectedSuggestion.created_at
                ).toLocaleString()}
              </div>

              <div>

                <strong>
                  Suggestion:
                </strong>

                <div
  className={`
    mt-3

    p-4

    rounded-xl

    break-words
    whitespace-pre-wrap
    overflow-hidden

    ${
      theme === "dark"
        ? "bg-white/5"
        : "bg-slate-100"
    }
  `}
>
  {selectedSuggestion.message}
</div>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}