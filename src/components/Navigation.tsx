"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "phosphor-react";
import ThemeToggle from "@/components/ThemeToggle";
import WrapButton from "@/components/ui/wrap-button";
import { useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const useIsDark = () => {
  const getIsDark = () => document.documentElement.classList.contains("dark");
  const [isDark, setIsDark] = useState<boolean>(() => getIsDark());

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setIsDark(getIsDark());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") onChange();
    };

    media.addEventListener?.("change", onChange);
    window.addEventListener("storage", onStorage);

    const mo = new MutationObserver(onChange);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      media.removeEventListener?.("change", onChange);
      window.removeEventListener("storage", onStorage);
      mo.disconnect();
    };
  }, []);

  return isDark;
};

const generateClerkAppearance = (isDark: boolean) => ({
  baseTheme: isDark ? dark : undefined,
  variables: {
    colorBackground: isDark ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)",
    colorText: isDark ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
    colorPrimary: "hsl(142.1 76.2% 36.3%)",
    colorInputBackground: isDark
      ? "hsl(217.2 32.6% 17.5%)"
      : "hsl(210 40% 96%)",
    colorAlphaShade: isDark ? "hsl(215 20.2% 65.1%)" : "hsl(215.4 16.3% 46.9%)",
    colorNeutral: isDark ? "hsl(217.2 32.6% 17.5%)" : "hsl(210 40% 96%)",
    colorNeutralAlpha: isDark
      ? "hsla(217.2 32.6% 17.5% 0.8)"
      : "hsla(210 40% 96% 0.8)",
    borderRadius: "0.75rem",
    colorSuccess: "hsl(142.1 76.2% 36.3%)",
    colorDanger: "hsl(0 84.2% 60.2%)",
    colorWarning: "hsl(38 92% 50%)",
    colorInfo: "hsl(199 89% 48%)",
  },
  elements: {
    avatarBox: "size-9",
    userButtonPopoverCard:
      "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] shadow-lg",
    userButtonPopoverActionButton:
      "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
    userButtonPopoverFooter: "border-t border-[hsl(var(--border))]",
    userButtonTrigger__open: "ring-2 ring-[hsl(var(--primary))]/30 rounded-xl",
    socialButtonsBlockButton:
      "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/90)] transition-all duration-200",
    socialButtonsBlockButton__github:
      "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] [&>svg]:fill-[hsl(var(--foreground))]",
    formButtonPrimary:
      "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/90)] transition-colors duration-200",
    formButtonSecondary:
      "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/90)] transition-colors duration-200",
    card: "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] shadow-sm",
    headerTitle: "text-[hsl(var(--foreground))] font-semibold",
    headerSubtitle: "text-[hsl(var(--muted-foreground))]",
    dividerLine: "bg-[hsl(var(--border))]",
    dividerText: "text-[hsl(var(--muted-foreground))]",
    formFieldLabel: "text-[hsl(var(--foreground))] font-medium",
    formFieldInput:
      "bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent",
    formFieldInputShowPasswordButton:
      "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
    formResendCodeLink:
      "text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/80)]",
    footerActionLink:
      "text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/80)]",
    identityPreviewText: "text-[hsl(var(--foreground))]",
    identityPreviewEditButton:
      "text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/80)]",
  },
});

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { openSignUp } = useClerk();
  const isDark = useIsDark();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#hero", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const scrollTo = () => {
      const el = document.querySelector(href);
      if (el) {
        // Enhanced smooth scrolling with easing
        const targetPosition = (el as HTMLElement).offsetTop - 80; // Account for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start: number | null = null;

        const animation = (currentTime: number) => {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = easeInOutCubic(
            timeElapsed,
            startPosition,
            distance,
            duration
          );
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
      }
    };
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollTo, 350);
    } else {
      scrollTo();
    }
  };

  // Smooth easing function for premium scrolling
  const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  };

  const openAuth = () =>
    openSignUp({
      afterSignUpUrl: "/build",
      afterSignInUrl: "/build",
      appearance: generateClerkAppearance(isDark),
    });

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-1 py-3 flex items-center justify-between">
          {/* ✅ Make the logo navigate home from any route */}
          <button
            onClick={() => {
              if (location.pathname !== "/") navigate("/");
              else handleNavClick("#hero");
            }}
            className="text-left"
            aria-label="Go to home"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1"
            >
              <img
                src="/images/luxllm-logo.png"
                alt="LuxLLM logo"
                className="h-7 w-7 object-contain"
              />
              <div className="font-medium text-2xl tracking-tighter">
                <span className="text-primary">Lux</span>
                <span className="text-foreground">LLM</span>
              </div>
            </motion.div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item, index) => (
              <motion.button
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-light relative group hover-lift"
              >
                {item.label}
              </motion.button>
            ))}

            {/* Right-side controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Signed-out: single CTA */}
              <SignedOut>
                <WrapButton className="opacity-85" onClick={openAuth}>
                  Try Free Demo
                </WrapButton>
              </SignedOut>

              {/* Signed-in: avatar w/ dropdown (includes Sign out) */}
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={generateClerkAppearance(isDark)}
                />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            <List size={16} weight="light" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-card/95 backdrop-blur-xl border-l border-border z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {" "}
                    <img
                      src="/images/luxllm-logo.png"
                      alt="LuxLLM logo"
                      className="h-6 w-6 object-contain"
                    />
                    <div className="font-bold text-xl tracking-tighter">
                      <span className="text-primary">Lux</span>
                      <span className="text-foreground">LLM</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} weight="light" />
                  </button>
                </div>

                <nav className="space-y-6">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNavClick(item.href)}
                      className="block w-full text-left text-foreground/80 hover:text-primary transition-all duration-300 text-lg font-light py-2 hover-lift"
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </nav>

                {/* Mobile auth controls */}
                <div className="mt-6 flex items-center justify-between">
                  <ThemeToggle />
                  <div className="flex items-center gap-3">
                    <SignedOut>
                      <WrapButton className="w-full" onClick={openAuth}>
                        Get started
                      </WrapButton>
                    </SignedOut>

                    <SignedIn>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={generateClerkAppearance(isDark)}
                      />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
