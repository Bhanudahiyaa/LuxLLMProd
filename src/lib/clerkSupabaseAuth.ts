import { useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export function useClerkSupabase() {
  const { getToken } = useAuth();

  async function getSupabaseClient() {
    const token = await getToken({ template: "supabase" });
    if (!token) throw new Error("No Clerk token found");

    // v2 SDK: use setSession instead of setAuth
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: "", // Clerk does not give refresh_token
    });

    return supabase;
  }

  return { getSupabaseClient };
}
