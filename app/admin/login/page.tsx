"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
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
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f8f8f7] flex items-center justify-center font-[Poppins]">

      <form
        onSubmit={handleLogin}
        className="
          bg-white p-10 rounded-3xl
          shadow-xl w-full max-w-md
        "
      >

        <h1 className="text-3xl font-bold mb-8 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full border rounded-xl
            p-4 mb-4 outline-none
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            w-full border rounded-xl
            p-4 mb-6 outline-none
          "
        />

        <button
          disabled={loading}
          className="
            w-full bg-black text-white
            rounded-xl p-4
            hover:opacity-90
            transition
          "
        >
          {loading
            ? "Loading..."
            : "Login"}
        </button>

      </form>

    </main>
  );
}