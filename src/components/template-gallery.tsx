"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Play, Save, MoreVertical, Trash2, Copy, Plus } from "lucide-react"
import { getTemplates, saveTemplate, deleteTemplate, getDefaultTemplates, type ChatbotTemplate } from "@/lib/templates"

interface TemplateGalleryProps {
  currentConfig: ChatbotTemplate["config"]
  onTemplateLoad: (template: ChatbotTemplate) => void
  onSaveTemplate: () => void
}

export function TemplateGallery({ currentConfig, onTemplateLoad, onSaveTemplate }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<ChatbotTemplate[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")

  useEffect(() => {
    const userTemplates = getTemplates()
    const defaultTemplates = getDefaultTemplates()
    setTemplates([...defaultTemplates, ...userTemplates])
  }, [])

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return

    const newTemplate = saveTemplate({
      name: templateName,
      description: templateDescription,
      config: currentConfig,
    })

    setTemplates((prev) => [...prev, newTemplate])
    setShowSaveDialog(false)
    setTemplateName("")
    setTemplateDescription("")
    onSaveTemplate()
  }

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id)
    setTemplates((prev) => prev.filter((t) => t.id !== id))
  }

  const handleDuplicateTemplate = (template: ChatbotTemplate) => {
    const duplicated = saveTemplate({
      name: `${template.name} (Copy)`,
      description: template.description,
      config: template.config,
    })
    setTemplates((prev) => [...prev, duplicated])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Template Gallery</h3>
          <p className="text-sm text-muted-foreground">Save and manage your chatbot configurations</p>
        </div>
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Template</DialogTitle>
              <DialogDescription>Save your current chatbot configuration as a reusable template.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="My Awesome Chatbot"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description (Optional)</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Describe what makes this template special..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      {template.id.startsWith("default-") && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    {template.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onTemplateLoad(template)}>
                        <Play className="w-4 h-4 mr-2" />
                        Load Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {!template.id.startsWith("default-") && (
                        <DropdownMenuItem
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Template Preview */}
                <div className="mb-3">
                  <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg relative overflow-hidden">
                    <div className="absolute bottom-2 right-2">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/80 flex items-center justify-center text-xs text-white font-medium"
                        style={{ backgroundColor: template.config.primaryColor }}
                      >
                        AI
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-12">
                      <div className="bg-white/80 backdrop-blur-sm rounded px-2 py-1">
                        <div className="text-xs text-gray-600 truncate">{template.config.welcomeMessage}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Theme: {template.config.theme}</span>
                  <span>{template.config.fontFamily}</span>
                </div>

                {/* Color Palette */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: template.config.primaryColor }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: template.config.accentColor }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: template.config.backgroundColor }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{template.config.borderRadius}px radius</span>
                </div>

                <Button onClick={() => onTemplateLoad(template)} className="w-full" size="sm" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Load Template
                </Button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first template by customizing your chatbot and saving it.
          </p>
          <Button onClick={() => setShowSaveDialog(true)}>
            <Save className="w-4 h-4 mr-2" />
            Save Your First Template
          </Button>
        </div>
      )}
    </div>
  )
}
