// Embed Service for managing public chatbot embeds
// This service handles creating, updating, and managing public embed configurations

import { useAuth } from "@clerk/clerk-react";
import { getAuthenticatedClient } from "@/lib/supabaseClient";

// Types
export interface PublicEmbed {
  id: string;
  agent_id: string;
  user_id: string;
  embed_code: string;
  name: string;
  description?: string;
  is_active: boolean;
  max_requests_per_hour: number;
  max_requests_per_day: number;
  total_requests: number;
  last_request_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmbedRequest {
  agentId: string;
  name: string;
  description?: string;
  maxRequestsPerHour?: number;
  maxRequestsPerDay?: number;
}

export interface UpdateEmbedRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  max_requests_per_hour?: number;
  max_requests_per_day?: number;
}

export interface EmbedStats {
  totalConversations: number;
  totalMessages: number;
  totalTokens: number;
  uniqueVisitors: number;
  lastActivity: string;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// Hook for embed management
export function useEmbedService() {
  const { getToken, userId } = useAuth();

  // Get authenticated Supabase client
  async function getAuthenticatedSupabase() {
    try {
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("No Clerk token found");

      const client = getAuthenticatedClient(token);
      return client;
    } catch (error) {
      console.error("Error getting authenticated Supabase client:", error);
      throw error;
    }
  }

  // 1. Create a new public embed
  async function createEmbed(
    request: CreateEmbedRequest
  ): Promise<ServiceResponse<PublicEmbed>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      // Generate unique embed code
      const embedCode = generateEmbedCode();

      // Create embed record
      const { data: embed, error } = await client
        .from("public_embeds")
        .insert({
          agent_id: request.agentId,
          user_id: userId,
          embed_code: embedCode,
          name: request.name,
          description: request.description,
          max_requests_per_hour: request.maxRequestsPerHour || 100,
          max_requests_per_day: request.maxRequestsPerDay || 1000,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Embed created successfully:", embed);
      return { data: embed, error: null };
    } catch (error) {
      console.error("Error creating embed:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to create embed",
      };
    }
  }

  // 2. Get all embeds for the current user
  async function getUserEmbeds(): Promise<ServiceResponse<PublicEmbed[]>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      const { data: embeds, error } = await client
        .from("public_embeds")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { data: embeds || [], error: null };
    } catch (error) {
      console.error("Error getting user embeds:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to get embeds",
      };
    }
  }

  // 3. Get embed by ID
  async function getEmbedById(
    embedId: string
  ): Promise<ServiceResponse<PublicEmbed>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      const { data: embed, error } = await client
        .from("public_embeds")
        .select("*")
        .eq("id", embedId)
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return { data: embed, error: null };
    } catch (error) {
      console.error("Error getting embed:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to get embed",
      };
    }
  }

  // 4. Update embed
  async function updateEmbed(
    embedId: string,
    updates: UpdateEmbedRequest
  ): Promise<ServiceResponse<PublicEmbed>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      const { data: embed, error } = await client
        .from("public_embeds")
        .update(updates)
        .eq("id", embedId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Embed updated successfully:", embed);
      return { data: embed, error: null };
    } catch (error) {
      console.error("Error updating embed:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to update embed",
      };
    }
  }

  // 5. Delete embed
  async function deleteEmbed(
    embedId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      const { error } = await client
        .from("public_embeds")
        .delete()
        .eq("id", embedId)
        .eq("user_id", userId);

      if (error) throw error;

      console.log("✅ Embed deleted successfully");
      return { data: true, error: null };
    } catch (error) {
      console.error("Error deleting embed:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to delete embed",
      };
    }
  }

  // 6. Get embed statistics
  async function getEmbedStats(
    embedId: string
  ): Promise<ServiceResponse<EmbedStats>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      // Get total conversations
      const { count: totalConversations } = await client
        .from("public_conversations")
        .select("*", { count: "exact", head: true })
        .eq("embed_id", embedId);

      // Get total messages
      const { count: totalMessages } = await client
        .from("public_messages")
        .select("*", { count: "exact", head: true })
        .eq("embed_id", embedId);

      // Get last activity
      const { data: lastConversation } = await client
        .from("public_conversations")
        .select("last_message_at")
        .eq("embed_id", embedId)
        .order("last_message_at", { ascending: false })
        .limit(1)
        .single();

      // Get unique visitors (approximate)
      const { count: uniqueVisitors } = await client
        .from("public_conversations")
        .select("visitor_ip", { count: "exact", head: true })
        .eq("embed_id", embedId)
        .not("visitor_ip", "is", null);

      const stats: EmbedStats = {
        totalConversations: totalConversations || 0,
        totalMessages: totalMessages || 0,
        totalTokens: 0, // TODO: Implement token tracking
        uniqueVisitors: uniqueVisitors || 0,
        lastActivity: lastConversation?.last_message_at || "Never",
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error getting embed stats:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to get embed stats",
      };
    }
  }

  // 7. Toggle embed status
  async function toggleEmbedStatus(
    embedId: string
  ): Promise<ServiceResponse<PublicEmbed>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      // Get current status
      const { data: currentEmbed } = await client
        .from("public_embeds")
        .select("is_active")
        .eq("id", embedId)
        .eq("user_id", userId)
        .single();

      if (!currentEmbed) {
        return { data: null, error: "Embed not found" };
      }

      // Toggle status
      const { data: updatedEmbed, error } = await client
        .from("public_embeds")
        .update({ is_active: !currentEmbed.is_active })
        .eq("id", embedId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Embed status toggled:", updatedEmbed);
      return { data: updatedEmbed, error: null };
    } catch (error) {
      console.error("Error toggling embed status:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to toggle embed status",
      };
    }
  }

  // 8. Regenerate embed code
  async function regenerateEmbedCode(
    embedId: string
  ): Promise<ServiceResponse<PublicEmbed>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const client = await getAuthenticatedSupabase();

      const newEmbedCode = generateEmbedCode();

      const { data: embed, error } = await client
        .from("public_embeds")
        .update({ embed_code: newEmbedCode })
        .eq("id", embedId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Embed code regenerated:", embed);
      return { data: embed, error: null };
    } catch (error) {
      console.error("Error regenerating embed code:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to regenerate embed code",
      };
    }
  }

  return {
    createEmbed,
    getUserEmbeds,
    getEmbedById,
    updateEmbed,
    deleteEmbed,
    getEmbedStats,
    toggleEmbedStatus,
    regenerateEmbedCode,
  };
}

// Helper function to generate unique embed codes
function generateEmbedCode(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `embed-${timestamp}-${random}`;
}
