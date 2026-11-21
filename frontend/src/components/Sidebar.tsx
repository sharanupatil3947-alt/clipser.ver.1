"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Video,
  Scissors,
  Clock,
  Sparkles,
  Gift,
  Key,
  Settings,
  Keyboard,
  HelpCircle,
  AlertCircle,
  Calendar,
  Palette,
  LayoutTemplate,
  TrendingUp,
  Building2,
  ChevronsUpDown,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface SidebarProps {
  collapsed?: boolean;
  videoCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, videoCount = 4 }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName = user?.name || "Sharanu Patil";
  const displayEmail = user?.email || "sharanupatil3947@gmail.com";
  const workspaceName = `${displayName.split(" ")[0]}'s Workspace`;

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Video, badge: videoCount.toString(), active: pathname === "/dashboard" },
  ];

  const libraryItems = [
    { href: "/dashboard/projects/QILfShrb7StRrlPEQqpoy", label: "All Clips", icon: Scissors, active: pathname.includes("/projects") },
    { href: "/dashboard/schedule", label: "Scheduler", icon: Calendar, active: pathname === "/dashboard/schedule" },
    { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp, active: pathname === "/dashboard/analytics" },
    { href: "/dashboard/brand", label: "Brand Kit", icon: Palette, active: pathname === "/dashboard/brand" },
    { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate, active: pathname === "/dashboard/templates" },
  ];

  const toolItems = [
    { href: "#", label: "API Keys", icon: Key },
    { href: "#", label: "Settings", icon: Settings },
    { href: "#", label: "Shortcuts", icon: Keyboard },
    { href: "#", label: "Get Help", icon: HelpCircle },
    { href: "#", label: "Report Issue", icon: AlertCircle },
  ];

  return (
    <aside className={`w-64 bg-[#08080a] border-r border-[#15151c] flex flex-col h-screen sticky top-0 select-none z-30 transition-all ${collapsed ? "hidden md:flex" : "flex"}`}>
      {/* Workspace Header */}
      <div className="p-3 border-b border-[#15151c]/60">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#121218] cursor-pointer transition-colors group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-sm font-semibold text-white truncate leading-tight group-hover:text-blue-400 transition-colors">
                {workspaceName}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">Owner</div>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300 shrink-0" />
        </div>
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium custom-scrollbar">
        {/* Main Home link */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  item.active
                    ? "bg-[#181824] text-white font-semibold shadow-inner"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#121218]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.active ? "text-blue-500" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/40 text-gray-400 border border-white/5">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Library Section */}
        <div>
          <div className="px-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Library
          </div>
          <div className="space-y-1 mt-1">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    item.active
                      ? "bg-[#181824] text-white font-semibold"
                      : "text-gray-400 hover:text-gray-200 hover:bg-[#121218]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? "text-blue-500" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#15151c]" />

        {/* Minutes Meter Pill */}
        <div className="flex items-center justify-between px-3 py-1.5 text-gray-400">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Minutes</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Unlimited
          </span>
        </div>

        {/* Pro Card Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0e1628] to-[#12121c] border border-blue-500/20 relative overflow-hidden group">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Clipser Pro Unlimited</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                Unlimited min/month · No watermark · 4K/1080p · Auto Face-Tracking
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Links */}
        <div className="space-y-0.5 pt-1">
          <div className="flex items-center justify-between px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#121218] rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>Affiliate</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              New
            </span>
          </div>

          {toolItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#121218] rounded-lg cursor-pointer transition-colors"
              >
                <Icon className="w-4 h-4 text-gray-500" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-[#15151c] relative">
        <div
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#121218] cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-semibold text-white truncate leading-tight group-hover:text-blue-400 transition-colors">
                {displayName}
              </div>
              <div className="text-[10px] text-gray-500 truncate">{displayEmail}</div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 shrink-0" />
        </div>

        {/* Profile Popover */}
        {profileOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-[#111118] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
            <div className="px-2 py-1.5 border-b border-white/5 mb-1">
              <p className="text-xs font-bold text-white">{displayName}</p>
              <p className="text-[10px] text-gray-400">{displayEmail}</p>
              <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO UNLIMITED ACTIVE
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                setProfileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
