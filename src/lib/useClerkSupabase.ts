import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useClerkSupabase() {
  const { getToken } = useAuth();

  const getSupabase = useCallback(async (): Promise<SupabaseClient> => {
    const token = await getToken({ template: "supabase" });
    if (!token) throw new Error("No Clerk token available");

    await supabase.auth.signInWithIdToken({
      provider: "clerk",
      token,
    });

    return supabase;
  }, [getToken]);

  return { getSupabase };
}
