import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustDeal - Escrow Platform",
  description: "Safe P2P Transaction via Sui Blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {" "}
      {/* Force dark mode */}
      <body
        className={`${inter.className} bg-slate-950 min-h-screen antialiased selection:bg-blue-500/30`}
      >
        <Providers>
          {/* Lớp nền Grid */}
          <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />

          {/* Header cố định */}
          <Navbar />

          {/* Nội dung chính (đẩy xuống 1 chút để ko bị Header che) */}
          <main className="relative z-10 pt-24 pb-10">{children}</main>

          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
