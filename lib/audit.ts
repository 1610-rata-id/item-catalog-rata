import { supabase } from "@/lib/supabase";

export async function createAuditLog({
  userEmail,
  action,
  itemId = null,
  itemName = null,
  oldData = null,
  newData = null,
}: {
  userEmail: string;
  action: string;
  itemId?: string | null;
  itemName?: string | null;
  oldData?: any;
  newData?: any;
}) {
  const { error } = await supabase
    .from("audit_logs")
    .insert({
      user_email: userEmail,
      action,
      item_id: itemId,
      item_name: itemName,
      old_data: oldData,
      new_data: newData,
    });

  if (error) {
  console.error("AUDIT LOG ERROR");
  console.error(error);
  console.error(JSON.stringify(error));
}
}