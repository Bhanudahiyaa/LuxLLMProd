// Script Generator Service
// This service generates dynamic embed scripts for chatbots

import { ChatbotConfig } from "@/components/chatbot-preview";

export interface ScriptGenerationRequest {
  embedCode: string;
  chatbotName: string;
  systemPrompt: string;
  config: ChatbotConfig;
}

export interface GeneratedScript {
  scriptContent: string;
  embedCode: string;
  downloadUrl?: string;
}

// Generate embed script from template
export async function generateEmbedScript(
  request: ScriptGenerationRequest
): Promise<GeneratedScript> {
  try {
    // Load the template
    const templateResponse = await fetch("/embed-template.js");
    if (!templateResponse.ok) {
      throw new Error("Failed to load script template");
    }

    let templateContent = await templateResponse.text();

    // Replace all placeholders with actual values
    const replacements = {
      "{{EMBED_CODE}}": request.embedCode,
      "{{CHATBOT_NAME}}": escapeJavaScriptString(request.chatbotName),
      "{{SYSTEM_PROMPT}}": escapeJavaScriptString(request.systemPrompt),
      "{{PRIMARY_COLOR}}": request.config.primaryColor || "#3b82f6",
      "{{BACKGROUND_COLOR}}": request.config.backgroundColor || "#ffffff",
      "{{TEXT_COLOR}}": request.config.textColor || "#1f2937",
      "{{ACCENT_COLOR}}": request.config.accentColor || "#e5e7eb",
      "{{BORDER_RADIUS}}": request.config.borderRadius?.toString() || "12",
      "{{FONT_SIZE}}": request.config.fontSize?.toString() || "14",
      "{{FONT_FAMILY}}": request.config.fontFamily || "Inter",
      "{{POSITION}}": request.config.position || "bottom-right",
      "{{WELCOME_MESSAGE}}": escapeJavaScriptString(
        request.config.welcomeMessage || "Hello! How can I help you today?"
      ),
      "{{PLACEHOLDER}}": escapeJavaScriptString(
        request.config.placeholder || "Type your message..."
      ),
      "{{AVATAR_URL}}": request.config.avatar || "",
      "{{SHOW_TYPING_INDICATOR}}":
        request.config.showTypingIndicator?.toString() || "true",
      "{{ENABLE_SOUNDS}}": request.config.enableSounds?.toString() || "false",
      "{{ANIMATION_SPEED}}": request.config.animationSpeed || "normal",
    };

    // Apply all replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      templateContent = templateContent.replace(
        new RegExp(placeholder, "g"),
        value
      );
    });

    // Create download URL for the script
    const blob = new Blob([templateContent], {
      type: "application/javascript",
    });
    const downloadUrl = URL.createObjectURL(blob);

    return {
      scriptContent: templateContent,
      embedCode: request.embedCode,
      downloadUrl,
    };
  } catch (error) {
    console.error("Error generating embed script:", error);
    throw new Error("Failed to generate embed script");
  }
}

// Generate embed HTML snippet
export function generateEmbedHTML(embedCode: string): string {
  return `<script src="https://lux-llm-prod.vercel.app/api/embed-script/${embedCode}.js"></script>`;
}

// Generate iframe embed code
export function generateIframeEmbed(
  embedCode: string,
  width: number = 400,
  height: number = 600
): string {
  return `<iframe src="https://lux-llm-prod.vercel.app/api/embed-preview/${embedCode}" width="${width}" height="${height}" style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"></iframe>`;
}

