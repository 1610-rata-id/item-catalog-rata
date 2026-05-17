"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(
      "/admin/dashboard"
    );
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#f7f7f8]
        flex
        items-center
        justify-center
        px-6
        py-10
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_30%)]
        "
      />

      {/* GRID */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
          bg-[size:42px_42px]
        "
      />

      {/* CARD */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          rounded-[38px]
          border
          border-white/60
          bg-white/80
          backdrop-blur-xl
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
        "
      >
        {/* TOP IMAGE */}
        <div className="p-5 pb-0">
          <div
            className="
              overflow-hidden
              rounded-[28px]
            "
          >
            <img
              src="/banner-catalog.png"
              alt="Banner"
              className="
                h-[180px]
                w-full
                object-cover
              "
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-8 pt-10 pb-8">
          {/* TITLE */}
          <div className="text-center">
            <p
              className="
                text-[13px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-red-500
              "
            >
              ITEM CATALOG SYSTEM
            </p>

            <h1
              className="
                mt-4
                text-[52px]
                leading-none
                font-bold
                tracking-tight
                text-[#111111]
              "
            >
              Admin Login
            </h1>

            <p
              className="
                mt-5
                text-[16px]
                leading-relaxed
                text-gray-500
              "
            >
              Masuk untuk mengakses dashboard
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="mt-12 space-y-6"
          >
            {/* EMAIL */}
            <div>
              <label
                className="
                  mb-3
                  block
                  text-[15px]
                  font-medium
                  text-gray-700
                "
              >
                Email Address
              </label>

              <input
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-[22px]
                  border
                  border-[#e7e9ee]
                  bg-[#f5f7fd]
                  px-5
                  py-5
                  text-[16px]
                  text-black
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-gray-400
                  focus:border-red-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-red-100
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="
                  mb-3
                  block
                  text-[15px]
                  font-medium
                  text-gray-700
                "
              >
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-[22px]
                  border
                  border-[#e7e9ee]
                  bg-[#f5f7fd]
                  px-5
                  py-5
                  text-[16px]
                  text-black
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-gray-400
                  focus:border-red-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-red-100
                "
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-2
                w-full
                rounded-[22px]
                bg-gradient-to-r
                from-[#ff3131]
                to-[#ff000f]
                py-5
                text-[17px]
                font-semibold
                text-white
                shadow-[0_10px_30px_rgba(255,0,0,0.22)]
                transition-all
                duration-300
                hover:scale-[1.01]
                hover:shadow-[0_15px_40px_rgba(255,0,0,0.28)]
                disabled:opacity-50
              "
            >
              {loading
                ? "Loading..."
                : "Login Dashboard"}
            </button>
          </form>

          {/* FOOTER BUTTON */}
          <button
            onClick={() =>
              router.push("/")
            }
            className="
              mt-6
              w-full
              rounded-[22px]
              border
              border-gray-200
              bg-white
              py-5
              text-[16px]
              font-medium
              text-gray-600
              transition-all
              duration-300
              hover:bg-gray-50
            "
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </main>
  );
}