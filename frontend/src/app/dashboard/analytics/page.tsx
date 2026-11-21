'use client';
import React, { useEffect, useState } from 'react';
import { TrendingUp, Film, Zap, Calendar, Share2, Wifi } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';
function authHeader() { return { Authorization: `Bearer ${localStorage.getItem('clipser_token')}` }; }

const PLATFORM_COLORS: Record<string, string> = {
  youtube:   'bg-red-500',
  tiktok:    'bg-gray-100',
  instagram: 'bg-pink-500',
  linkedin:  'bg-blue-600',
};

interface Overview {
  total_projects: number;
  total_clips_generated: number;
  avg_virality_score: number;
  total_scheduled_posts: number;
  total_published_posts: number;
  connected_platforms: number;
  platform_breakdown: Record<string, { posts: number; status: string }>;
  note: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/analytics/overview`, { headers: authHeader() })
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = data
    ? [
        { icon: Film,     label: 'Total Projects',         val: data.total_projects.toLocaleString(),         sub: 'videos processed' },
        { icon: Zap,      label: 'Clips Generated',        val: data.total_clips_generated.toLocaleString(),  sub: 'AI-detected moments' },
        { icon: TrendingUp, label: 'Avg Virality Score',   val: data.avg_virality_score.toFixed(1),           sub: 'out of 100' },
        { icon: Share2,   label: 'Published Posts',        val: data.total_published_posts.toLocaleString(),  sub: `of ${data.total_scheduled_posts} scheduled` },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time stats from your Clipser database</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading analytics...</div>
      ) : !data ? (
        <div className="text-center py-16 text-gray-500">Could not load analytics. Make sure the backend is running.</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#0f0f15] border border-gray-800">
                <k.icon className="w-5 h-5 text-cyan-400 mb-2" />
                <span className="text-xs font-semibold text-gray-400">{k.label}</span>
                <div className="text-2xl font-black text-white mt-1">{k.val}</div>
                <span className="text-[11px] text-gray-500">{k.sub}</span>
              </div>
            ))}
          </div>

          {/* Platform Breakdown */}
          <div className="p-6 rounded-2xl bg-[#0f0f15] border border-gray-800">
            <h3 className="font-bold text-base text-white mb-4">Platform Breakdown</h3>
            {Object.keys(data.platform_breakdown).length === 0 ? (
              <p className="text-gray-500 text-sm">No scheduled posts yet. Schedule clips to see platform stats here.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(data.platform_breakdown).map(([platform, stats]) => (
                  <div key={platform} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${PLATFORM_COLORS[platform] || 'bg-gray-500'}`} />
                    <span className="text-sm text-gray-300 w-32 capitalize">{platform}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${PLATFORM_COLORS[platform] || 'bg-cyan-400'}`}
                        style={{ width: `${Math.min(100, stats.posts * 10)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-16 text-right">{stats.posts} posts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connected platforms */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Wifi size={12} className="text-green-400" />
            {data.connected_platforms} social platform{data.connected_platforms !== 1 ? 's' : ''} connected · {data.note}
          </div>
        </>
      )}
    </div>
  );
}
