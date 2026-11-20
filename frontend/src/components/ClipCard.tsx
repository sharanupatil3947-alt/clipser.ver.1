"use client";
import React, { useState } from "react";
import { Play, Share2, Calendar, Download, Bookmark, Sparkles, Check } from "lucide-react";

export interface ClipProps {
  id: string;
  title: string;
  hook_sentence: string;
  virality_score: number;
  virality_explanation?: string;
  duration: number;
  video_url?: string;
  thumbnail_url?: string;
  aspect_ratio?: string;
  onSelect?: () => void;
  onSchedule?: () => void;
}

export const ClipCard: React.FC<ClipProps> = ({
  id,
  title,
  hook_sentence,
  virality_score,
  virality_explanation,
  duration,
  video_url,
  thumbnail_url,
  onSelect,
  onSchedule,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/dashboard/clips/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onSelect}
      className="group relative flex flex-col rounded-2xl bg-[#0f0f14] border border-[#1d1d26] hover:border-blue-500/40 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* 9:16 Aspect Ratio container matching ScaleReach screenshot */}
      <div className="relative aspect-[9/16] w-full bg-[#08080a] overflow-hidden">
        {/* Thumbnail or Video Element */}
        {isPlaying && video_url ? (
          <video
            src={video_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={thumbnail_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Top Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Virality Score Badge (Exact ScaleReach Style: Green Dot + Score) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{virality_score}</span>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-medium text-gray-300">
          0:{Math.round(duration)}
        </div>

        {/* Center Hook Text Overlay - The Signature Viral Subtitle Look */}
        <div className="absolute top-12 inset-x-4 z-10 text-center">
          <h3 className="font-extrabold text-sm md:text-base leading-snug tracking-wider text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {hook_sentence.split("\n").map((line, i) => (
              <span key={i} className={i % 2 === 1 ? "text-cyan-400 block" : "block"}>
                {line}
              </span>
            ))}
          </h3>
        </div>

        {/* Play Button hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
          >
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </button>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f0f14] via-[#0f0f14]/60 to-transparent pointer-events-none" />
      </div>

      {/* Card Footer with Quick Controls */}
      <div className="p-3.5 bg-[#0f0f14] border-t border-[#1a1a24] flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-1">
          <button
            onClick={onSchedule}
            title="Schedule to TikTok / Reels / Shorts"
            className="p-1.5 rounded-lg hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            title="Share clip"
            className="p-1.5 rounded-lg hover:text-gray-200 hover:bg-white/5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (video_url) window.open(video_url, "_blank");
          }}
          className="flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-white px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
