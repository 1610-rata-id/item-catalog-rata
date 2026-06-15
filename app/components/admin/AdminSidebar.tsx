"use client";

import {
  LayoutDashboard,
  Package,
  PlusSquare,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {

  const router = useRouter();

  const { theme } = useTheme();

async function handleLogout() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
  if (user?.email) {
    await createAuditLog({
      userEmail: user.email,
      action: "LOGOUT",
    });
  }
} catch (err) {
  console.error(err);
}

await supabase.auth.signOut();

router.push("/admin/login");
}

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
  {
  label: "History",
  href: "/admin/history",
  icon: Package,
},
];

  return (
    <div
      className={`
  sticky
  top-6

  w-[260px]
  h-fit

  rounded-[32px]

  p-6

  flex
  flex-col
  gap-4

  ${
    theme === "dark"
      ? `
        border border-cyan-300/20
        bg-[#071828]/80
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(0,255,255,0.08)]
      `
      : `
        border border-slate-200
        bg-white/80
        backdrop-blur-md
        shadow-xl
      `
  }
`}
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
        border-blue-200
        shadow-lg
      `
  }

${
  theme === "dark"
    ? "text-white"
    : "text-slate-700"
}

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
  onClick={handleLogout}
  className={`
  h-20
  rounded-2xl

  border

  ${
    theme === "dark"
      ? `
        border-red-400/20
        text-red-300
      `
      : `
        border-red-200
        text-red-500
      `
  }

  hover:bg-red-500/10

  transition

  flex
  items-center
  justify-center
  gap-3
`}
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
  className={`
    text-xs

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-blue-600"
    }
  `}
>
    Welcome Back,
  </p>

  <h3
  className={`
    text-xl
    font-bold
    mt-2

    ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }
  `}
>
    Admin
  </h3>

  <div
  className={`
    mt-3

    inline-flex
    items-center
    justify-center

    px-4 py-2

    rounded-full

    text-xs

    ${
      theme === "dark"
        ? `
          bg-cyan-500/10
          border border-cyan-300/20
          text-cyan-300
        `
        : `
          bg-blue-50
          border border-blue-200
          text-blue-600
        `
    }
  `}
>
    Administrator
  </div>
</div>

</div>
);
}