// Generate integration instructions for different platforms
export function generateIntegrationInstructions(
  embedCode: string
): Record<string, string> {
  return {
    html: `<!-- Add this to your HTML <head> or before </body> -->
<script src="https://lux-llm-prod.vercel.app/api/embed-script/${embedCode}.js"></script>`,

    react: `// Add this to your React component
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://lux-llm-prod.vercel.app/api/embed-script/${embedCode}.js';
  script.async = true;
  document.body.appendChild(script);
  
  return () => {
    document.body.removeChild(script);
  };
}, []);`,

    shopify: `<!-- Add this to your Shopify theme's liquid file -->
{{ 'https://lux-llm-prod.vercel.app/api/embed-script/' | append: '${embedCode}' | append: '.js' | script_tag }}`,

    wix: `<!-- Add this to your Wix site's HTML element -->
<iframe src="https://lux-llm-prod.vercel.app/api/embed-preview/${embedCode}" width="400" height="600" style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"></iframe>`,

    wordpress: `<!-- Add this to your WordPress theme or use a custom HTML widget -->
<script src="https://lux-llm-prod.vercel.app/api/embed-script/${embedCode}.js"></script>`,

    squarespace: `<!-- Add this to your Squarespace site's Code Block -->
<script src="https://lux-llm-prod.vercel.app/api/embed-script/${embedCode}.js"></script>`,
  };
}

// Generate usage analytics snippet
export function generateAnalyticsSnippet(embedCode: string): string {
  return `<!-- Analytics tracking for ${embedCode} -->
<script>
  // Track page views
  fetch('https://lux-llm-prod.vercel.app/api/embed-analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embedCode: '${embedCode}',
      action: 'page_view',
      url: window.location.href,
      referrer: document.referrer
    })
  }).catch(console.error);
</script>`;
}

// Escape JavaScript string to prevent injection
function escapeJavaScriptString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

// Validate embed configuration
export function validateEmbedConfig(config: ChatbotConfig): string[] {
  const errors: string[] = [];

  if (!config.name || config.name.trim().length === 0) {
    errors.push("Chatbot name is required");
  }

  if (!config.systemPrompt || config.systemPrompt.trim().length === 0) {
    errors.push("System prompt is required");
  }

  if (!config.primaryColor || !isValidColor(config.primaryColor)) {
    errors.push("Primary color must be a valid hex color");
  }

  if (!config.backgroundColor || !isValidColor(config.backgroundColor)) {
    errors.push("Background color must be a valid hex color");
  }

  if (!config.textColor || !isValidColor(config.textColor)) {
    errors.push("Text color must be a valid hex color");
  }

  if (
    config.borderRadius &&
    (config.borderRadius < 0 || config.borderRadius > 50)
  ) {
    errors.push("Border radius must be between 0 and 50");
  }

  if (config.fontSize && (config.fontSize < 10 || config.fontSize > 24)) {
    errors.push("Font size must be between 10 and 24");
  }

  return errors;
}

// Validate hex color
function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Generate preview URL for testing
export function generatePreviewURL(embedCode: string): string {
  return `https://lux-llm-prod.vercel.app/embed/${embedCode}`;
}

// Generate documentation for the embed
export function generateEmbedDocumentation(
  embedCode: string,
  config: ChatbotConfig
): string {
  return `# ${config.name} - Chatbot Embed

## Embed Code
\`\`\`html
<script src="https://lux-llm-prod.vercel.app/embed/${embedCode}.js"></script>
\`\`\`

## Configuration
- **Name**: ${config.name}
- **Position**: ${config.position}
- **Primary Color**: ${config.primaryColor}
- **Background Color**: ${config.backgroundColor}
- **Text Color**: ${config.textColor}
- **Border Radius**: ${config.borderRadius}px
- **Font Size**: ${config.fontSize}px
- **Font Family**: ${config.fontFamily}

## Features
- ${config.showTypingIndicator ? "✓" : "✗"} Typing indicator
- ${config.enableSounds ? "✓" : "✗"} Sound notifications
- ${config.animationSpeed !== "normal" ? "✓" : "✗"} Custom animation speed

## Usage
1. Add the script tag to your website
2. The chatbot will appear as a floating button
3. Click the button to open the chat interface
4. Users can interact with the AI-powered chatbot

## Customization
The chatbot automatically uses the theme colors and settings configured in the editor.

## Support
For support or questions, contact the chatbot owner.`;
}
