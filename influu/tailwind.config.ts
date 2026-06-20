import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#7C3AFF",
          light: "#9F5FFF",
          dark: "#5B21B6",
        },
        pink: "#DB2777",
        success: "#10D9A0",
        warning: "#F59E0B",
        danger: "#F45B69",
        bg: {
          DEFAULT: "#07070F",
          side: "#0C0C1A",
          card: "#10101E",
          card2: "#161628",
        },
        text: {
          primary: "#F0F0FF",
          secondary: "#8B8BAA",
          muted: "#4A4A66",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          hover: "rgba(255,255,255,0.12)",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C3AFF, #DB2777)",
        "success-gradient": "linear-gradient(135deg, #10D9A0, #0BA5D3)",
        "card-brand": "linear-gradient(145deg, rgba(124,58,255,0.15), rgba(16,16,30,0.9))",
        "card-success": "linear-gradient(145deg, rgba(16,217,160,0.08), rgba(16,16,30,0.9))",
        "card-warning": "linear-gradient(145deg, rgba(245,158,11,0.1), rgba(16,16,30,0.9))",
      },
      boxShadow: {
        brand: "0 4px 20px rgba(124,58,255,0.35)",
        "brand-sm": "0 2px 12px rgba(124,58,255,0.3)",
        glow: "0 0 24px rgba(124,58,255,0.4)",
        card: "0 40px 80px rgba(0,0,0,0.6)",
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease forwards",
        pulse: "pulse 2s infinite",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
