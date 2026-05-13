import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#020617",
        },
        surface: {
          DEFAULT: "#0f172a",
        },
        elevated: {
          DEFAULT: "#1e293b",
        },
        inset: {
          DEFAULT: "#020617",
        },
        accent: {
          DEFAULT: "#f59e0b",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        primary: {
          DEFAULT: "#f8fafc",
        },
        secondary: {
          DEFAULT: "#94a3b8",
        },
        muted: {
          DEFAULT: "#64748b",
        },
        default: {
          DEFAULT: "#334155",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
