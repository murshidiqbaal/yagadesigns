import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      letterSpacing: {
        'cinematic': '0.25em',
        'editorial': '0.05em',
        'elegant': '0.15em',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0B0B0B",
        foreground: "#F5F5F5",
        primary: {
          DEFAULT: "#D4AF37",
          foreground: "#0B0B0B",
        },
        secondary: {
          DEFAULT: "#1A1A1A",
          foreground: "#F5F5F5",
        },
        royal: {
          black: "#0B0B0B",
          charcoal: "#1A1A1A",
          gold: "#D4AF37",
          white: "#F5F5F5",
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
          DEFAULT: "#D4AF37",
          foreground: "#0B0B0B",
        },
        popover: {
          DEFAULT: "#0B0B0B",
          foreground: "#F5F5F5",
        },
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#F5F5F5",
        },
        gold: {
          DEFAULT: "#D4AF37",
          glow: "rgba(212, 175, 55, 0.5)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "image-reveal": {
          "0%": { clipPath: "inset(100% 0 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" },
        },
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(10px)", opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        "scale-in": "scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "image-reveal": "image-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards",
        "ken-burns": "ken-burns 20s linear infinite alternate",
        "scroll-hint": "scroll-hint 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
