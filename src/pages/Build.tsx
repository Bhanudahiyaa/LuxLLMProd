import { Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Templates } from "@/components/build/Templates";
import { AgentSettings } from "@/components/build/AgentSettings";
import { EmbedGenerator } from "@/components/build/EmbedGenerator";
import { Analytics } from "@/components/build/Analytics";
import { MyAgents } from "@/components/build/MyAgents";
import { Integrations } from "@/components/build/Integrations";
import Navigation from "@/components/Navigation";

export default function Build() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AppSidebar />

      {/* Main Content */}
      <div className="md:ml-48">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="md:hidden">
              {/* Mobile menu trigger is handled by AppSidebar */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/build/templates" replace />}
            />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<AgentSettings />} />
            <Route path="/embed" element={<EmbedGenerator />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/agents" element={<MyAgents />} />
            <Route path="/integrations" element={<Integrations />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
