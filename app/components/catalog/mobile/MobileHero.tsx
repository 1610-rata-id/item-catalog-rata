"use client";

type MobileHeroProps = {
  theme: "light" | "dark";
};

export default function MobileHero({
  theme,
}: MobileHeroProps) {
  return (
    <section className="px-4 pt-5">

      <div
        className={`
          overflow-hidden
          rounded-3xl

          ${
            theme === "dark"
              ? "border border-cyan-400/10"
              : "border border-slate-200 shadow-sm"
          }
        `}
      >

        <img
          src={
            theme === "dark"
              ? "/dark/catalog-banner.jpg"
              : "/light/catalog-banner.jpg"
          }
          alt="Catalog Banner"
          className="
            w-full
            h-40
            object-cover
          "
        />

      </div>

    </section>
  );
}