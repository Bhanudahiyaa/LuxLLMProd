import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <SignIn
        path="/sign-in"
        routing="path"
        redirectUrl="/create"
        appearance={{
          elements: {
            card: "shadow-lg border border-border bg-card text-foreground",
            formButtonPrimary:
              "bg-primary text-primary-foreground hover:bg-primary/90",
          },
          variables: {
            colorPrimary: "hsl(var(--primary))",
            colorBackground: "hsl(var(--background))",
            colorText: "hsl(var(--foreground))",
            colorInputBackground: "hsl(var(--input))",
            colorInputText: "hsl(var(--foreground))",
            colorInputBorder: "hsl(var(--border))",
            colorAlphaShade: "hsl(var(--muted))",
          },
        }}
      />
    </div>
  );
}
