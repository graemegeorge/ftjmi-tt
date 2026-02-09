import type { Metadata } from "next";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fine-Tuning Jobs",
  description: "Manage fine-tuning jobs and run new training flows"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
