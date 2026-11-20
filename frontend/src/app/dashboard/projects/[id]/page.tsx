"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ArrowRight, Sparkles, Filter, SlidersHorizontal } from "lucide-react";
import { ClipCard, ClipProps } from "@/components/ClipCard";
import { ClipEditorModal } from "@/components/ClipEditorModal";
import { API_BASE_URL } from "@/lib/api";

export default function ProjectClipsPage() {
  const params = useParams();
  const projectId = params?.id as string || "QILfShrb7StRrlPEQqpoy";

  const [project, setProject] = useState<any>({
    title: "Sam Altman On AI Revolution, Superintelligence & Future Of Humanity | FO583 Raj Shamani",
    duration_formatted: "68:01",
    clips_count: 17,
    top_score: 94,
    thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
  });

  const [clips, setClips] = useState<ClipProps[]>([
    {
      id: "clip_secret_01",
      title: "THE COMPOUNDING CAREER SECRET",
      hook_sentence: "THE COMPOUNDING\nCAREER SECRET",
      virality_score: 94,
      virality_explanation: "Curiosity hook with immediate retention lock. Addresses high-ambition audience psychology.",
      duration: 35.0,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "clip_advice_02",
      title: "WHY YOU SHOULD IGNORE ADVICE",
      hook_sentence: "WHY YOU SHOULD\nIGNORE ADVICE",
      virality_score: 92,
      virality_explanation: "Provocative contrarian statement. Ignites comment section debates and shares.",
      duration: 41.0,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "clip_chatgpt_03",
      title: "WHY NOBODY BELIEVED CHATGPT",
      hook_sentence: "WHY NOBODY BELIEVED\nCHATGPT",
      virality_score: 90,
      virality_explanation: "Dramatic underdog struggle paired with tech giant founder narrative.",
      duration: 41.0,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "clip_super_04",
      title: "THE FUTURE OF SUPERINTELLIGENCE",
      hook_sentence: "WHAT HAPPENS IN 2028?",
      virality_score: 88,
      duration: 38.0,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "clip_growth_05",
      title: "HOW TO SCALE FROM 0 TO 100M",
      hook_sentence: "THE 3 PHASES OF\nHYPERGROWTH",
      virality_score: 85,
      duration: 45.0,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "clip_habit_06",
      title: "DAILY ROUTINE OF TOP 1%",
      hook_sentence: "THE NON-NEGOTIABLE\nMORNING RULE",
      virality_score: 84,
      duration: 32.0,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    }
  ]);

  const [selectedClip, setSelectedClip] = useState<ClipProps | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects/${projectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.title) setProject(data);
        if (data.clips && data.clips.length > 0) setClips(data.clips);
      })
      .catch((e) => console.log("Using seeded replica clips"));
  }, [projectId]);

  return (
    <div className="space-y-8 pb-16">
      {/* Back to all demos navigation */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to all demos</span>
        </Link>
      </div>

      {/* Main Video Hero Header - Exactly as seen in ScaleReach */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 bg-[#0f0f15] border border-gray-800/80 rounded-2xl p-6 sm:p-8">
        {/* Source Video Thumbnail with 4M+ Views Tag */}
        <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden bg-black shrink-0 shadow-2xl">
          <img
            src={project.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-white">
            4M+ VIEWS
          </div>
        </div>

        {/* Video Title & Call to Action */}
        <div className="space-y-4 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            17 clips from a {project.duration_formatted || "68:01"} video · top score <span className="text-white font-bold">94</span>
          </p>

          <div>
            <Link
              href="/dashboard/schedule"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-black font-semibold text-xs transition-all shadow-md hover:scale-105"
            >
              <span>Get clips like these, free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Generated Viral Clips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Generated Viral Shorts ({clips.length})</h2>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-semibold text-white">Sorted by:</span>
            <span>Virality Score (High to Low)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {clips.map((c) => (
            <ClipCard
              key={c.id}
              {...c}
              onSelect={() => setSelectedClip(c)}
              onSchedule={() => {
                window.location.href = "/dashboard/schedule";
              }}
            />
          ))}
        </div>
      </div>

      {/* Detailed Clip Editor / Aspect Ratio / Subtitles Modal */}
      <ClipEditorModal
        clip={selectedClip}
        onClose={() => setSelectedClip(null)}
        onSave={(data) => {
          if (selectedClip) {
            setClips((prev) =>
              prev.map((c) =>
                c.id === selectedClip.id ? { ...c, hook_sentence: data.hook, aspect_ratio: data.aspect } : c
              )
            );
          }
        }}
      />
    </div>
  );
}
