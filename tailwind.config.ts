import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#f0f5fe',
          100: '#e0eafc',
          200: '#c1d5fa',
          300: '#9bbaf6',
          400: '#6895f0',
          500: '#4178e9',
          600: '#2b64e4',
          700: '#1e4bc0',
          800: '#1b3d99',
          900: '#1a3576',
          950: '#122452',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
