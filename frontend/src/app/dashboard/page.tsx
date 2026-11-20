"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Play, Clock, ArrowRight, Video } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then((r) => r.json())
      .then((data) => setProjects(data))
      .catch(() => {
        // Fallback demo project
        setProjects([
          {
            id: "QILfShrb7StRrlPEQqpoy",
            title: "Sam Altman On AI Revolution, Superintelligence & Future Of Humanity | FO583 Raj Shamani",
            duration_formatted: "68:01",
            status: "ready",
            current_step: "17 clips generated · top score 94",
            thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
          },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Your Video Projects</h1>
          <p className="text-xs text-gray-400 mt-1">High-retention viral clips ready for TikTok, Instagram Reels, and Shorts</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <Link
            key={proj.id}
            href={`/dashboard/projects/${proj.id}`}
            className="group rounded-2xl bg-[#0f0f15] border border-gray-800 hover:border-blue-500/40 p-4 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 block"
          >
            <div className="relative aspect-video rounded-xl bg-black overflow-hidden mb-3.5">
              <img src={proj.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{proj.duration_formatted}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
              {proj.title}
            </h3>

            <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold">{proj.current_step}</span>
              <div className="flex items-center gap-1 text-gray-400 group-hover:text-white font-medium">
                <span>View Clips</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
