// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Create the main shared client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// Create a single authenticated client instance that can be reused
let authenticatedClient: SupabaseClient | null = null;

// Function to get or create an authenticated client
export function getAuthenticatedClient(token: string): SupabaseClient {
  if (!authenticatedClient) {
    authenticatedClient = createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
  } else {
    // Update the existing client's headers with the new token
    authenticatedClient.rest.headers = {
      ...authenticatedClient.rest.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return authenticatedClient;
}
