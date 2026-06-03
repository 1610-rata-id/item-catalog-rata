"use client";

import {
  LayoutDashboard,
  Package,
  PlusSquare,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  const menus = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Catalog",
    href: "/catalog",
    icon: Package,
  },
  {
    label: "Add Item",
    href: "/admin/add-item",
    icon: PlusSquare,
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
          className={`
  h-20
  rounded-2xl

  border

  ${
    menu.href === "/admin/dashboard"
      ? `
        border-cyan-300/40
        bg-cyan-500/10
        shadow-[0_0_30px_rgba(0,255,255,0.18)]
      `
      : `
        border-cyan-300/10
        bg-white/5
      `
  }

  text-white
  text-lg

  hover:border-cyan-300/40
  hover:bg-cyan-500/10

  transition
`}
        >
          <div className="flex items-center gap-3 justify-center">
  <menu.icon size={20} />
  <span>{menu.label}</span>
</div>
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
    flex
    items-center
    justify-center
    gap-3
  "
>
  <LogOut size={20} />
  <span>Logout</span>
</button>

{/* USER CARD */}

<div
  className="
    mt-6

    rounded-3xl
    border border-cyan-300/10

    bg-white/5
    backdrop-blur-xl

    p-4

    text-center
  "
>
  <p
    className="
      text-cyan-300
      text-xs
    "
  >
    Welcome Back,
  </p>

  <h3
    className="
      text-white
      text-xl
      font-bold
      mt-2
    "
  >
    Admin
  </h3>

  <div
    className="
      mt-3

      inline-flex
      items-center
      justify-center

      px-3 py-1.5

      rounded-full

      bg-cyan-500/10
      border border-cyan-300/20

      text-cyan-300
      text-xs
    "
  >
    Administrator
  </div>
</div>

</div>
);
}