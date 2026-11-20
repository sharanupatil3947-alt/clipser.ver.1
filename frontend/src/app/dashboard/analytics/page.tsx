"use client";
import React from "react";
import { TrendingUp, Eye, Heart, Share2, Award, Clock } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-black text-white">Viral Performance Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time metrics, viewer retention curves, and virality benchmark comparison</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: "Total Views", val: "4.28M", change: "+34.8% this week" },
          { icon: Award, label: "Average Virality", val: "92.4", change: "Top 2% of creators" },
          { icon: Clock, label: "Retention Rate", val: "88.6%", change: "+12% vs standard" },
          { icon: Share2, label: "Total Shares", val: "204K", change: "High viral velocity" },
        ].map((kpi, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#0f0f15] border border-gray-800">
            <kpi.icon className="w-5 h-5 text-blue-400 mb-2" />
            <span className="text-xs font-semibold text-gray-400">{kpi.label}</span>
            <div className="text-2xl font-black text-white mt-1">{kpi.val}</div>
            <span className="text-[11px] font-semibold text-emerald-400">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Performance Curve Chart Representation */}
      <div className="p-6 rounded-2xl bg-[#0f0f15] border border-gray-800 space-y-4">
        <h3 className="font-bold text-base text-white">7-Day Exponential View Velocity</h3>
        <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
          {[
            { day: "Mon", h: "40%", v: "420K" },
            { day: "Tue", h: "55%", v: "580K" },
            { day: "Wed", h: "70%", v: "720K" },
            { day: "Thu", h: "66%", v: "690K" },
            { day: "Fri", h: "82%", v: "850K" },
            { day: "Sat", h: "94%", v: "980K" },
            { day: "Sun", h: "100%", v: "1.04M" },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] text-gray-400 font-mono">{bar.v}</span>
              <div
                style={{ height: bar.h }}
                className="w-full max-w-[45px] rounded-t-lg bg-gradient-to-t from-blue-700 to-cyan-400 hover:brightness-110 transition-all cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-400">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
