// Script to set up a test embed in the database
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://cvetvxgzgfmiqdxdimzn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXR2eGd6Z2ZtaXFkeGRpbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk0NTYsImV4cCI6MjA2OTk5NTQ1Nn0.pgNeUr3T2LQNL0qno1bxST6HgqbdIrCkJrkb-wOL5SE"
);

async function setupTestEmbed() {
  try {
    console.log("🚀 Setting up test embed...");

    // First, let's check if we have any agents
    const { data: agents, error: agentsError } = await supabase
      .from("agents")
      .select("*")
      .limit(1);

    if (agentsError) {
      console.error("❌ Error fetching agents:", agentsError);
      return;
    }

    if (!agents || agents.length === 0) {
      console.log("⚠️ No agents found. Creating a test agent first...");

      // Create a test agent
      const { data: newAgent, error: agentCreateError } = await supabase
        .from("agents")
        .insert({
          name: "Test AI Assistant",
          system_prompt:
            "You are a helpful AI assistant that can answer questions about technology, programming, and general knowledge.",
          user_id: "test-user-123", // We'll use a test user ID
          is_active: true,
        })
        .select()
        .single();

      if (agentCreateError) {
        console.error("❌ Error creating test agent:", agentCreateError);
        return;
      }

      console.log("✅ Test agent created:", newAgent.id);
      var agentId = newAgent.id;
    } else {
      console.log("✅ Found existing agent:", agents[0].id);
      var agentId = agents[0].id;
    }

    // Now create a test embed
    const { data: embed, error: embedError } = await supabase
      .from("public_embeds")
      .insert({
        agent_id: agentId,
        user_id: "test-user-123", // Test user ID
        embed_code: "test-embed",
        name: "Test Website Chatbot",
        description: "A test chatbot for testing the embed system",
        is_active: true,
        max_requests_per_hour: 100,
        max_requests_per_day: 1000,
      })
      .select()
      .single();

    if (embedError) {
      console.error("❌ Error creating test embed:", embedError);
      return;
    }

    console.log("✅ Test embed created successfully!");
    console.log("📋 Embed Details:");
    console.log("   - ID:", embed.id);
    console.log("   - Code:", embed.embed_code);
    console.log("   - Name:", embed.name);
    console.log("   - Status:", embed.is_active ? "Active" : "Inactive");

    console.log("\n🎯 You can now test the embed with:");
    console.log("   - Script URL: http://localhost:3001/embed/test-embed.js");
    console.log("   - Preview: http://localhost:3001/embed/test-embed");
    console.log("   - Test Page: test-embed.html");
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

// Run the setup
setupTestEmbed();
