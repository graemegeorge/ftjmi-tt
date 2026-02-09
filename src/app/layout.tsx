import type { Metadata } from "next";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fine-Tuning Jobs",
  description: "Manage fine-tuning jobs and run new training flows"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppProviders>
          {children}
          <Toaster richColors position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}
