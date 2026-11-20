"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, Bell, User as UserIcon, Plus } from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface NavbarProps {
  onOpenUpload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload }) => {
  const { user, loginWithGoogle, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#08080a]/90 backdrop-blur-md border-b border-[#1c1c24] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo matching ScaleReach */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white">Clipser</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Pro Free
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Videos
          </Link>
          <Link href="/dashboard/schedule" className="hover:text-white transition-colors">
            Scheduler
          </Link>
          <Link href="/dashboard/crm" className="hover:text-white transition-colors">
            CRM Integration
          </Link>
          <Link href="/dashboard/analytics" className="hover:text-white transition-colors">
            Analytics
          </Link>
        </div>

        {/* Right action buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Repurpose Video</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-800">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-gray-700" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="text-xs text-gray-300 max-w-[120px] truncate">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="p-1.5 rounded-md bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-gray-800 mt-3 space-y-3">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-900 rounded-lg"
          >
            Videos
          </Link>
          <Link
            href="/dashboard/schedule"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-900 rounded-lg"
          >
            Scheduler
          </Link>
          <Link
            href="/dashboard/crm"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-900 rounded-lg"
          >
            CRM Integration
          </Link>
          <Link
            href="/dashboard/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-900 rounded-lg"
          >
            Analytics
          </Link>
        </div>
      )}
    </nav>
  );
};
