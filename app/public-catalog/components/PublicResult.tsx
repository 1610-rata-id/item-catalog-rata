"use client";

type PublicResultProps = {
  theme: "light" | "dark";
  currentItems: number;
  totalItems: number;

  selectedCategory: string;
  handleCategoryChange: (
    value: string
  ) => void;
};

export default function PublicResult({
  theme,
  currentItems,
  totalItems,

  selectedCategory,
  handleCategoryChange,
}: PublicResultProps) {
  return (
    <section
      className="
        px-4
        pt-6
        pb-4
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          flex-wrap
        "
      >

        {/* RESULT */}

        <p
          className={
            theme === "dark"
              ? "text-cyan-300"
              : "text-slate-500"
          }
        >
          Menampilkan{" "}

          <span
            className={`
              font-semibold

              ${
                theme === "dark"
                  ? "text-cyan-400"
                  : "text-blue-600"
              }
            `}
          >
            {currentItems}
          </span>

          {" "}dari{" "}

          <span
            className={`
              font-semibold

              ${
                theme === "dark"
                  ? "text-cyan-400"
                  : "text-blue-600"
              }
            `}
          >
            {totalItems}
          </span>

          {" "}item
        </p>

        {/* ACTIVE FILTER */}

        {selectedCategory !== "All" && (

          <button
            onClick={() =>
              handleCategoryChange(
                "All"
              )
            }
            className="
              px-4
              py-2

              rounded-full

              bg-cyan-400/20

              border
              border-cyan-400/30

              text-cyan-300

              text-sm

              transition

              hover:bg-cyan-400/30
            "
          >
            {selectedCategory} ✕
          </button>

        )}

      </div>
    </section>
  );
}