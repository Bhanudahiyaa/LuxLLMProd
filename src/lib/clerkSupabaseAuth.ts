import { useAuth } from "@clerk/clerk-react";
import { getAuthenticatedClient } from "./supabaseClient";

export function useClerkSupabase() {
  const { getToken } = useAuth();

  async function getSupabaseClient() {
    const token = await getToken({ template: "supabase" });
    if (!token) throw new Error("No Clerk token found");

    // Use the shared authenticated client
    return await getAuthenticatedClient(token);
  }

  return { getSupabaseClient };
}
