import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
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
      fontFamily: {
        bengali: ["Noto Serif Bengali", "serif"],
        english: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        folder: {
          primary: "hsl(var(--folder-primary))",
          secondary: "hsl(var(--folder-secondary))",
          accent: "hsl(var(--folder-accent))",
          glow: "hsl(var(--folder-glow))",
          popup: "hsl(var(--folder-popup))",
        },
        neon: {
          blue: "hsl(var(--neon-blue))",
          purple: "hsl(var(--neon-purple))",
          pink: "hsl(var(--neon-pink))",
          green: "hsl(var(--neon-green))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        folder:
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        popup:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(139, 92, 246, 0.3)",
        neon: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "folder-open": {
          "0%": {
            transform: "scale(0.8) translateY(20px)",
            opacity: "0",
            filter: "blur(10px)",
          },
          "50%": {
            transform: "scale(1.05) translateY(-10px)",
            opacity: "0.8",
            filter: "blur(2px)",
          },
          "100%": {
            transform: "scale(1) translateY(0)",
            opacity: "1",
            filter: "blur(0px)",
          },
        },
        "folder-close": {
          "0%": {
            transform: "scale(1) translateY(0)",
            opacity: "1",
            filter: "blur(0px)",
          },
          "50%": {
            transform: "scale(1.05) translateY(-10px)",
            opacity: "0.8",
            filter: "blur(2px)",
          },
          "100%": {
            transform: "scale(0.8) translateY(20px)",
            opacity: "0",
            filter: "blur(10px)",
          },
        },
        "expand-fullscreen": {
          "0%": {
            transform: "scale(0.3) translate(-50%, -50%)",
            opacity: "0.8",
            borderRadius: "20px",
          },
          "100%": {
            transform: "scale(1) translate(0, 0)",
            opacity: "1",
            borderRadius: "0px",
          },
        },
        "popup-enter": {
          "0%": {
            transform: "scale(0.5) translateY(50px)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1) translateY(0)",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "folder-open": "folder-open 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "folder-close":
          "folder-close 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "expand-fullscreen":
          "expand-fullscreen 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "popup-enter": "popup-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        float: "float 3s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
