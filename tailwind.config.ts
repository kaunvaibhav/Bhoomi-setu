import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#1F3864",
          "navy-deep": "#0B1F3A",
          "navy-light": "#2A4A8A",
          saffron: "#FF9933",
          "saffron-light": "#FFB366",
          green: "#138808",
          "green-light": "#19AA0A",
          "bg-light": "#EAF0F8",
          "bg-success": "#EAF7EE",
          "bg-warning": "#FFF7E8",
          "bg-danger": "#FFF1F1",
          "bg-info": "#EBF5FF",
          text: "#333333",
          "text-muted": "#6B7280",
          border: "#E5E7EB",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "8xl": "1280px",
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(31,56,100,0.08)",
        "card-md": "0 2px 12px 0 rgba(31,56,100,0.10)",
        "card-lg": "0 4px 24px 0 rgba(31,56,100,0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
