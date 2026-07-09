"use client";

type PublicPaginationProps = {
  theme: "light" | "dark";

  page: number;

  totalPages: number;

  setPage: (
    page: number
  ) => void;
};

export default function PublicPagination({
  theme,

  page,

  totalPages,

  setPage,
}: PublicPaginationProps) {

  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (
    let i = Math.max(
      1,
      page - 1
    );

    i <=
    Math.min(
      totalPages,
      page + 1
    );

    i++
  ) {
    pages.push(i);
  }

  return (
    <section className="px-4 pb-10 pt-2">

      <div
        className="
          flex
          items-center
          justify-center
          gap-2
          flex-wrap
        "
      >

        {/* FIRST */}

        <button
          disabled={page === 1}
          onClick={() =>
            setPage(1)
          }
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

        {/* PREVIOUS */}

        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
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

        {/* PAGE */}

        {pages.map((p) => (

          <button
            key={p}
            onClick={() =>
              setPage(p)
            }
            className={`
              w-11
              h-11

              rounded-xl

              border

              transition

              ${
                page === p
                  ? `
                      bg-cyan-400

                      text-[#02111f]

                      border-cyan-400
                    `
                  : theme === "dark"
                  ? `
                      border-cyan-500/20
                    `
                  : `
                      border-slate-300
                    `
              }
            `}
          >
            {p}
          </button>

        ))}

        {/* NEXT */}

        <button
          disabled={
            page === totalPages
          }
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

        {/* LAST */}

        <button
          disabled={
            page === totalPages
          }
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

      </div>

    </section>
  );
}