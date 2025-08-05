import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/auth/sign-in" replace />
      </SignedOut>
    </>
  );
}

// Optional placeholder for post-login
function AppHome() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-2xl">Welcome 👋</h1>
        <p className="opacity-80">
          You’re signed in. Build your agent UI here.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />

            {/* Clerk pages — NOTE the /* wildcards */}
            <Route
              path="/auth/sign-in/*"
              element={
                <div
                  className="flex items-center justify-center min-h-screen px-4"
                  style={{ background: "var(--gradient-background)" }}
                >
                  <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-md">
                    <SignIn
                      routing="path"
                      path="/auth/sign-in"
                      signUpUrl="/auth/sign-up"
                      redirectUrl="/app"
                      appearance={{
                        elements: {
                          card: "bg-transparent shadow-none border-0",
                          headerTitle: "text-2xl font-light tracking-tight",
                          headerSubtitle: "text-sm opacity-80",
                          formFieldInput:
                            "bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-xl",
                          formButtonPrimary:
                            "neuro-button !bg-[--gradient-primary] !text-[hsl(var(--primary-foreground))] rounded-xl py-2",
                          socialButtonsBlockButton:
                            "rounded-xl border border-[hsl(var(--border))] hover:opacity-90",
                          footerActionText: "opacity-80",
                          footerActionLink:
                            "text-[hsl(var(--accent))] hover:opacity-90",
                        },
                        variables: {
                          colorPrimary: "hsl(var(--primary))",
                          colorBackground: "hsl(var(--card))",
                          colorText: "hsl(var(--foreground))",
                          colorInputBackground: "hsl(var(--input))",
                          colorInputText: "hsl(var(--foreground))",
                          colorInputBorder: "hsl(var(--border))",
                          colorAlphaShade: "hsl(var(--muted))",
                          borderRadius: "1rem",
                        },
                      }}
                    />
                  </div>
                </div>
              }
            />
            <Route
              path="/auth/sign-up/*"
              element={
                <div
                  className="flex items-center justify-center min-h-screen px-4"
                  style={{ background: "var(--gradient-background)" }}
                >
                  <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-md">
                    <SignUp
                      routing="path"
                      path="/auth/sign-up"
                      signInUrl="/auth/sign-in"
                      redirectUrl="/app"
                      appearance={{
                        elements: {
                          card: "bg-transparent shadow-none border-0",
                          headerTitle: "text-2xl font-light tracking-tight",
                          headerSubtitle: "text-sm opacity-80",
                          formFieldInput:
                            "bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-xl",
                          formButtonPrimary:
                            "neuro-button !bg-[--gradient-primary] !text-[hsl(var(--primary-foreground))] rounded-xl py-2",
                          socialButtonsBlockButton:
                            "rounded-xl border border-[hsl(var(--border))] hover:opacity-90",
                          footerActionText: "opacity-80",
                          footerActionLink:
                            "text-[hsl(var(--accent))] hover:opacity-90",
                        },
                        variables: {
                          colorPrimary: "hsl(var(--primary))",
                          colorBackground: "hsl(var(--card))",
                          colorText: "hsl(var(--foreground))",
                          colorInputBackground: "hsl(var(--input))",
                          colorInputText: "hsl(var(--foreground))",
                          colorInputBorder: "hsl(var(--border))",
                          colorAlphaShade: "hsl(var(--muted))",
                          borderRadius: "1rem",
                        },
                      }}
                    />
                  </div>
                </div>
              }
            />

            {/* Post-login route */}
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppHome />
                </RequireAuth>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
