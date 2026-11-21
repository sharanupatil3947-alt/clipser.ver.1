"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { UploadModal } from "@/components/UploadModal";
import {
  Menu,
  Clock,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Plus
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Dynamic breadcrumb
  let pageTitle = "Videos";
  if (pathname.includes("/schedule")) pageTitle = "Scheduler";
  else if (pathname.includes("/analytics")) pageTitle = "Analytics";
  else if (pathname.includes("/brand")) pageTitle = "Brand Kit";
  else if (pathname.includes("/templates")) pageTitle = "Templates";
  else if (pathname.includes("/projects/")) pageTitle = "Clips";

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 flex flex-row">
      {/* Sidebar matching ScaleReach */}
      {sidebarOpen && <Sidebar videoCount={4} />}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Breadcrumbs & Status Bar matching ScaleReach */}
        <header className="h-14 border-b border-[#14141c] px-4 sm:px-6 flex items-center justify-between bg-[#070709]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#121218] border border-white/5 transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400">
              <Link href="/dashboard" className="hover:text-gray-200 transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <span className="font-semibold text-white">{pageTitle}</span>
            </nav>
          </div>

          {/* Right Status Actions matching ScaleReach screenshot */}
          <div className="flex items-center gap-3">
            {/* Minutes pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121218] border border-white/5 text-xs font-semibold text-gray-300">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Unlimited min</span>
            </div>

            {/* Pro Upgrade / Active Badge Button */}
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Video</span>
            </button>

            {/* Pro Free Indicator */}
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PRO UNLIMITED
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Reusable Upload Modal */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />

      {/* ScaleReach-style Floating Chat Support Bubble in bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => alert("Clipser AI Assistant is ready! All Pro features are unlocked and running locally.")}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 transition-transform cursor-pointer"
          title="Clipser AI Support"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
