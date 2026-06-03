"use client";

import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  const menus = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Catalog",
      href: "/catalog",
    },
    {
      label: "Add Item",
      href: "/admin/add-item",
    },
  ];

  return (
    <div
      className="
        sticky
        top-6

        w-[260px]
        h-fit

        rounded-[32px]
        border border-cyan-300/20

        bg-[#071828]/80
        backdrop-blur-xl

        p-6

        flex flex-col
        gap-4

        shadow-[0_0_40px_rgba(0,255,255,0.08)]
      "
    >

      {/* LOGO */}

      <div className="mb-4">
        <img
          src="/logo.png"
          alt="logo"
          className="
            w-full
            h-auto
            object-contain
          "
        />
      </div>

      {/* MENU */}

      {menus.map((menu) => (
        <button
          key={menu.href}
          onClick={() =>
            router.push(menu.href)
          }
          className="
            h-20

            rounded-2xl

            border
            border-cyan-300/10

            bg-gradient-to-r
            from-cyan-500/10
            to-transparent

            text-white
            text-lg

            hover:border-cyan-300/40
            hover:bg-cyan-500/10

            transition
          "
        >
          {menu.label}
        </button>
      ))}

      {/* LOGOUT */}

      <button
        onClick={() =>
          router.push("/admin/login")
        }
        className="
          h-20

          rounded-2xl

          border
          border-red-400/20

          text-red-300

          hover:bg-red-500/10

          transition
        "
      >
        Logout
      </button>

    </div>
  );
}