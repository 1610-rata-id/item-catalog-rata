import { supabase } from "@/lib/supabase";

export async function getCurrentUserRole() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.email) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "email",
        session.user.email
      )
      .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data.role;
}