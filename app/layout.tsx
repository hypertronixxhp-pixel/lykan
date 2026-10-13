import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { capabilityGroups } from "@/lib/services";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Lykan AI Studio — Complex products. Quietly delivered.", template: "%s | Lykan AI Studio" },
  description: "A private engineering partner: full-stack development, database and API optimization, cloud setup, AI chatbots and automation, testing, and bug fixing, with client work kept confidential.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-teal focus:p-3 focus:text-ink">Skip to content</a>
        <Header services={capabilityGroups.map(({ slug, name }) => ({ slug, name }))} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
