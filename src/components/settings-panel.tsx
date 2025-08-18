"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ThemeSelector } from "@/components/theme-selector";
import { getThemeById, themePresets, type ThemePreset } from "@/lib/themes";

interface ChatbotConfig {
  name: string;
  theme: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  position: string;
  welcomeMessage: string;
  systemPrompt: string;
  placeholder: string;
  avatar: string;
  showTypingIndicator: boolean;
  enableSounds: boolean;
  animationSpeed: string;
}

interface SettingsPanelProps {
  config: ChatbotConfig;
  onConfigChange: (config: ChatbotConfig) => void;
  lockedFields?: string[];
  onAvatarUpload?: (file: File) => void;
}

export function SettingsPanel({
  config,
  onConfigChange,
  lockedFields = [],
  onAvatarUpload,
}: SettingsPanelProps) {
  const updateConfig = (updates: Partial<ChatbotConfig>) => {
    const newConfig = { ...config, ...updates };
    onConfigChange(newConfig);
  };

  const handleThemeSelect = (theme: ThemePreset) => {
    // Apply theme configuration to all relevant fields
    updateConfig({
      theme: theme.id,
      primaryColor: theme.config.primaryColor,
      accentColor: theme.config.accentColor,
      backgroundColor: theme.config.backgroundColor,
      textColor: theme.config.textColor,
      borderRadius: theme.config.borderRadius,
      fontSize: theme.config.fontSize,
      fontFamily: theme.config.fontFamily,
    });
  };

  const handleColorChange = (field: keyof ChatbotConfig, value: string) => {
    updateConfig({ [field]: value });
  };

  const handleRangeChange = (field: keyof ChatbotConfig, value: number) => {
    updateConfig({ [field]: value });
  };

  const handleSwitchChange = (field: keyof ChatbotConfig, value: boolean) => {
    updateConfig({ [field]: value });
  };

  const handleSelectChange = (field: keyof ChatbotConfig, value: string) => {
    updateConfig({ [field]: value });
  };

  const handleTextChange = (field: keyof ChatbotConfig, value: string) => {
    updateConfig({ [field]: value });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="p-6 backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <Tabs defaultValue="appearance" className="w-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-md border border-white/20">
              <TabsTrigger
                value="themes"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-500 text-gray-300 hover:text-white transition-all duration-300"
              >
                Themes
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-500 text-gray-300 hover:text-white transition-all duration-300"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="behavior"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-500 text-gray-300 hover:text-white transition-all duration-300"
              >
                Behavior
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-500 text-gray-300 hover:text-white transition-all duration-300"
              >
                Messages
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="themes" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <ThemeSelector
                currentTheme={config.theme}
                onThemeSelect={handleThemeSelect}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Chatbot Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    value={config.name}
                    onChange={e => handleTextChange("name", e.target.value)}
                    placeholder="AI Assistant"
                    disabled={lockedFields?.includes("name")}
                    className={
                      lockedFields?.includes("name") ? "opacity-70" : ""
                    }
                  />
                  {lockedFields?.includes("name") && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={e =>
                        handleColorChange("primaryColor", e.target.value)
                      }
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={e =>
                        handleColorChange("primaryColor", e.target.value)
                      }
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={config.backgroundColor}
                      onChange={e =>
                        handleColorChange("backgroundColor", e.target.value)
                      }
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.backgroundColor}
                      onChange={e =>
                        handleColorChange("backgroundColor", e.target.value)
                      }
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={config.textColor}
                    onChange={e =>
                      handleColorChange("textColor", e.target.value)
                    }
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={config.textColor}
                    onChange={e =>
                      handleColorChange("textColor", e.target.value)
                    }
                    placeholder="#111827"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">
                  Border Radius: {config.borderRadius}px
                </Label>
                <Input
                  id="borderRadius"
                  type="range"
                  min="0"
                  max="24"
                  value={config.borderRadius}
                  onChange={e =>
                    handleRangeChange(
                      "borderRadius",
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={config.fontFamily}
                  onValueChange={value =>
                    handleSelectChange("fontFamily", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={config.position}
                  onValueChange={value => handleSelectChange("position", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Typing Indicator</Label>
                  <p className="text-sm text-muted-foreground">
                    Display typing animation when bot is responding
                  </p>
                </div>
                <Switch
                  checked={config.showTypingIndicator}
                  onCheckedChange={checked =>
                    handleSwitchChange("showTypingIndicator", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Sounds</Label>
                  <p className="text-sm text-muted-foreground">
                    Play notification sounds for new messages
                  </p>
                </div>
                <Switch
                  checked={config.enableSounds}
                  onCheckedChange={checked =>
                    handleSwitchChange("enableSounds", checked)
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="animationSpeed">Animation Speed</Label>
                <Select
                  value={config.animationSpeed}
                  onValueChange={value =>
                    handleSelectChange("animationSpeed", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <div className="relative">
                  <Textarea
                    id="welcomeMessage"
                    value={config.welcomeMessage}
                    onChange={e =>
                      handleTextChange("welcomeMessage", e.target.value)
                    }
                    placeholder="Hello! How can I help you today?"
                    rows={3}
                    disabled={lockedFields?.includes("welcomeMessage")}
                    className={
                      lockedFields?.includes("welcomeMessage")
                        ? "opacity-70"
                        : ""
                    }
                  />
                  {lockedFields?.includes("welcomeMessage") && (
                    <div className="absolute right-2 top-2 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <div className="relative">
                  <Textarea
                    id="systemPrompt"
                    value={config.systemPrompt || ""}
                    onChange={e =>
                      handleTextChange("systemPrompt", e.target.value)
                    }
                    placeholder="You are a helpful AI assistant..."
                    rows={3}
                    disabled={lockedFields?.includes("systemPrompt")}
                    className={
                      lockedFields?.includes("systemPrompt") ? "opacity-70" : ""
                    }
                  />
                  {lockedFields?.includes("systemPrompt") && (
                    <div className="absolute right-2 top-2 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeholder">Input Placeholder</Label>
                <Input
                  id="placeholder"
                  value={config.placeholder}
                  onChange={e =>
                    handleTextChange("placeholder", e.target.value)
                  }
                  placeholder="Type your message..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onAvatarUpload?.(file);
                    }
                  }}
                />
                {config.avatar && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={config.avatar}
                      alt="Avatar preview"
                      className="h-10 w-10 rounded-full object-cover border"
                      onError={e => {
                        console.error("Failed to load avatar:", config.avatar);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="text-xs text-muted-foreground break-all">
                      {config.avatar}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}
