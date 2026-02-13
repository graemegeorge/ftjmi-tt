"use client";

import { Laptop, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop }
] as const;

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-60">
      <div className="pointer-events-auto inline-flex items-center gap-1 rounded-chip border bg-card/90 p-1 shadow-floating backdrop-blur">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = preference === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-label={`Switch theme to ${option.label.toLowerCase()}`}
              aria-pressed={isActive}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-chip transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
              onClick={() => setPreference(option.value)}
              title={option.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
