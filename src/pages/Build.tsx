import { Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Templates } from "@/components/build/Templates";
import { AgentSettings } from "@/components/build/AgentSettings";
import { MyAgents } from "@/components/build/MyAgents";
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
            <Route
              path="/premium"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Premium Features</h1>
                  <p className="text-muted-foreground">
                    Premium features coming soon!
                  </p>
                </div>
              }
            />
            <Route path="/settings" element={<AgentSettings />} />
            <Route path="/agents" element={<MyAgents />} />
            <Route
              path="/export"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Export</h1>
                  <p className="text-muted-foreground">
                    Export functionality coming soon!
                  </p>
                </div>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">How it Works</h1>
                  <p className="text-muted-foreground">
                    Learn how to use our platform!
                  </p>
                </div>
              }
            />
            <Route
              path="/quick-start"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Quick Start</h1>
                  <p className="text-muted-foreground">
                    Get started quickly with our platform!
                  </p>
                </div>
              }
            />
            <Route
              path="/pricing"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Pricing</h1>
                  <p className="text-muted-foreground">
                    View our pricing plans!
                  </p>
                </div>
              }
            />
            <Route
              path="/blogs"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Blogs</h1>
                  <p className="text-muted-foreground">
                    Read our latest blog posts!
                  </p>
                </div>
              }
            />
            <Route
              path="/team"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Team</h1>
                  <p className="text-muted-foreground">Meet our team!</p>
                </div>
              }
            />
            <Route
              path="/support"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Support</h1>
                  <p className="text-muted-foreground">Get help and support!</p>
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">About</h1>
                  <p className="text-muted-foreground">Learn more about us!</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
