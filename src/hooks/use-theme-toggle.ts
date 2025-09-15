"use client";

import { useTheme } from "@/providers/theme-provider";

export function useThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      // If system, default to dark
      setTheme("dark");
    }
  };

  return {
    theme,
    toggleTheme,
    setTheme,
  };
} 