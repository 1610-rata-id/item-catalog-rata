"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useRequireAuth(
  allowedRoles?: string[]
) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [role, setRole] =
    useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session?.user?.email) {
        router.replace(
          "/admin/login"
        );
        return;
      }

      const {
        data: profile,
        error,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq(
          "email",
          session.user.email
        )
        .single();

      if (
        error ||
        !profile
      ) {
        router.replace(
          "/catalog"
        );
        return;
      }

      const userRole =
        profile.role;

      setRole(userRole);

      if (
        allowedRoles &&
        !allowedRoles.includes(
          userRole
        )
      ) {
        router.replace(
          "/catalog"
        );
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [
    router,
    allowedRoles,
  ]);

  return {
    loading,
    role,
  };
}