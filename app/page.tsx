"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const goToCatalog = () => {
    router.push("/catalog");
  };

  const handleSearch = (e: any) => {
    if (e.key === "Enter") {
      router.push(`/catalog?search=${search}`);
    }
  };

  return (
    <main className="h-screen relative text-white font-[Poppins]">

      {/* BACKGROUND */}
      <img
        src="/hero.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* HEADER */}
      <div className="absolute top-0 w-full flex justify-between items-center px-10 py-5 z-50">

        <img src="/logo.png" className="h-20" />

        <div className="flex items-center gap-8 text-sm">

          <button onClick={() => router.push("/")}>Beranda</button>
          <button onClick={() => router.push("/catalog")}>Category</button>
          <button onClick={() => router.push("/catalog")}>Vendor</button>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cari item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="px-4 py-2 rounded-full text-black w-60 bg-white/90 backdrop-blur"
          />

        </div>
      </div>

      {/* HERO TEXT */}
      <div className="h-full flex flex-col justify-center items-center text-center z-10 relative">

        <h1 className="text-6xl md:text-7xl font-bold tracking-wide">
          ITEM CATALOG
        </h1>

        <p className="mt-3 text-lg opacity-90">
          By Procurement
        </p>

        <button
          onClick={goToCatalog}
          className="mt-6 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Explore Catalog →
        </button>

      </div>

    </main>
  );
}