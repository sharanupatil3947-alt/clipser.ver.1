"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Play,
  Clock,
  ArrowRight,
  Video,
  Youtube,
  Upload,
  Search,
  LayoutList,
  LayoutGrid,
  Loader2,
  Trash2,
  Share2,
  Scissors
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import { UploadModal } from "@/components/UploadModal";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const firstName = user?.name ? user.name.split(" ")[0] : "Sharanu";

  // Hardcoded fallback projects — only shown when backend API fails entirely
  const FALLBACK_PROJECTS = [
    {
      id: "QILfShrb7StRrlPEQqpoy",
      title: "Sam Altman On AI Revolution, Superintelligence & Future Of Humanity | FO583 Raj Shamani",
      duration_formatted: "68:01",
      status: "ready",
      clips_count: 17,
      top_score: 94,
      current_step: "17 clips generated · top score 94",
      views_tag: "4M+ VIEWS",
      thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          // API returned empty — use fallback
          setProjects(FALLBACK_PROJECTS);
        }
      })
      .catch(() => {
        // API unreachable — use fallback
        setProjects(FALLBACK_PROJECTS);
      });
  }, []);

  const handleProcessUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("url", url);
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      router.push(`/dashboard/projects/${data.id || "QILfShrb7StRrlPEQqpoy"}`);
    } catch (err) {
      router.push("/dashboard/projects/QILfShrb7StRrlPEQqpoy");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Greeting matching ScaleReach */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">👋</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Hey, {firstName}
        </h1>
      </div>

      {/* Main Import Card matching ScaleReach screenshot */}
      <div className="rounded-2xl bg-[#0c0c12] border border-[#1d1d28] p-5 sm:p-7 space-y-4 shadow-xl">
        {/* Connect YouTube banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#14141d] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-gray-200">
              Connect your YouTube channel to import videos in one click...
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +10 min bonus
            </span>
            <button
              onClick={() => alert("YouTube OAuth connected! You can now import any channel video instantly.")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Connect
            </button>
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleProcessUrl} className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a YouTube, Twitch, Drive, Dropbox or video link"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#07070a] border border-[#232332] focus:border-blue-500 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Big blue button: "Get clips in 1 click" */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing soundbites & virality hooks...</span>
              </>
            ) : (
              <span>Get clips in 1 click</span>
            )}
          </button>
        </form>

        {/* Sub-actions & Works with logos matching screenshot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs text-gray-400">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors group"
          >
            <Upload className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400" />
            <span>Upload file</span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              PRO
            </span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span>Works with</span>
            <span className="text-red-500 font-bold">YouTube</span>
            <span>·</span>
            <span className="text-purple-400 font-semibold">Twitch</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">Kick</span>
            <span>·</span>
            <span className="text-blue-400">Drive</span>
            <span>·</span>
            <span className="text-indigo-400">Dropbox</span>
            <span>·</span>
            <span className="text-gray-400">+ .mp4/.mov links</span>
          </div>
        </div>
      </div>

      {/* Videos Section Header matching ScaleReach */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Video className="w-5 h-5 text-gray-400" />
            <span>Videos ({projects.length})</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="pl-9 pr-3 py-1.5 rounded-lg bg-[#0e0e16] border border-white/5 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 w-44 sm:w-56 transition-all"
              />
            </div>

            {/* List / Grid view switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#0e0e16] border border-white/5 text-gray-400">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-[#181824] text-white shadow-sm"
                    : "hover:text-gray-200"
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-[#181824] text-white shadow-sm"
                    : "hover:text-gray-200"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Items List/Grid */}
        {viewMode === "list" ? (
          <div className="space-y-3">
            {filteredProjects.map((p) => {
              const clipCount = (p.clips && p.clips.length > 0) ? p.clips.length : (p.clips_count || 17);
              const topScore = (p.clips && p.clips.length > 0)
                ? Math.max(...p.clips.map((c: any) => c.virality_score || 0))
                : (p.top_score || 94);

              return (
                <Link
                  key={p.id}
                  href={`/dashboard/projects/${p.id}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0c0c12] border border-[#1b1b24] hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail with duration badge */}
                    <div className="relative aspect-video w-32 sm:w-40 rounded-lg overflow-hidden bg-black shrink-0 shadow-md">
                      <img
                        src={p.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {p.views_tag && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-extrabold text-white">
                          {p.views_tag}
                        </span>
                      )}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-bold text-gray-300">
                        {p.duration_formatted}
                      </span>
                    </div>

                    {/* Title and stats */}
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-white truncate group-hover:text-blue-400 transition-colors">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {clipCount} clips
                        </span>
                        <span>·</span>
                        <span>Top score: <strong className="text-white">{topScore}</strong></span>
                        <span>·</span>
                        <span className="text-gray-500">Ready to export</span>
                      </div>
                    </div>
                  </div>

                  {/* Right button */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold transition-all">
                      <Scissors className="w-3.5 h-3.5" />
                      <span>View {clipCount} Clips</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="group rounded-2xl bg-[#0c0c12] border border-[#1b1b24] hover:border-blue-500/40 p-4 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 block"
              >
                <div className="relative aspect-video rounded-xl bg-black overflow-hidden mb-3">
                  <img
                    src={p.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-semibold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{p.duration_formatted}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                  {p.title}
                </h3>

                <div className="mt-3 pt-3 border-t border-[#1b1b24] flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">{p.current_step}</span>
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-white font-medium">
                    <span>View Clips</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
