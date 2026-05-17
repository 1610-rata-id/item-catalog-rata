import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(
  req: NextRequest
) {
  const res = NextResponse.next();

  const supabase =
    createMiddlewareClient({
      req,
      res,
    });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // PROTECT ADMIN ROUTES
  if (
    req.nextUrl.pathname.startsWith(
      "/admin"
    )
  ) {
    // ALLOW LOGIN PAGE
    if (
      req.nextUrl.pathname ===
      "/admin/login"
    ) {
      return res;
    }

    // NO SESSION
    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/admin/login",
          req.url
        )
      );
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};