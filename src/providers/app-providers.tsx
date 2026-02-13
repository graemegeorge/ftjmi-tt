"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, createStore } from "jotai";
import { useState } from "react";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  const [jotaiStore] = useState(() => createStore());

  return (
    <ThemeProvider>
      <JotaiProvider store={jotaiStore}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ThemeToggle />
        </QueryClientProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
