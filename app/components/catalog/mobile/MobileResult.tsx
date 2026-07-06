"use client";

type MobileResultProps = {
  theme: "light" | "dark";
  totalItems: number;
  currentItems: number;
};

export default function MobileResult({
  theme,
  totalItems,
  currentItems,
}: MobileResultProps) {
  return (
    <section className="px-4 pt-5 pb-2">

      <p
        className={`
          text-sm

          ${
            theme === "dark"
              ? "text-white/70"
              : "text-slate-600"
          }
        `}
      >
        Menampilkan{" "}

        <span
          className={`
            font-semibold

            ${
              theme === "dark"
                ? "text-cyan-300"
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
                ? "text-cyan-300"
                : "text-blue-600"
            }
          `}
        >
          {totalItems}
        </span>

        {" "}item
      </p>

    </section>
  );
}