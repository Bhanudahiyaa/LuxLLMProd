// src/hooks/agentService.ts
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

// Types for better TypeScript support
export interface Agent {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  heading?: string;
  subheading?: string;
  system_prompt?: string;
  chat_bg_color?: string;
  chat_border_color?: string;
  user_msg_color?: string;
  bot_msg_color?: string;
  chat_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  user_message: string;
  bot_message: string;
  created_at: string;
}

export interface AgentData {
  name: string;
  avatar_url?: string;
  heading?: string;
  subheading?: string;
  system_prompt?: string;
  chat_bg_color?: string;
  chat_border_color?: string;
  user_msg_color?: string;
  bot_msg_color?: string;
  chat_name?: string;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// Hook to get authenticated Supabase client with Clerk integration
export function useAgentService() {
  const { getToken, userId } = useAuth();

  // Singleton Supabase client to avoid multiple instances
  let authenticatedSupabaseClient: any = null;

  // Get authenticated Supabase client
  async function getAuthenticatedSupabase() {
    try {
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("No Clerk token found");

      // Reuse existing client if available and token hasn't changed
      if (authenticatedSupabaseClient) {
        return authenticatedSupabaseClient;
      }

      // Create a new Supabase client with the JWT token
      authenticatedSupabaseClient = createClient(
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

      return authenticatedSupabaseClient;
    } catch (error) {
      console.error("Error getting authenticated Supabase client:", error);
      throw error;
    }
  }

  // 1. Create a new agent
  async function createAgent(agentData: AgentData): Promise<ServiceResponse<Agent>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      const { data, error } = await authenticatedSupabase
        .from("agents")
        .insert([
          {
            user_id: userId,
            name: agentData.name,
            avatar_url: agentData.avatar_url || null,
            heading: agentData.heading || null,
            subheading: agentData.subheading || null,
            system_prompt: agentData.system_prompt || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating agent:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error creating agent:", error);
      return { data: null, error: "Failed to create agent" };
    }
  }

  // 2. Get all agents for the current user
  async function getAgentsByUser(): Promise<ServiceResponse<Agent[]>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      const { data, error } = await authenticatedSupabase
        .from("agents")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching agents:", error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error fetching agents:", error);
      return { data: null, error: "Failed to fetch agents" };
    }
  }

  // 3. Update an existing agent
  async function updateAgent(
    agentId: string,
    updates: Partial<AgentData>
  ): Promise<ServiceResponse<Agent>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      const { data, error } = await authenticatedSupabase
        .from("agents")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", agentId)
        .eq("user_id", userId) // Ensure user owns the agent
        .select()
        .single();

      if (error) {
        console.error("Error updating agent:", error);
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: "Agent not found or access denied" };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error updating agent:", error);
      return { data: null, error: "Failed to update agent" };
    }
  }

  // 4. Delete an agent (cascades conversations)
  async function deleteAgent(agentId: string): Promise<ServiceResponse<boolean>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      const { error } = await authenticatedSupabase
        .from("agents")
        .delete()
        .eq("id", agentId)
        .eq("user_id", userId); // Ensure user owns the agent

      if (error) {
        console.error("Error deleting agent:", error);
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error("Unexpected error deleting agent:", error);
      return { data: null, error: "Failed to delete agent" };
    }
  }

  // 5. Save a conversation
  async function saveConversation(
    agentId: string,
    userMessage: string,
    botMessage: string
  ): Promise<ServiceResponse<Conversation>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      // First verify the agent belongs to the user (RLS will handle this, but good to be explicit)
      const { data: agent } = await authenticatedSupabase
        .from("agents")
        .select("id")
        .eq("id", agentId)
        .eq("user_id", userId)
        .single();

      if (!agent) {
        return { data: null, error: "Agent not found or access denied" };
      }

      const { data, error } = await authenticatedSupabase
        .from("conversations")
        .insert([
          {
            agent_id: agentId,
            user_message: userMessage,
            bot_message: botMessage,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error saving conversation:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error saving conversation:", error);
      return { data: null, error: "Failed to save conversation" };
    }
  }

  // 6. Get all conversations for an agent
  async function getConversations(agentId: string): Promise<ServiceResponse<Conversation[]>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      // First verify the agent belongs to the user
      const { data: agent } = await authenticatedSupabase
        .from("agents")
        .select("id")
        .eq("id", agentId)
        .eq("user_id", userId)
        .single();

      if (!agent) {
        return { data: null, error: "Agent not found or access denied" };
      }

      const { data, error } = await authenticatedSupabase
        .from("conversations")
        .select("*")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching conversations:", error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error fetching conversations:", error);
      return { data: null, error: "Failed to fetch conversations" };
    }
  }

  // Bonus: Get agent statistics
  async function getAgentStats(): Promise<ServiceResponse<any[]>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      const { data, error } = await authenticatedSupabase
        .from("agent_stats")
        .select("*")
        .eq("user_id", userId)
        .order("total_conversations", { ascending: false });

      if (error) {
        console.error("Error fetching agent stats:", error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error fetching agent stats:", error);
      return { data: null, error: "Failed to fetch agent stats" };
    }
  }

  return {
    createAgent,
    getAgentsByUser,
    updateAgent,
    deleteAgent,
    saveConversation,
    getConversations,
    getAgentStats,
  };
}
