import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fine-Tuning Jobs UI",
  description: "Next.js app for creating and tracking fine-tuning jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
