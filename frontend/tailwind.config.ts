import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef8f1",
          100: "#d8eddd",
          500: "#2f7d45",
          700: "#205c34",
          900: "#153a25"
        },
        earth: {
          100: "#f2eadc",
          500: "#9a7043",
          700: "#6c4d2f"
        },
        gold: {
          400: "#d5a84f",
          500: "#bd8f34"
        }
      },
      boxShadow: {
        panel: "0 18px 60px rgba(18, 34, 25, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
