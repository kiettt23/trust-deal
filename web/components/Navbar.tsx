"use client";

import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { ShieldCheck, BarChart3, Users, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { CreateDealModal } from "./CreateDealModal";
import { Badge } from "./ui/badge";

// Network badge configuration
const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
const networkConfig = {
  testnet: {
    label: "Testnet",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  devnet: {
    label: "Devnet",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  mainnet: {
    label: "Mainnet",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
} as const;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/deals", label: "Giao Dịch", icon: Users },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md z-50">
      <div className="container mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo + Network Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-linear-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-100 hidden sm:inline">
              Trust<span className="text-blue-500">Deal</span>
            </span>
          </Link>
          {/* Network Badge - hiển thị testnet/devnet/mainnet */}
          <Badge
            className={`text-[10px] px-1.5 py-0.5 font-medium ${
              networkConfig[NETWORK as keyof typeof networkConfig]?.color ||
              networkConfig.testnet.color
            }`}
          >
            {networkConfig[NETWORK as keyof typeof networkConfig]?.label ||
              "Testnet"}
          </Badge>
        </div>

        {/* Desktop Nav - Centered - Only show on large screens */}
        <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:block">
            <CreateDealModal variant="desktop" />
          </div>

          <div id="wallet-btn-wrapper" className="shrink-0">
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-300" />
            ) : (
              <Menu className="h-5 w-5 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-slate-50 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 mt-2">
            <CreateDealModal variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
}
