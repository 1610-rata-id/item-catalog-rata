"use client";

type PublicHeroProps = {
  theme: "light" | "dark";
};

export default function PublicHero({
  theme,
}: PublicHeroProps) {
  return (
    <section className="px-4 pt-4">

      <div
        className={`
          overflow-hidden

          rounded-3xl

          border

          ${
            theme === "dark"
              ? `
                  border-cyan-400/10

                  shadow-[0_0_30px_rgba(0,255,255,0.08)]
                `
              : `
                  border-slate-200

                  shadow-lg
                `
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

            h-[170px]

            object-cover
          "
        />

      </div>

    </section>
  );
}