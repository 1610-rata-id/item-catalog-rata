"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
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

const { data: profile } =
  await supabase
    .from("profiles")
    .select("role")
    .eq("email", email)
    .single();

if (
  profile?.role === "admin"
) {
  router.push(
    "/admin/dashboard"
  );
} else if (
  profile?.role === "inventory"
) {
  router.push(
    "/catalog"
  );
} else {
  alert("Role tidak memiliki akses");
  await supabase.auth.signOut();
}
  }

  return (
    <main
  className="
    relative
    min-h-screen
    overflow-hidden
    flex
    items-center
    justify-center
  "
>
      {/* BACKGROUND */}
<img
  src="/hero-v2.jpg"
  alt="Background"
  className="
    absolute
    inset-0
    w-full
    h-full
    object-cover
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
          border-cyan-300/20
          bg-black/35
          backdrop-blur-xl
border-cyan-300/20
shadow-[0_0_60px_rgba(0,255,255,0.15)]
        "
      >

    {/* SOFT GLOW */}
    <div
      className="
        absolute
        w-[280px]
        h-[280px]
        bg-red-100/40
        rounded-full
        blur-3xl
      "
    />

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
                text-cyan-300
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
                text-white
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
              Masuk untuk mengakses katalog internal
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
                  text-gray-200
                "
              >
                Email Address
              </label>

              <input
  type="email"
  autoComplete="email"
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
    border-cyan-300/30
    bg-black/20
    px-5
    py-5
    text-[16px]
    text-white
    outline-none
    transition-all
    duration-300
    placeholder:text-gray-400
    focus:border-red-400
    focus:bg-white
    focus:text-black
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
      text-gray-200
    "
  >
    Password
  </label>

  <div className="relative">

    <input
      type={
        showPassword
          ? "text"
          : "password"
      }
      autoComplete="current-password"
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
        border-cyan-300/30
        bg-black/20
        px-5
        pr-14
        py-5
        text-[16px]
        text-white
        outline-none
        transition-all
        duration-300
        placeholder:text-gray-400
        focus:border-red-400
        focus:bg-white
        focus:text-black
        focus:ring-4
        focus:ring-red-100
      "
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }
      className="
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        text-gray-400
        hover:text-cyan-300
        transition
      "
    >
      {showPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>

  </div>
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
                from-cyan-400
                to-cyan-300
                py-5
                text-[17px]
                font-semibold
                text-white
                shadow-[0_10px_30px_rgba(0,255,255,0.25)]
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