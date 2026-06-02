"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="h-10" />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">

          <button onClick={() => router.push("/")}>
            Beranda
          </button>

          <button onClick={() => router.push("/public-catalog")}>
            Public Catalog
          </button>

          <button>
            Vendor
          </button>

          <button
            onClick={() => router.push("/admin/login")}
            className="px-4 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
          >
            Internal Login
          </button>

        </nav>
      </div>
    </header>
  );
}