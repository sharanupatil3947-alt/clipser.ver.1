"use client";
import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Video, Scissors, Wand2, Calendar, Share2, Database, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08080a]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open-Source ScaleReach Alternative · Zero Subscription Fees</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Turn Long Videos Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Viral Short Clips</span> in Seconds
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
            AI-powered transcription, smart face-tracking 16:9 to 9:16 reframing, animated karaoke captions, virality scoring, multi-platform social scheduling, and seamless CRM integrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 transition-all hover:scale-105"
            >
              <span>Explore Clips Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/crm"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] border border-gray-800 text-gray-300 hover:text-white font-semibold text-sm transition-all"
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span>CRM Integrations</span>
            </Link>
          </div>

          {/* Value Props Bar */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            {[
              { icon: ShieldCheck, title: "100% Free Forever", desc: "No subscriptions or limits" },
              { icon: Wand2, title: "Smart Speaker Reframing", desc: "Keeps speaker centered" },
              { icon: Scissors, title: "AI Virality Scoring", desc: "Finds high-retention hooks" },
              { icon: Calendar, title: "Multi-Platform Scheduler", desc: "Auto-post to TikTok, Reels, Shorts" },
            ].map((feature, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0f0f15] border border-gray-800/60">
                <feature.icon className="w-5 h-5 text-blue-400 mb-2" />
                <h4 className="font-bold text-sm text-white">{feature.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live ScaleReach Demo Preview Section */}
      <section className="py-16 px-4 bg-[#0a0a0e] border-y border-gray-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Featured Demo</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Sam Altman On AI Revolution, Superintelligence & Future Of Humanity
              </h2>
              <p className="text-sm text-gray-400 mt-1">17 clips automatically extracted from a 68:01 podcast · Top virality score 94</p>
            </div>
            <Link
              href="/dashboard/projects/QILfShrb7StRrlPEQqpoy"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 text-xs font-semibold transition-all self-start md:self-auto"
            >
              <span>View All 17 Clips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                score: 94,
                hook: "THE COMPOUNDING\nCAREER SECRET",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                duration: "0:35"
              },
              {
                score: 92,
                hook: "WHY YOU SHOULD\nIGNORE ADVICE",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                duration: "0:41"
              },
              {
                score: 90,
                hook: "WHY NOBODY BELIEVED\nCHATGPT",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
                duration: "0:41"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative aspect-[9/16] rounded-2xl bg-[#111116] border border-[#22222d] overflow-hidden group">
                <img src={item.image} alt={item.hook} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{item.score}</span>
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-[11px] font-medium text-gray-300">
                  {item.duration}
                </div>
                <div className="absolute top-12 inset-x-4 text-center">
                  <h4 className="font-extrabold text-sm uppercase text-white leading-tight drop-shadow-md">
                    {item.hook.split("\\n").map((line, lidx) => (
                      <span key={lidx} className={lidx === 1 ? "text-cyan-400 block" : "block"}>{line}</span>
                    ))}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>Clipser · High-Performance Standalone Open-Source Video Repurposing Platform</p>
      </footer>
    </div>
  );
}
