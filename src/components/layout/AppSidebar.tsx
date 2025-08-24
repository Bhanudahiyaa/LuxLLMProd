import { useState } from "react";
import {
  Wand2,
  Settings,
  Code,
  BarChart3,
  Bot,
  Plug,
  HelpCircle,
  Play,
  Phone,
  Info,
  Menu,
  X,
  Zap,
  MessageSquare,
  Users,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const buildItems = [
  { title: "Templates", url: "/build/templates", icon: Wand2 },
  { title: "Premium", url: "/build/premium", icon: Bot },
];

const manageItems = [
  { title: "My Agents", url: "/build/agents", icon: Bot },
  { title: "Customize", url: "/build/templates", icon: Settings },
  { title: "Export", url: "/export", icon: Code },
];

const helpItems = [
  { title: "How it Works", url: "/build/how-it-works", icon: HelpCircle },
  { title: "Quick Start", url: "/build/quick-start", icon: Play },
  { title: "Pricing", url: "/build/pricing", icon: Zap },
  { title: "Blogs", url: "/build/blogs", icon: MessageSquare },
  { title: "Team", url: "/build/team", icon: Users },
  { title: "Support", url: "/build/support", icon: Phone },
  { title: "About", url: "/build/about", icon: Info },
];

interface SidebarContentProps {
  className?: string;
  onNavigate?: () => void;
}

function SidebarContent({ className, onNavigate }: SidebarContentProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = (path: string) =>
    cn(
      "w-full h-7 text-sm font-thin transition-all flex items-center justify-start px-3",
      "hover:bg-secondary/100 hover:text-foreground",
      isActive(path) ? "text-primary" : "text-muted-foreground"
    );

  const handleNavClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <div
      className={cn("flex h-full w-full flex-col bg-card md:w-44", className)}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-start">
        <h2 className="text-3xl font-thin bg-gradient-primary bg-clip-text text-transparent mb-3">
          LuxLLM
        </h2>
      </div>

      <ScrollArea className="flex-1 px-1">
        {/* Build Section */}
        <div className="pb-2">
          <h3 className="mb-2 px-3 text-xs font-thin text-muted-foreground uppercase tracking-wider">
            Build
          </h3>
          <div className="space-y-1">
            {buildItems.map(item => (
              <Button
                key={item.url}
                variant="ghost"
                className={getNavClassName(item.url)}
                asChild
              >
                <NavLink
                  to={item.url}
                  onClick={handleNavClick}
                  className="flex items-center w-full"
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span>{item.title}</span>
                </NavLink>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mx-3 mb-4" />

        {/* Manage Section */}
        <div className="pb-4">
          <h3 className="mb-2 px-3 text-xs font-thin text-muted-foreground uppercase tracking-wider">
            Manage
          </h3>
          <div className="space-y-1">
            {manageItems.map(item => (
              <Button
                key={item.url}
                variant="ghost"
                className={getNavClassName(item.url)}
                asChild
              >
                <NavLink
                  to={item.url}
                  onClick={handleNavClick}
                  className="flex items-center w-full"
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span>{item.title}</span>
                </NavLink>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mx-3 mb-4" />

        {/* Help Section */}
        <div className="pb-4">
          <h3 className="mb-2 px-3 text-xs font-thin text-muted-foreground uppercase tracking-wider">
            Help
          </h3>
          <div className="space-y-1">
            {helpItems.map(item => (
              <Button
                key={item.url}
                variant="ghost"
                className={getNavClassName(item.url)}
                asChild
              >
                <NavLink
                  to={item.url}
                  onClick={handleNavClick}
                  className="flex items-center w-full"
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span>{item.title}</span>
                </NavLink>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            size="sm"
            className="fixed top-3 left-3 z-50 md:hidden bg-transparent p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className=" md:flex md:w-44 md:flex-col md:fixed md:inset-y-0 md:border-r md:border-border">
        <SidebarContent />
      </div>
    </>
  );
}
