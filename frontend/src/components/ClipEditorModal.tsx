"use client";
import React, { useState } from "react";
import { X, Play, Download, Calendar, Smartphone, Square, Monitor, Sparkles, Loader2 } from "lucide-react";
import { ClipProps } from "./ClipCard";
import { API_BASE_URL } from "@/lib/api";

interface ClipEditorModalProps {
  clip: ClipProps | null;
  onClose: () => void;
  onSave?: (updated: any) => void;
}

export const ClipEditorModal: React.FC<ClipEditorModalProps> = ({ clip, onClose, onSave }) => {
  if (!clip) return null;

  const [aspect, setAspect] = useState(clip.aspect_ratio || "9:16");
  const [hook, setHook] = useState(clip.hook_sentence);
  const [captionStyle, setCaptionStyle] = useState("karaoke_cyan_glow");
  const [exporting, setExporting] = useState(false);
  const [exportRes, setExportRes] = useState<"1080p" | "720p" | "480p">("1080p");

  const handleExport = async () => {
    // First save the edited data
    if (onSave) onSave({ aspect, hook, captionStyle });

    setExporting(true);
    try {
      // Try to export via the backend API
      const token = localStorage.getItem("clipser_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/export/${clip.id}?resolution=${exportRes}&format=mp4`, {
        headers,
      });

      if (res.ok) {
        // Download the file
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, "_")}_${exportRes}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Fallback: open the demo video directly
        if (clip.video_url) {
          window.open(clip.video_url, "_blank");
        } else {
          alert("Export not available — clip file not found on disk. This clip uses sample video.");
        }
      }
    } catch (err) {
      // Fallback: open the video URL
      if (clip.video_url) {
        window.open(clip.video_url, "_blank");
      }
    }
    setExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f0f15] border border-gray-800 shadow-2xl p-6 flex flex-col md:flex-row gap-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white bg-black/40 z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Video Preview column */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-center bg-[#08080a] rounded-xl p-3 border border-gray-800/80">
          <div className="relative aspect-[9/16] w-full max-w-[260px] rounded-xl overflow-hidden bg-black shadow-2xl">
            <img src={clip.thumbnail_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"} alt={clip.title} className="w-full h-full object-cover" />
            {/* Virality badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{clip.virality_score}</span>
            </div>
            {/* Hook preview overlay */}
            <div className="absolute top-12 inset-x-3 text-center">
              <h4 className="font-extrabold text-sm uppercase text-white leading-tight drop-shadow-lg">
                {(hook || "").split(/\r?\n|\\n/).map((line, i) => (
                  <span key={i} className={i % 2 === 1 ? "text-cyan-400 block" : "block"}>{line}</span>
                ))}
              </h4>
            </div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="flex-1 space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Virality Score: {clip.virality_score}/100</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">{clip.title}</h2>
            <p className="text-xs text-gray-400 mt-1">{clip.virality_explanation || "High curiosity hook with active retention hooks."}</p>
          </div>

          {/* Hook text editor */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Attention Hook Text Overlay</label>
            <textarea
              rows={2}
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#08080a] border border-gray-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          {/* Aspect Ratio Reframe selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Smart Reframe Format</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "9:16", icon: Smartphone, label: "9:16 Shorts/Reels" },
                { id: "1:1", icon: Square, label: "1:1 Square" },
                { id: "16:9", icon: Monitor, label: "16:9 Landscape" },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setAspect(fmt.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    aspect === fmt.id ? "bg-blue-600/10 border-blue-500 text-blue-400" : "bg-[#08080a] border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <fmt.icon className="w-4 h-4 mb-1" />
                  <span>{fmt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Animated Caption Style</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: "karaoke_cyan_glow", name: "Neon Cyan Glow" },
                { id: "hormozi_yellow", name: "Bold Yellow" },
                { id: "minimal_white", name: "Clean Minimal" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setCaptionStyle(style.id)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    captionStyle === style.id ? "bg-cyan-500/10 border-cyan-400 text-cyan-300" : "bg-[#08080a] border-gray-800 text-gray-400"
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Export Resolution */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Export Resolution</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(["1080p", "720p", "480p"] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => setExportRes(res)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    exportRes === res ? "bg-blue-500/10 border-blue-400 text-blue-300" : "bg-[#08080a] border-gray-800 text-gray-400"
                  }`}
                >
                  {res} {res === "1080p" && "HD"}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white">
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <span>Export {exportRes} Clip</span>
                  <Download className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
