"use client";

import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-ink transition hover:bg-surface-sunk dark:border-darksurface-border dark:text-surface-sunk dark:hover:bg-darksurface-raised"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
