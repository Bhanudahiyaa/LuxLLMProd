// src/lib/agentService.js
import { supabase } from "./supabaseClient";

export async function createAgentFromTemplate(templateId, ownerId) {
  // Get template data
  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (templateError) throw templateError;

  // Insert into agents
  const { data: newAgent, error: agentError } = await supabase
    .from("agents")
    .insert([
      {
        owner_id: ownerId,
        name: template.title,
        description: template.description,
        config: template.import_json, // assuming your templates table has this column
        system_prompt: template.import_json?.system_prompt || "",
        personality: template.import_json?.personality || "",
        state: "inactive",
      },
    ])
    .select()
    .single();

  if (agentError) throw agentError;

  return newAgent;
}
