"use client";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "@/app/providers/ThemeProvider";

export default function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        w-12
        h-12

        rounded-full

        border

        border-cyan-300/20

        bg-white/5

        flex
        items-center
        justify-center

        text-cyan-300

        hover:scale-105

        transition
      "
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}