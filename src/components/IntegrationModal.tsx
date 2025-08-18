import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Integration } from "@/lib/integrations";

interface IntegrationModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IntegrationModal({
  integration,
  isOpen,
  onClose,
}: IntegrationModalProps) {
  if (!integration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border border-border">
        <DialogHeader className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
            {(() => {
              const logoDomainMap: Record<string, string> = {
                wordpress: "wordpress.com",
                shopify: "shopify.com",
                wix: "wix.com",
                squarespace: "squarespace.com",
                godaddy: "godaddy.com",
                "google-sites": "google.com",
                joomla: "joomla.org",
                drupal: "drupal.org",
                bigcommerce: "bigcommerce.com",
                weebly: "weebly.com",
                unbounce: "unbounce.com",
                framer: "framer.com",
                duda: "duda.co",
                ghost: "ghost.org",
                blogger: "blogger.com",
                tumblr: "tumblr.com",
                yola: "yola.com",
                cargo: "cargo.site",
                piwigo: "piwigo.org",
                livejournal: "livejournal.com",
                jigsy: "jigsy.com",
                "im-creator": "imcreator.com",
              };
              const domain = logoDomainMap[integration.id];
              const url = domain ? `https://logo.clearbit.com/${domain}` : "";
              return url ? (
                <img
                  src={url}
                  alt={`${integration.name} logo`}
                  className="w-7 h-7 object-contain"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.textContent = integration.icon || "";
                  }}
                />
              ) : (
                <span className="text-xl">{integration.icon}</span>
              );
            })()}
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {integration.name} Integration
            </DialogTitle>
            <p className="text-muted-foreground mt-1">
              {integration.description}
            </p>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-3">
              Setup Instructions
            </h3>
            <div className="space-y-3">
              {integration.instructions.map((instruction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {instruction}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Integration Complete!</span>
            </div>
            <p className="text-green-600/80 text-sm mt-1">
              Your chatbot should now be visible on your {integration.name}{" "}
              site.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <Button onClick={onClose} variant="outline" className="gap-2">
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
