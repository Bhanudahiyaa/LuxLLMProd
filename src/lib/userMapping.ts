// src/lib/userMapping.ts
import { useAuth } from "@clerk/clerk-react";
import { supabase } from "./supabaseClient";

export async function ensureUserMapping(clerkId: string) {
  const { data, error } = await supabase
    .from("user_mapping")
    .select("supabase_uid")
    .eq("clerk_id", clerkId)
    .single();

  if (data) return data.supabase_uid;

  // Insert new mapping
  const { data: inserted, error: insertError } = await supabase
    .from("user_mapping")
    .insert([{ clerk_id: clerkId }])
    .select("supabase_uid")
    .single();

  if (insertError) throw insertError;
  return inserted.supabase_uid;
}