import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Somboth - Luxury Wedding & Event Planning Suite",
  description: "Modern Khmer & International Wedding Management System by Somboth. Manage guests, budgets, gift envelopes, and digital templates seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col khmer-pattern-bg text-slate-900 selection:bg-[#D4AF37]/30 selection:text-[#580509]">
        {children}
      </body>
    </html>
  );
}
