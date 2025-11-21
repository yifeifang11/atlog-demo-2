import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "./layout-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Atlog Consent Demo",
  description: "Consent capture demo flows powered by localStorage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-slate-100 text-slate-900`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
