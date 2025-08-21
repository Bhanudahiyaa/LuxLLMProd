// Debug script to test agent data storage and retrieval
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://cvetvxgzgfmiqdxdimzn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXR2eGd6Z2ZtaXFkeGRpbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk0NTYsImV4cCI6MjA2OTk5NTQ1Nn0.pgNeUr3T2LQNL0qno1bxST6HgqbdIrCkJrkb-wOL5SE"
);

async function debugAgentData() {
  console.log("🔍 Debugging agent data...");
  
  try {
    // 1. Check agents table
    console.log("\n1. Checking agents table...");
    const { data: agents, error: agentsError } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (agentsError) {
      console.error("❌ Error fetching agents:", agentsError);
    } else {
      console.log("✅ Agents found:", agents?.length || 0);
      agents?.forEach((agent, index) => {
        console.log(`   Agent ${index + 1}:`, {
          id: agent.id,
          name: agent.name,
          chat_bg_color: agent.chat_bg_color,
          user_msg_color: agent.user_msg_color,
          bot_msg_color: agent.bot_msg_color,
          chat_border_color: agent.chat_border_color,
          system_prompt: agent.system_prompt?.substring(0, 50) + "...",
          created_at: agent.created_at
        });
      });
    }

    // 2. Check public_embeds table
    console.log("\n2. Checking public_embeds table...");
    const { data: embeds, error: embedsError } = await supabase
      .from("public_embeds")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (embedsError) {
      console.error("❌ Error fetching embeds:", embedsError);
    } else {
      console.log("✅ Embeds found:", embeds?.length || 0);
      embeds?.forEach((embed, index) => {
        console.log(`   Embed ${index + 1}:`, {
          id: embed.id,
          embed_code: embed.embed_code,
          agent_id: embed.agent_id,
          name: embed.name,
          created_at: embed.created_at
        });
      });
    }

    // 3. Test a specific embed query
    if (embeds && embeds.length > 0) {
      const testEmbed = embeds[0];
      console.log(`\n3. Testing embed query for: ${testEmbed.embed_code}`);
      
      const { data: embedWithAgent, error: queryError } = await supabase
        .from("public_embeds")
        .select(`
          *,
          agents (
            id,
            name,
            system_prompt,
            avatar_url,
            chat_bg_color,
            chat_border_color,
            user_msg_color,
            bot_msg_color,
            chat_name,
            heading,
            subheading
          )
        `)
        .eq("embed_code", testEmbed.embed_code)
        .eq("is_active", true)
        .single();
      
      if (queryError) {
        console.error("❌ Error fetching embed with agent:", queryError);
      } else {
        console.log("✅ Embed with agent data:", {
          embed_code: embedWithAgent.embed_code,
          agent: embedWithAgent.agents ? {
            name: embedWithAgent.agents.name,
            chat_bg_color: embedWithAgent.agents.chat_bg_color,
            user_msg_color: embedWithAgent.agents.user_msg_color,
            system_prompt: embedWithAgent.agents.system_prompt?.substring(0, 50) + "..."
          } : "No agent data"
        });
      }
    }

  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the debug function
debugAgentData();
