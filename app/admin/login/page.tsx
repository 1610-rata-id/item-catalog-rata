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
        min-h-screen
        flex items-center justify-center
        bg-[#f5f5f4]
        relative overflow-hidden
        px-6
      "
    >

      {/* BACKGROUND */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-red-50
          via-white
          to-gray-100
        "
      />

      <div
        className="
          absolute -bottom-40 -left-40
          w-[500px] h-[500px]
          bg-red-100
          rounded-full
          blur-3xl opacity-40
        "
      />

      <div
        className="
          absolute -top-40 -right-40
          w-[500px] h-[500px]
          bg-gray-200
          rounded-full
          blur-3xl opacity-50
        "
      />

      {/* CARD */}
      <div
        className="
          relative z-10
          w-full max-w-xl
          bg-white/80
          backdrop-blur-xl
          border border-white
          shadow-2xl
          rounded-[32px]
          p-10 md:p-14
        "
      >

        {/* LOGO */}
        <img
  src="/logo.png"
  alt="Logo"
  className="
    w-full
    max-w-[320px]
    mx-auto
    mb-8
    object-contain
  "
/>

          <p
            className="
              mt-4 text-gray-500
              tracking-[4px]
              text-sm
            "
          >
            ITEM CATALOG SYSTEM
          </p>

        </div>

        {/* TITLE */}
        <div className="text-center mt-10">

          <div
            className="
              w-20 h-20 mx-auto
              rounded-full
              bg-red-50
              flex items-center justify-center
              text-3xl
            "
          >
            🔒
          </div>

          <h1
            className="
              text-5xl font-bold
              mt-6 text-black
            "
          >
            Admin Login
          </h1>

          <p
            className="
              text-gray-500
              mt-4 text-lg
            "
          >
            Masuk untuk mengakses dashboard admin
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
                text-sm font-semibold
                text-gray-700
              "
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                mt-3 w-full
                rounded-2xl
                border border-gray-200
                bg-white
                px-5 py-4
                outline-none
                text-black
                focus:ring-2
                focus:ring-red-500
                transition
              "
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label
              className="
                text-sm font-semibold
                text-gray-700
              "
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                mt-3 w-full
                rounded-2xl
                border border-gray-200
                bg-white
                px-5 py-4
                outline-none
                text-black
                focus:ring-2
                focus:ring-red-500
                transition
              "
            />

          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="
              w-full
              py-4 rounded-2xl
              text-white
              font-semibold
              text-lg
              bg-gradient-to-r
              from-red-500
              to-red-600
              hover:scale-[1.02]
              hover:shadow-xl
              transition-all
              duration-300
            "
          >
            {loading
              ? "Loading..."
              : "Login"}
          </button>

        </form>

        {/* BACK */}
        <button
          onClick={() =>
            router.push("/")
          }
          className="
            mt-8 w-full
            text-red-500
            hover:text-red-600
            transition
            font-medium
          "
        >
          ← Kembali ke Beranda
        </button>

      </div>

    </main>
  );
}