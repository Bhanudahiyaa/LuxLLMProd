import React from "react";
import {
  Zap,
  Sparkles,
  Bot,
  BookOpen,
  ArrowUpCircle,
  HelpCircle,
  Info,
  Wrench,
  Eye,
  Settings,
  Code2,
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) => {
  const sidebarSections = [
    {
      label: "Build",
      items: [
        {
          id: "templates",
          label: "Templates",
          icon: <Sparkles className="w-4 h-4" />,
        },
        {
          id: "builder-playground",
          label: "Builder Playground",
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          id: "live-agent-preview",
          label: "Live Agent Preview",
          icon: <Eye className="w-4 h-4" />,
        },
        {
          id: "agent-settings",
          label: "Agent Settings",
          icon: <Settings className="w-4 h-4" />,
        },
        {
          id: "embed-generator",
          label: "Embed Generator",
          icon: <Code2 className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "Manage",
      items: [
        {
          id: "my-agents",
          label: "My Agents",
          icon: <Bot className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "Help",
      items: [
        {
          id: "how-it-works",
          label: "How it Works",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          id: "quick-start-guide",
          label: "Quick Start Guide",
          icon: <Wrench className="w-4 h-4" />,
        },
        {
          id: "support",
          label: "Support",
          icon: <HelpCircle className="w-4 h-4" />,
        },
        {
          id: "about-luxllm",
          label: "About LuxLLM",
          icon: <Info className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 bg-background min-h-screen flex flex-col justify-between ${
          sidebarOpen ? "w-56" : "w-14"
        } shadow-sm`}
      >
        {/* Sidebar content - clicking outside nav buttons toggles sidebar */}
        <div
          onClick={e => {
            const target = e.target as HTMLElement;
            if (!target.closest("button[data-nav-button]")) {
              setSidebarOpen(prev => !prev);
            }
          }}
          className="flex flex-col flex-1 pt-16 px-1 overflow-y-auto"
        >
          <nav className="space-y-4">
            {sidebarSections.map(section => (
              <div key={section.label}>
                {sidebarOpen && (
                  <div className="px-2 text-[10px] text-muted-foreground tracking-wide font-medium mb-1">
                    {section.label}
                  </div>
                )}
                <div className="space-y-2">
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      data-nav-button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm font-thin ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      } ${sidebarOpen ? "justify-start" : "justify-center"}`}
                      title={sidebarOpen ? undefined : item.label}
                    >
                      {item.icon}
                      {sidebarOpen && <span>{item.label}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Credits Box at Bottom */}
          <div
            className={`px-3 py-3 border-t mt-6 border-border/20 ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex  items-center justify-between ">
              <span className="text-sm text-muted-foreground font-thin">
                Credits
              </span>
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div className=" text-sm font-thin text-foreground">1,247</div>
            <div className="text-[10px] text-sm text-muted-foreground font-thin">
              Available
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
