/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          50: "#EEF3F6",
          100: "#DCE7EC",
          200: "#B3C9D3",
          400: "#2C6E8E",
          600: "#1B4B66",
          700: "#153A50",
          900: "#0D2531",
        },
        signal: {
          DEFAULT: "#F2A93B",
          dark: "#C6821F",
        },
        resolved: {
          DEFAULT: "#3B8C6E",
          dark: "#2A6B53",
        },
        urgent: {
          DEFAULT: "#C1442E",
          dark: "#96331F",
        },
        ink: {
          DEFAULT: "#14232B",
          muted: "#5B6B73",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          sunk: "#F2F4F5",
          border: "#D8DEE1",
        },
        darksurface: {
          DEFAULT: "#0F1B21",
          raised: "#16262E",
          border: "#2A3B44",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        stamp: "50%",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,35,43,0.06), 0 1px 0 rgba(20,35,43,0.04)",
        raised: "0 4px 14px rgba(20,35,43,0.10)",
      },
      keyframes: {
        stampIn: {
          "0%": { transform: "scale(1.4) rotate(-8deg)", opacity: "0" },
          "60%": { transform: "scale(0.95) rotate(-8deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(-8deg)", opacity: "1" },
        },
        fadeUp: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        stampIn: "stampIn 0.35s ease-out forwards",
        fadeUp: "fadeUp 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
