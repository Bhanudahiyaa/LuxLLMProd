// src/hooks/agentService.ts
import { useAuth } from "@clerk/clerk-react";
import { getAuthenticatedClient } from "@/lib/supabaseClient";

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

export interface AgentStats {
  id: string;
  user_id: string;
  agent_id: string;
  total_conversations: number;
  total_messages: number;
  created_at: string;
  updated_at: string;
}

// Hook to get authenticated Supabase client with Clerk integration
export function useAgentService() {
  const { getToken, userId } = useAuth();

  // Get authenticated Supabase client
  async function getAuthenticatedSupabase() {
    try {
      console.log("agentService: Getting Clerk token...");
      const token = await getToken({ template: "supabase" });
      console.log("agentService: Clerk token received:", !!token);

      if (!token) throw new Error("No Clerk token found");

      console.log("agentService: Getting authenticated Supabase client...");
      // Use the shared authenticated client
      const client = getAuthenticatedClient(token);
      console.log("agentService: Got authenticated Supabase client");
      return client;
    } catch (error) {
      console.error(
        "agentService: Error getting authenticated Supabase client:",
        error
      );
      throw error;
    }
  }

  // 1. Create a new agent
  async function createAgent(
    agentData: AgentData
  ): Promise<ServiceResponse<Agent>> {
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
            // Add UI customizations
            chat_bg_color: agentData.chat_bg_color || '#ffffff',
            chat_border_color: agentData.chat_border_color || '#e5e7eb',
            user_msg_color: agentData.user_msg_color || '#3b82f6',
            bot_msg_color: agentData.bot_msg_color || '#f3f4f6',
            chat_name: agentData.chat_name || agentData.name,
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
      console.log("agentService: getAgentsByUser called, userId:", userId);

      if (!userId) {
        console.log("agentService: No userId found, user not authenticated");
        return { data: null, error: "User not authenticated" };
      }

      console.log("agentService: Getting authenticated Supabase client...");
      const authenticatedSupabase = await getAuthenticatedSupabase();
      console.log("agentService: Got authenticated client, making query...");

      const { data, error } = await authenticatedSupabase
        .from("agents")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      console.log("agentService: Supabase query result:", { data, error });

      if (error) {
        console.error("agentService: Error fetching agents:", error);
        return { data: null, error: error.message };
      }

      console.log("agentService: Successfully fetched agents:", data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error("agentService: Unexpected error fetching agents:", error);
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
  async function deleteAgent(
    agentId: string
  ): Promise<ServiceResponse<boolean>> {
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
  async function getConversations(
    agentId: string
  ): Promise<ServiceResponse<Conversation[]>> {
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
  async function getAgentStats(): Promise<ServiceResponse<AgentStats[]>> {
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
