"use client";

type MobileCategoryBarProps = {
  theme: "light" | "dark";

  selectedCategory: string;

  handleCategoryChange: (
    value: string
  ) => void;

  hierarchicalCategories: Record<
    string,
    string[]
  >;
};

export default function MobileCategoryBar({
  theme,
  selectedCategory,
  handleCategoryChange,
  hierarchicalCategories,
}: MobileCategoryBarProps) {
  const categories =
    Object.keys(
      hierarchicalCategories
    );

  return (
    <div
      className={`
        px-4
        py-3

        overflow-x-auto

        flex
        gap-3

        no-scrollbar

        ${
          theme === "dark"
            ? "bg-[#02111f]"
            : "bg-[#f5f7fb]"
        }
      `}
    >
      <button
        onClick={() =>
          handleCategoryChange("")
        }
        className={`
          whitespace-nowrap

          px-5
          py-2.5

          rounded-full

          text-sm
          font-medium

          transition

          ${
            selectedCategory === ""
              ? "bg-cyan-500 text-white"
              : theme === "dark"
              ? "bg-white/5 text-gray-300"
              : "bg-white text-slate-700 border border-slate-200"
          }
        `}
      >
        All
      </button>

      {categories.map(
        (category) => (
          <button
            key={category}
            onClick={() =>
              handleCategoryChange(
                category
              )
            }
            className={`
              whitespace-nowrap

              px-5
              py-2.5

              rounded-full

              text-sm
              font-medium

              transition

              ${
                selectedCategory ===
                category
                  ? "bg-cyan-500 text-white"
                  : theme === "dark"
                  ? "bg-white/5 text-gray-300"
                  : "bg-white text-slate-700 border border-slate-200"
              }
            `}
          >
            {category}
          </button>
        )
      )}
    </div>
  );
}