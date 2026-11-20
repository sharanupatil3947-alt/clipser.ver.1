"use client";
import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus, Sparkles, Share2 } from "lucide-react";

export default function SchedulePage() {
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      clipTitle: "THE COMPOUNDING CAREER SECRET",
      platform: "TikTok",
      time: "Today at 6:30 PM",
      status: "Ready to Auto-Publish",
      score: 94
    },
    {
      id: 2,
      clipTitle: "WHY YOU SHOULD IGNORE ADVICE",
      platform: "Instagram Reels",
      time: "Tomorrow at 11:00 AM",
      status: "Scheduled",
      score: 92
    },
    {
      id: 3,
      clipTitle: "WHY NOBODY BELIEVED CHATGPT",
      platform: "YouTube Shorts",
      time: "Friday at 5:00 PM",
      status: "Scheduled",
      score: 90
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Social Media Scheduler</h1>
          <p className="text-xs text-gray-400 mt-1">Multi-platform auto-posting to TikTok, Instagram Reels, and YouTube Shorts</p>
        </div>
      </div>

      {/* Connected Accounts Bar */}
      <div className="p-4 rounded-xl bg-[#0f0f15] border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-400">Connected Platforms:</span>
          <div className="flex items-center gap-2">
            {["TikTok", "Instagram", "YouTube", "LinkedIn"].map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{p}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scheduled Queue List */}
      <div className="space-y-3">
        {scheduledPosts.map((post) => (
          <div key={post.id} className="p-4 rounded-xl bg-[#0f0f15] border border-gray-800 flex items-center justify-between gap-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                {post.score}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{post.clipTitle}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span className="text-indigo-400 font-semibold">{post.platform}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.time}</span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {post.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
