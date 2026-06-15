"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function HistoryPage() {
  const { theme } = useTheme();

  const [logs, setLogs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("ALL");

  const [search, setSearch] =
  useState("");

  const [fromDate, setFromDate] =
  useState("");

const [toDate, setToDate] =
  useState("");

const [selectedLog, setSelectedLog] =
  useState<any | null>(null);

  function getActionLabel(
    action: string
  ) {
    switch (action) {
      case "LOGIN":
        return "Login";

      case "LOGOUT":
        return "Logout";

      case "CREATE_ITEM":
        return "Add Item";

      case "UPDATE_ITEM":
        return "Edit Item";

      case "DELETE_ITEM":
        return "Delete Item";

      default:
        return action;
    }
  }
function getChangedFields(
  oldData: any,
  newData: any
) {
  if (!oldData || !newData)
    return [];

  return Object.keys(newData)

    .filter((key) => {

      const oldValue =
        oldData[key];

      const newValue =
        newData[key];

      const normalize = (
        value: any
      ) => {

        if (
          value === null ||
          value === undefined
        ) {
          return "";
        }

        return String(
          value
        ).trim();
      };

      return (
        normalize(
          oldValue
        ) !==
        normalize(
          newValue
        )
      );
    })

    .map((key) => ({
      field: key,
      oldValue:
        oldData[key],
      newValue:
        newData[key],
    }));
}

function formatFieldName(
  field: string
) {
  const labels: Record<
    string,
    string
  > = {

    item_name:
      "Item Name",

    item_code:
      "Item Code",

    main_category:
      "Main Category",

    sub_category:
      "Sub Category",

    image_url:
      "Image",

    image_urls:
      "Images",

    tokopedia_url:
      "Tokopedia URL",

    shopee_url:
      "Shopee URL",

    whatsapp_url:
      "WhatsApp URL",

    official_url:
      "Official URL",

    created_at:
      "Created At",

    Manufacture:
      "Manufacturer",

    UOM:
      "Unit Of Measure",
  };

  return (
    labels[field] ||

    field
      .replaceAll(
        "_",
        " "
      )

      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      )
  );
}

  async function getLogs() {
    const { data, error } =
      await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      alert(error.message);
      return;
    }

    setLogs(data || []);
    setLoading(false);
  }

  useEffect(() => {
    getLogs();
  }, []);

  const filteredLogs =
  logs.filter((log) => {

    const matchFilter =
      filter === "ALL"
        ? true
        : log.action === filter;

    const keyword =
      search.toLowerCase();

    const logDate =
  new Date(log.created_at);

const matchFromDate =
  !fromDate ||
  logDate >= new Date(fromDate);

const matchToDate =
  !toDate ||
  logDate <= new Date(
    `${toDate}T23:59:59`
  );

    const matchSearch =
      !keyword ||

      log.user_email
        ?.toLowerCase()
        .includes(keyword)

      ||

      log.item_name
        ?.toLowerCase()
        .includes(keyword)

      ||

      log.action
        ?.toLowerCase()
        .includes(keyword);

    return (
  matchFilter &&
  matchSearch &&
  matchFromDate &&
  matchToDate
);
  });

  return (
    <main
      className={`
        min-h-screen

        ${
          theme === "dark"
            ? "text-white bg-[#031427]"
            : "text-slate-900 bg-slate-100"
        }
      `}
    >
      <div className="p-10">

        <div className="max-w-[1800px] mx-auto flex gap-8">

          <AdminSidebar />

          <div className="flex-1">

            <h1 className="text-5xl font-bold mb-8">
              Audit History
            </h1>

            <div className="mb-6">

  <input
    type="text"
    placeholder="Search email atau item..."
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

      outline-none
    `}
  />

</div>

<div className="flex gap-4 mb-6 flex-wrap">

  <div>

    <label
      className="
        block
        mb-2
        text-sm
        opacity-70
      "
    >
      From Date
    </label>

    <input
      type="date"
      value={fromDate}
      onChange={(e) =>
        setFromDate(
          e.target.value
        )
      }
      className={`
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

  <div>

    <label
      className="
        block
        mb-2
        text-sm
        opacity-70
      "
    >
      To Date
    </label>

    <input
      type="date"
      value={toDate}
      onChange={(e) =>
        setToDate(
          e.target.value
        )
      }
      className={`
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

</div>

            <div className="flex gap-3 mb-8 flex-wrap">

              <button
                onClick={() =>
                  setFilter("ALL")
                }
                className={`
                  px-4 py-2 rounded-xl transition

                  ${
                    filter === "ALL"
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
                  setFilter("LOGIN")
                }
                className={`
                  px-4 py-2 rounded-xl transition

                  ${
                    filter === "LOGIN"
                      ? "bg-cyan-500 text-white"
                      : theme === "dark"
                      ? "bg-white/10"
                      : "bg-white border"
                  }
                `}
              >
                Login
              </button>

              <button
                onClick={() =>
                  setFilter("LOGOUT")
                }
                className={`
                  px-4 py-2 rounded-xl transition

                  ${
                    filter === "LOGOUT"
                      ? "bg-cyan-500 text-white"
                      : theme === "dark"
                      ? "bg-white/10"
                      : "bg-white border"
                  }
                `}
              >
                Logout
              </button>

              <button
                onClick={() =>
                  setFilter("CREATE_ITEM")
                }
                className={`
                  px-4 py-2 rounded-xl transition

                  ${
                    filter === "CREATE_ITEM"
                      ? "bg-cyan-500 text-white"
                      : theme === "dark"
                      ? "bg-white/10"
                      : "bg-white border"
                  }
                `}
              >
                Add Item
              </button>

              <button
                onClick={() =>
                  setFilter("UPDATE_ITEM")
                }
                className={`
                  px-4 py-2 rounded-xl transition

                  ${
                    filter === "UPDATE_ITEM"
                      ? "bg-cyan-500 text-white"
                      : theme === "dark"
                      ? "bg-white/10"
                      : "bg-white border"
                  }
                `}
              >
                Edit Item
              </button>

              <button
                onClick={() =>
                  setFilter("DELETE_ITEM")
                }
                className={`
                  px-4 py-2 rounded-xl transition

                  ${
                    filter === "DELETE_ITEM"
                      ? "bg-cyan-500 text-white"
                      : theme === "dark"
                      ? "bg-white/10"
                      : "bg-white border"
                  }
                `}
              >
                Delete Item
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
                  Total Logs: {filteredLogs.length}
                </div>

                <div className="space-y-4">

                  {filteredLogs.map((log) => (

                    <div
                        key={log.id}
                        onClick={() =>
                        setSelectedLog(log)
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

                          <div
                            className="
                              text-sm
                              opacity-70
                            "
                          >
                            Action
                          </div>

                          <div
                            className={`
                              inline-flex
                              mt-2

                              px-3
                              py-1

                              rounded-full

                              text-sm
                              font-semibold

                              ${
                                log.action === "LOGIN"
                                  ? "bg-green-500/20 text-green-400"
                                  : log.action === "LOGOUT"
                                  ? "bg-slate-500/20 text-slate-300"
                                  : log.action === "CREATE_ITEM"
                                  ? "bg-cyan-500/20 text-cyan-400"
                                  : log.action === "UPDATE_ITEM"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }
                            `}
                          >
                            {getActionLabel(
                              log.action
                            )}
                          </div>

                        </div>

                        <div>

                          <div
                            className="
                              text-sm
                              opacity-70
                            "
                          >
                            User
                          </div>

                          <div className="font-medium">
                            {log.user_email}
                          </div>

                        </div>

                        <div>

                          <div
                            className="
                              text-sm
                              opacity-70
                            "
                          >
                            Item
                          </div>

                          <div className="font-medium">
                            {log.item_name || "-"}
                          </div>

                        </div>

                        <div>

                          <div
                            className="
                              text-sm
                              opacity-70
                            "
                          >
                            Date
                          </div>

                          <div className="font-medium">
                            {new Date(
                              log.created_at
                            ).toLocaleString()}
                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </>

            )}

          </div>

        </div>

      </div>

{selectedLog && (

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
        max-w-5xl

        rounded-3xl

        p-8

        relative
        max-h-[90vh]
overflow-hidden

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
          setSelectedLog(null)
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
        Audit Detail
      </h2>

      <div className="space-y-4">

        <div>
          <strong>Action:</strong>{" "}
          {getActionLabel(
            selectedLog.action
          )}
        </div>

{selectedLog.action ===
  "UPDATE_ITEM" &&
  selectedLog.old_data &&
  selectedLog.new_data && (

    <div className="mt-8">

      <h3
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Changed Fields
      </h3>

      <div
  className="
    space-y-4

    max-h-[50vh]
    overflow-y-auto

    pr-2
  "
>

        {getChangedFields(
          selectedLog.old_data,
          selectedLog.new_data
        ).map((change) => (

          <div
            key={change.field}
            className={`
              rounded-xl
              p-4
              border

              ${
                theme === "dark"
                  ? `
                    border-cyan-300/20
                    bg-white/5
                  `
                  : `
                    border-slate-200
                    bg-slate-50
                  `
              }
            `}
          >

            <div
              className="
                font-bold
                mb-3
              "
            >
              {formatFieldName(
  change.field
)}
            </div>

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
              "
            >

              <div>

                <div
                  className="
                    text-sm
                    opacity-70
                    mb-1
                  "
                >
                  Old Value
                </div>

                <div>
                  {String(
                    change.oldValue
                  )}
                </div>

              </div>

              <div>

                <div
                  className="
                    text-sm
                    opacity-70
                    mb-1
                  "
                >
                  New Value
                </div>

                <div
                  className="
                    text-cyan-400
                    font-medium
                  "
                >
                  {String(
                    change.newValue
                  )}
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

)}

        <div>
          <strong>User:</strong>{" "}
          {selectedLog.user_email}
        </div>

        <div>
          <strong>Item:</strong>{" "}
          {selectedLog.item_name ||
            "-"}
        </div>

        <div>
          <strong>Date:</strong>{" "}
          {new Date(
            selectedLog.created_at
          ).toLocaleString()}
        </div>

      </div>

    </div>

  </div>

)}

    </main>
  );
}