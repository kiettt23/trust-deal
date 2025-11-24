"use client";

import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { PlusCircle, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-linear-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-100">
            Trust<span className="text-blue-500">Deal</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Menu Actions */}
          {/* Nút Tạo Deal Mới (Responsive Version) */}
          <Link href="/">
            <Button
              variant="outline" // Có viền
              size="sm"
              className="
                gap-2 h-10 
                bg-slate-900 border-slate-700 text-slate-300 
                hover:bg-slate-800 hover:text-white hover:border-slate-600
                transition-all duration-200
                px-3 sm:px-4 // Padding nhỏ trên mobile, rộng hơn trên desktop
              "
            >
              <PlusCircle className="h-4 w-4" />

              {/* [FIX] Ẩn chữ trên mobile (màn hình < 640px), hiện trên desktop */}
              <span className="hidden sm:inline font-medium">Tạo Deal Mới</span>
            </Button>
          </Link>
          <div id="wallet-btn-wrapper" className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
