export interface ThemePreset {
  id: string
  name: string
  description: string
  preview: string
  config: {
    primaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    borderRadius: number
    fontSize: number
    fontFamily: string
  }
}

export const themePresets: ThemePreset[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with blue accents",
    preview: "bg-gradient-to-br from-blue-500 to-purple-600",
    config: {
      primaryColor: "#3b82f6",
      accentColor: "#8b5cf6",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderRadius: 12,
      fontSize: 14,
      fontFamily: "Inter",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant with neutral tones",
    preview: "bg-gradient-to-br from-gray-400 to-gray-600",
    config: {
      primaryColor: "#6b7280",
      accentColor: "#9ca3af",
      backgroundColor: "#ffffff",
      textColor: "#374151",
      borderRadius: 8,
      fontSize: 14,
      fontFamily: "Inter",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional look with navy and gold accents",
    preview: "bg-gradient-to-br from-blue-900 to-amber-600",
    config: {
      primaryColor: "#1e3a8a",
      accentColor: "#d97706",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderRadius: 6,
      fontSize: 14,
      fontFamily: "Roboto",
    },
  },
  {
    id: "playful",
    name: "Playful",
    description: "Fun and vibrant with rounded corners",
    preview: "bg-gradient-to-br from-pink-500 to-orange-400",
    config: {
      primaryColor: "#ec4899",
      accentColor: "#fb923c",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderRadius: 20,
      fontSize: 15,
      fontFamily: "Poppins",
    },
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Sleek dark theme with green accents",
    preview: "bg-gradient-to-br from-gray-900 to-green-600",
    config: {
      primaryColor: "#10b981",
      accentColor: "#34d399",
      backgroundColor: "#1f2937",
      textColor: "#f9fafb",
      borderRadius: 10,
      fontSize: 14,
      fontFamily: "Inter",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm sunset colors with soft gradients",
    preview: "bg-gradient-to-br from-orange-400 to-red-500",
    config: {
      primaryColor: "#f97316",
      accentColor: "#ef4444",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderRadius: 16,
      fontSize: 14,
      fontFamily: "Poppins",
    },
  },
]

export function getThemeById(id: string): ThemePreset | undefined {
  return themePresets.find((theme) => theme.id === id)
}
