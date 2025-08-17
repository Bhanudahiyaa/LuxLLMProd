import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { themePresets, type ThemePreset } from "@/lib/themes"

interface ThemeSelectorProps {
  currentTheme: string
  onThemeSelect: (theme: ThemePreset) => void
}

export function ThemeSelector({ currentTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Theme Presets</h3>
        <p className="text-sm text-muted-foreground">Choose from our curated theme collection</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {themePresets.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`relative p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                currentTheme === theme.id ? "ring-2 ring-primary ring-offset-2 bg-primary/5" : "hover:bg-accent/50"
              }`}
              onClick={() => onThemeSelect(theme)}
            >
              {/* Theme Preview */}
              <div className={`w-full h-16 rounded-lg mb-3 ${theme.preview} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white/80"
                      style={{ backgroundColor: theme.config.primaryColor }}
                    />
                    <div className="flex-1 h-2 bg-white/60 rounded-full" />
                  </div>
                </div>
                {currentTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{theme.name}</h4>
                  {theme.id === "dark" && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
              </div>

              {/* Color Palette Preview */}
              <div className="flex gap-1 mt-3">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.config.primaryColor }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.config.accentColor }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.config.backgroundColor }}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full bg-transparent" size="sm">
          Create Custom Theme
        </Button>
      </div>
    </div>
  )
}
