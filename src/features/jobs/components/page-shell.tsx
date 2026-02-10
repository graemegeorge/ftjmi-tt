import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageShell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <main
      className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6", className)}
    >
      {children}
    </main>
  );
}
