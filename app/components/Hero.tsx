"use client";

import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function Hero() {
  const router = useRouter();

  const { theme } = useTheme();

  return (
    <section
  className="
    relative
    min-h-screen
    overflow-hidden

    transition-all
    duration-500
  "
>

  <div className="absolute top-8 right-8 z-50">
    <ThemeToggle />
  </div>

      {/* BACKGROUND */}
      <img
  src={
    theme === "dark"
      ? "/dark/home-hero.jpg"
      : "/light/home-hero.jpg"
  }
  alt="hero"
  className="absolute inset-0 w-full h-full object-cover"
/>

      {/* CONTENT */}
      {theme === "light" && (
  <div
    className="
      absolute
      left-1/2
      top-1/2

      -translate-x-1/2
      -translate-y-1/2

      w-[800px]
      h-[800px]

      rounded-full

      bg-cyan-200/20

      blur-3xl
    "
  />
)}
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
  className={`
    font-bold
    leading-none
    tracking-wide
    text-6xl
    md:text-8xl

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900 drop-shadow-sm"
    }
  `}
>
            ITEM
            <br />
            CATALOG
          </h1>

          {/* BY PROCUREMENT */}
          <div className="mt-6 flex items-center justify-center gap-4">

            <div className="w-20 h-px bg-cyan-300/50" />

            <p
  className={`
    text-xl

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-700"
    }
  `}
>
  By Procurement
</p>

            <div className="w-20 h-px bg-cyan-300/50" />

          </div>

          {/* DESCRIPTION */}
          <div
  className={`
    mt-8
    text-lg
    leading-relaxed

    ${
      theme === "dark"
        ? "text-gray-200"
        : "text-slate-600"
    }
  `}
>

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
              className={`
  min-w-[280px]
  px-10
  py-5
  rounded-2xl
  text-xl
  font-medium
                hover:scale-105
                transition
              ${
    theme === "dark"
      ? `
        border border-cyan-300/70
        bg-cyan-400/10
        text-white
        backdrop-blur-md
        shadow-[0_0_30px_rgba(0,255,255,0.25)]
      `
      : `
        border border-cyan-200
        bg-white/80
        text-slate-800
        shadow-lg
      `
  }
`}
            >
              Explore Catalog →
            </button>

            {/* LOGIN */}
            <button
              onClick={() =>
                router.push("/admin/login")
              }
              className={`
  min-w-[280px]
  px-10
  py-5
  rounded-2xl
  text-xl
  font-medium
                hover:scale-105
                transition
              ${
    theme === "dark"
      ? `
        border border-cyan-300/70
        bg-cyan-400/10
        text-white
        backdrop-blur-md
        shadow-[0_0_30px_rgba(0,255,255,0.25)]
      `
      : `
        border border-cyan-200
        bg-white/80
        text-slate-800
        shadow-lg
      `
  }
`}
            >
              Internal Access
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}