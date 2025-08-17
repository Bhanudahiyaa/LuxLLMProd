// src/lib/createAgentFromTemplate.ts
import { supabase } from "./supabaseClient";
import { toast } from "react-hot-toast";

/**
 * Creates a new agent directly from a full template object.
 * @param {object} template - Full template object with all config data.
 * @param {string} userId - UUID of logged-in user from Supabase Auth.
 */
export async function createAgentFromTemplate(template, userId) {
  try {
    const newAgent = {
      user_id: userId,
      name: template.name || template.title,
      description: template.description || "",
      personality: template.personality || "",
      temperature: template.temperature ?? 0.5,
      system_prompt: template.systemPrompt || "",
    };

    const { data: agent, error } = await supabase
      .from("agents")
      .insert([newAgent])
      .select()
      .single();

    if (error) {
      console.error("Agent creation error:", error);
      toast.error("Failed to create agent.");
      return null;
    }

    toast.success("Agent created successfully!");
    return agent;
  } catch (err) {
    console.error("Unexpected error creating agent:", err);
    toast.error("Something went wrong.");
    return null;
  }
}
