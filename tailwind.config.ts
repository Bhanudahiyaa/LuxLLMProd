import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // ✅ class-based dark mode
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "2rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        italianno: ["Italianno", "cursive"],
        italiana: ["Italiana", "sans-serif"],
        edu: ['"Edu VIC WA NT Hand"', "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // ✅ Keyframes
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px hsl(122 90% 55% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(122 90% 55% / 0.6)" },
        },
        rainbow: {
          "0%": { backgroundPosition: "0%" },
          "100%": { backgroundPosition: "200%" },
        },
        shimmer: {
          "0%, 90%, 100%": {
            backgroundPosition: "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            backgroundPosition: "calc(100% + var(--shimmer-width)) 0",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-premium": {
          from: { boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)" },
          to: { boxShadow: "0 0 30px rgba(0, 255, 0, 0.6)" },
        },
        "shimmer-premium": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },

        // ✅ NEW: animated background gradient (from snippet you shared)
        "background-gradient": {
          "0%, 100%": {
            transform: "translate(0, 0)",
            animationDelay: "var(--background-gradient-delay, 0s)",
            backgroundImage: `
      linear-gradient(
        135deg,
        rgba(6, 194, 16, 0.3), /* subtle green */
        rgba(0, 0, 0, 0),       /* fully transparent */
        rgba(6, 194, 16, 0.1)  /* subtle green again */
      )
    `,
            backgroundSize: "200% 200%",
          },
          "20%": { transform: "translate(100%, 100%)" },
          "40%": { transform: "translate(-100%, 100%)" },
          "60%": { transform: "translate(100%, -100%)" },
          "80%": { transform: "translate(-100%, -100%)" },
        },
      },

      // ✅ Animations
      animation: {
        marquee: "marquee var(--duration, 30s) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite",
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        shimmer: "shimmer 8s infinite linear",
        float: "float 6s ease-in-out infinite",
        "glow-premium": "glow-premium 2s ease-in-out infinite alternate",
        "shimmer-premium": "shimmer-premium 2s infinite",

        // ✅ NEW
        "background-gradient":
          "background-gradient var(--background-gradient-speed, 20s) ease-in-out infinite",
      },

      backdropBlur: { xs: "2px" },
      letterSpacing: { tighter: "-0.025em" },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.4, 0, 0.2, 1)",
        smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
