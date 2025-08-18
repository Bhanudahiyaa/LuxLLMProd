import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { getAuthenticatedClient } from "./supabaseClient";

export function useClerkSupabase() {
  const { getToken } = useAuth();

  const getSupabase = useCallback(async (): Promise<SupabaseClient> => {
    const token = await getToken({ template: "supabase" });
    if (!token) throw new Error("No Clerk token available");

    // Use the shared authenticated client
    return await getAuthenticatedClient(token);
  }, [getToken]);

  return { getSupabase };
}
