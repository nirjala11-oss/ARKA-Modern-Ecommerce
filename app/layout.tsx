import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARKA // The Luxury Department Store of India",
  description: "Curated collection of premier consumer electronics, designer fashion, luxury timepieces, fragrances, and home living. Express Pan-India delivery with GST invoicing.",
  keywords: ["luxury ecommerce India", "department store", "electronics", "designer fashion", "smartphones", "watches", "UPI shopping"],
  openGraph: {
    title: "ARKA // The Luxury Department Store of India",
    description: "Curated premier electronics, fine living, and designer essentials across India.",
    type: "website",
  }
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
      <body className="min-h-full flex flex-col bg-[#fbfaf8] text-[#111315] selection:bg-[#143e2e] selection:text-white">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
