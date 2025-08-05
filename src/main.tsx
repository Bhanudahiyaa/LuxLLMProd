import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

import App from "./App";
import "./index.css";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;

function ThemedClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const socialBtnClasses = isDark
    ? "h-9 text-sm rounded-md border bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80"
    : "h-9 text-sm rounded-md border bg-white border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-neutral-50";
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorBackground: "hsl(var(--card))",
          colorText: "hsl(var(--foreground))",
          colorPrimary: "hsl(var(--primary))",
          colorInputBackground: "hsl(var(--muted))",
          colorInputText: "hsl(var(--foreground))",
          borderRadius: "0.5rem",
          fontSize: "14px",
        },
        elements: {
          // Compact card
          card: "p-4 shadow-lg space-y-3", // reduced padding & vertical spacing

          // Header
          header: "space-y-1", // reduce gap between title & subtitle
          headerTitle: "text-base font-semibold", // smaller title
          headerSubtitle: "text-xs text-muted-foreground", // smaller subtitle

          // Social buttons row
          socialButtonsBlockButton: socialBtnClasses + " h-8 text-xs",
          socialButtonsProviderButton: socialBtnClasses + " h-8 text-xs",
          socialButtonsIcon: isDark ? "opacity-90" : "opacity-100",

          // Divider
          dividerRow: isDark
            ? "text-[hsl(var(--muted-foreground))] my-2"
            : "text-neutral-500 my-2",
          dividerLine: isDark ? "bg-[hsl(var(--border))]" : "bg-neutral-200",

          // Form fields
          formFieldLabel: "text-xs mb-0.5",
          formFieldInput:
            "h-8 text-xs px-2 border border-border rounded-md focus:ring-2 focus:ring-primary/50",

          // Submit button
          formButtonPrimary: "h-8 text-xs px-3 rounded-md",

          // Footer (Sign in / Sign up link)
          footer: "pt-2 text-xs",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemedClerkProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemedClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
);
