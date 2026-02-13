import type { Metadata } from "next";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

import { ThemeScript } from "@/components/theme/theme-script";
import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fine-Tuning Jobs",
  description: "Manage fine-tuning jobs and run new training flows"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans">
        <AppProviders>
          {children}
          <Toaster offset="3.75rem" richColors position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}
