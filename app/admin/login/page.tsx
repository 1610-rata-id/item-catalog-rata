"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createAuditLog } from "@/lib/audit";
import { useTheme } from "@/app/providers/ThemeProvider";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();

  const { theme } = useTheme();

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

  await createAuditLog({
    userEmail: email,
    action: "LOGIN",
  });

  router.push(
    "/admin/dashboard"
  );
}
else if (
  profile?.role === "inventory"
) {

  await createAuditLog({
    userEmail: email,
    action: "LOGIN",
  });

  router.push(
    "/catalog"
  );
}
else {
  alert("Role tidak memiliki akses");
  await supabase.auth.signOut();
}
  }

  return (
    <main
  className={`
    relative
    min-h-screen
    overflow-hidden

    flex
    items-center
    justify-center

    ${
      theme === "dark"
        ? "bg-black"
        : "bg-[#f6f8fc]"
    }
  `}
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
  className={`
    relative
    z-10

    w-full
    max-w-md

    overflow-hidden
    rounded-[38px]

    ${
      theme === "dark"
        ? `
          border border-cyan-300/20
          bg-black/35
          backdrop-blur-xl
          shadow-[0_0_60px_rgba(0,255,255,0.15)]
        `
        : `
          border border-slate-200
          bg-white/80
          backdrop-blur-md
          shadow-2xl
        `
    }
  `}
>

    {/* SOFT GLOW */}
    <div
  className={`
    absolute
    w-[280px]
    h-[280px]

    rounded-full
    blur-3xl

    ${
      theme === "dark"
        ? "bg-cyan-400/20"
        : "bg-blue-200/40"
    }
  `}
/>

        {/* CONTENT */}
        <div className="px-8 pt-10 pb-8">
          {/* TITLE */}
          <div className="text-center">
            <p
  className={`
    text-[13px]
    font-semibold
    uppercase
    tracking-[0.28em]

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-blue-600"
    }
  `}
>
              ITEM CATALOG SYSTEM
            </p>

            <h1
  className={`
    mt-4
    text-[52px]
    leading-none
    font-bold
    tracking-tight

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
>
              Admin Login
            </h1>

            <p
  className={`
    mt-5
    text-[16px]
    leading-relaxed

    ${
      theme === "dark"
        ? "text-gray-500"
        : "text-slate-500"
    }
  `}
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
                className={`
                  mb-3
                  block
                  text-[15px]
                  font-medium
                  ${
  theme === "dark"
    ? "text-gray-200"
    : "text-slate-600"
}
                `}
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
  className={`
  w-full
  rounded-[22px]
  border
  px-5
  py-5
  text-[16px]
  outline-none
  transition-all

  ${
    theme === "dark"
      ? `
        border-cyan-300/30
        bg-black/20
        text-white
      `
      : `
        border-cyan-200
        bg-blue-50/70
        text-slate-800
      `
  }
`}
/>
            </div>

            {/* PASSWORD */}
            <div>
  <label
    className={`
                  mb-3
                  block
                  text-[15px]
                  font-medium
                  ${
  theme === "dark"
    ? "text-gray-200"
    : "text-slate-600"
}
                `}
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
      className={`
  w-full
  rounded-[22px]
  border
  px-5
  py-5
  text-[16px]
  outline-none
  transition-all

  ${
    theme === "dark"
      ? `
        border-cyan-300/30
        bg-black/20
        text-white
      `
      : `
        border-cyan-200
        bg-blue-50/70
        text-slate-800
      `
  }
`}
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }
      className={`
  absolute
  right-5
  top-1/2
  -translate-y-1/2

  ${
    theme === "dark"
      ? "text-gray-400"
      : "text-slate-500"
  }
`}
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
              className={`
  mt-2
  w-full
  rounded-[22px]
  py-5
  text-[17px]
  font-semibold
  text-white
  transition-all
  duration-300
  hover:scale-[1.01]
  disabled:opacity-50

  ${
    theme === "dark"
      ? `
        bg-gradient-to-r
        from-cyan-400
        to-cyan-300
        shadow-[0_10px_30px_rgba(0,255,255,0.25)]
        hover:shadow-[0_15px_40px_rgba(0,255,255,0.35)]
      `
      : `
        bg-gradient-to-r
        from-[#18c7ea]
        to-[#5fdcf7]
        shadow-lg
        hover:shadow-2xl
      `
  }
`}
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
            className={`
  mt-6
  w-full
  rounded-[22px]
  py-5
  text-[16px]
  font-medium
  transition-all
  duration-300
  hover:scale-[1.01]
  disabled:opacity-50

  ${
    theme === "dark"
      ? `
        border
        border-cyan-300/20
        bg-white/10
        text-white
        hover:bg-white/15
      `
      : `
        border
        border-slate-200
        bg-white
        text-slate-600
        shadow-sm
        hover:bg-slate-50
      `
  }
`}
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </main>
  );
}