import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0, 0, 0, 0.26)",
        glow: "0 0 42px rgba(34, 197, 94, 0.18)",
      },
    },
  },
  plugins: [forms],
};

export default config;
