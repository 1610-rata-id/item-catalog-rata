"use client";

type MobilePaginationProps = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  theme: "light" | "dark";
};

export default function MobilePagination({
  page,
  totalPages,
  setPage,
  theme,
}: MobilePaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];

  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 py-8">

      <>
  <button
    disabled={page === 1}
    onClick={() => setPage(1)}
    className={`
      w-11
      h-11

      rounded-xl
      border

      transition

      ${
        page === 1
          ? "opacity-30 cursor-not-allowed"
          : ""
      }

      ${
        theme === "dark"
          ? "border-cyan-500/20"
          : "border-slate-300"
      }
    `}
  >
    ⏮
  </button>

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className={`
      w-11
      h-11

      rounded-xl
      border

      transition

      ${
        page === 1
          ? "opacity-30 cursor-not-allowed"
          : ""
      }

      ${
        theme === "dark"
          ? "border-cyan-500/20"
          : "border-slate-300"
      }
    `}
  >
    ←
  </button>
</>
      {pages.map((p) => (

        <button
          key={p}
          onClick={() => setPage(p)}
          className={`
            w-11
            h-11

            rounded-xl

            transition

            ${
              p === page
                ? "bg-cyan-400 text-black font-bold"
                : theme === "dark"
                ? "border border-cyan-500/20"
                : "border border-slate-300"
            }
          `}
        >
          {p}
        </button>

      ))}

      {page + 1 < totalPages && (
        <>
          <span className="px-1">...</span>

          <button
            onClick={() =>
              setPage(totalPages)
            }
            className={`
              w-11
              h-11

              rounded-xl

              ${
                theme === "dark"
                  ? "border border-cyan-500/20"
                  : "border border-slate-300"
              }
            `}
          >
            {totalPages}
          </button>
        </>
      )}

      <>
  <button
    disabled={page === totalPages}
    onClick={() =>
      setPage(page + 1)
    }
    className={`
      w-11
      h-11

      rounded-xl
      border

      transition

      ${
        page === totalPages
          ? "opacity-30 cursor-not-allowed"
          : ""
      }

      ${
        theme === "dark"
          ? "border-cyan-500/20"
          : "border-slate-300"
      }
    `}
  >
    →
  </button>

  <button
    disabled={page === totalPages}
    onClick={() =>
      setPage(totalPages)
    }
    className={`
      w-11
      h-11

      rounded-xl
      border

      transition

      ${
        page === totalPages
          ? "opacity-30 cursor-not-allowed"
          : ""
      }

      ${
        theme === "dark"
          ? "border-cyan-500/20"
          : "border-slate-300"
      }
    `}
  >
    ⏭
  </button>
</>

    </div>
  );
}