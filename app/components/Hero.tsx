"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <img
        src="/hero-v2.jpg"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">

        <div className="text-center max-w-3xl">

          {/* WELCOME */}
          <p
            className="
              uppercase
              tracking-[10px]
              text-[#72e8ff]
              text-sm
              md:text-base
              mb-4
            "
          >
            Welcome To
          </p>

          {/* TITLE */}
          <h1
            className="
              text-white
              font-bold
              leading-none
              tracking-wide
              text-6xl
              md:text-8xl
            "
          >
            ITEM
            <br />
            CATALOG
          </h1>

          {/* BY PROCUREMENT */}
          <div className="mt-6 flex items-center justify-center gap-4">

            <div className="w-20 h-px bg-cyan-300/50" />

            <p className="text-white text-xl">
              By Procurement
            </p>

            <div className="w-20 h-px bg-cyan-300/50" />

          </div>

          {/* DESCRIPTION */}
          <div className="mt-8 text-gray-200 text-lg leading-relaxed">

            <p>
              Smart catalog for modern procurement.
            </p>

            <p>
              Find, compare, and manage with ease.
            </p>

          </div>

          {/* BUTTONS */}
          <div
            className="
              mt-12
              flex
              flex-col
              md:flex-row
              justify-center
              gap-5
            "
          >

            {/* EXPLORE */}
            <button
              onClick={() =>
                router.push("/public-catalog")
              }
              className="
                min-w-[280px]
                px-10
                py-5
                rounded-2xl
                border
                border-cyan-300/70
                bg-cyan-400/10
                text-white
                text-xl
                font-medium
                backdrop-blur-md
                shadow-[0_0_30px_rgba(0,255,255,0.25)]
                hover:scale-105
                transition
              "
            >
              Explore Catalog →
            </button>

            {/* LOGIN */}
            <button
              onClick={() =>
                router.push("/admin/login")
              }
              className="
                min-w-[280px]
                px-10
                py-5
                rounded-2xl
                border
                border-cyan-300/70
                bg-cyan-400/10
                text-white
                text-xl
                font-medium
                backdrop-blur-md
                shadow-[0_0_30px_rgba(0,255,255,0.25)]
                hover:scale-105
                transition
              "
            >
              Internal Access
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}