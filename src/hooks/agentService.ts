// src/hooks/agentService.ts
import { useAuth } from "@clerk/clerk-react";
import { useClerkSupabase } from "@/lib/useClerkSupabase";

// Types
export interface Agent {
  id: string;
  user_id: string;
  name: string;
  description?: string;
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
  description?: string;
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

export function useAgentService() {
  const { getToken, userId } = useAuth();
  const { getSupabase } = useClerkSupabase();

  // 🔑 Always get authed client with Clerk JWT
  async function getAuthedClient() {
    return await getSupabase();
  }

  // 1. Create agent
  async function createAgent(
    agentData: AgentData
  ): Promise<ServiceResponse<Agent>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { data, error } = await client
        .from("agents")
        .insert([
          {
            user_id: userId,
            name: agentData.name,
            description: agentData.description || null,
            avatar_url: agentData.avatar_url || null,
            heading: agentData.heading || null,
            subheading: agentData.subheading || null,
            system_prompt: agentData.system_prompt || null,
          },
        ])
        .select()
        .single();
      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error creating agent:", err);
      return { data: null, error: "Failed to create agent" };
    }
  }

  // 2. Get all agents for current user
  async function getAgentsByUser(): Promise<ServiceResponse<Agent[]>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { data, error } = await client
        .from("agents")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) return { data: null, error: error.message };
      return { data: data || [], error: null };
    } catch (err) {
      console.error("Unexpected error fetching agents:", err);
      return { data: null, error: "Failed to fetch agents" };
    }
  }

  // 2.5. Get agent by ID
  async function getAgentById(
    agentId: string
  ): Promise<ServiceResponse<Agent>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { data, error } = await client
        .from("agents")
        .select("*")
        .eq("id", agentId)
        .eq("user_id", userId)
        .single();
      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error fetching agent:", err);
      return { data: null, error: "Failed to fetch agent" };
    }
  }

  // 3. Update agent
  async function updateAgent(
    agentId: string,
    updates: Partial<AgentData>
  ): Promise<ServiceResponse<Agent>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { data, error } = await client
        .from("agents")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", agentId)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) return { data: null, error: error.message };
      if (!data)
        return { data: null, error: "Agent not found or access denied" };
      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error updating agent:", err);
      return { data: null, error: "Failed to update agent" };
    }
  }

  // 4. Delete agent
  async function deleteAgent(
    agentId: string
  ): Promise<ServiceResponse<boolean>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { error } = await client
        .from("agents")
        .delete()
        .eq("id", agentId)
        .eq("user_id", userId);
      if (error) return { data: null, error: error.message };
      return { data: true, error: null };
    } catch (err) {
      console.error("Unexpected error deleting agent:", err);
      return { data: null, error: "Failed to delete agent" };
    }
  }

  // 5. Save conversation
  async function saveConversation(
    agentId: string,
    userMessage: string,
    botMessage: string
  ): Promise<ServiceResponse<Conversation>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { data, error } = await client
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
      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error saving conversation:", err);
      return { data: null, error: "Failed to save conversation" };
    }
  }

  // 6. Get conversations
  async function getConversations(
    agentId: string
  ): Promise<ServiceResponse<Conversation[]>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { data, error } = await client
        .from("conversations")
        .select("*")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: true });
      if (error) return { data: null, error: error.message };
      return { data: data || [], error: null };
    } catch (err) {
      console.error("Unexpected error fetching conversations:", err);
      return { data: null, error: "Failed to fetch conversations" };
    }
  }

  // 7. Agent stats
  async function getAgentStats(): Promise<ServiceResponse<any[]>> {
    if (!userId) return { data: null, error: "User not authenticated" };
    try {
      const client = await getAuthedClient();
      const { data, error } = await client
        .from("agent_stats")
        .select("*")
        .eq("user_id", userId)
        .order("total_conversations", { ascending: false });
      if (error) return { data: null, error: error.message };
      return { data: data || [], error: null };
    } catch (err) {
      console.error("Unexpected error fetching agent stats:", err);
      return { data: null, error: "Failed to fetch agent stats" };
    }
  }

  return {
    createAgent,
    getAgentsByUser,
    getAgentById,
    updateAgent,
    deleteAgent,
    saveConversation,
    getConversations,
    getAgentStats,
  };
}
