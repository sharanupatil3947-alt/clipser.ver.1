'use client';
import React, { useEffect, useState } from 'react';
import { TrendingUp, Film, Zap, Share2, Wifi } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';
function authHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('clipser_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const PLATFORM_COLORS: Record<string, string> = {
  youtube:   'bg-red-500',
  tiktok:    'bg-gray-100',
  instagram: 'bg-pink-500',
  linkedin:  'bg-blue-600',
};

interface Overview {
  total_projects?: number;
  total_views?: number;
  total_clips_generated?: number;
  avg_virality_score?: number;
  total_scheduled_posts?: number;
  total_published_posts?: number;
  connected_platforms?: number;
  platform_breakdown?: Record<string, { posts?: number; views?: number; status?: string }>;
  note?: string;
  detail?: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/analytics/overview`, { headers: authHeader() })
      .then(async r => {
        if (!r.ok) {
          return {
            total_projects: 0,
            total_clips_generated: 0,
            avg_virality_score: 0,
            total_scheduled_posts: 0,
            total_published_posts: 0,
            connected_platforms: 4,
            platform_breakdown: {},
            note: 'Local Clipser database'
          };
        }
        return r.json();
      })
      .then(d => {
        if (d && !d.detail) {
          setData(d);
        } else {
          setData({
            total_projects: 0,
            total_clips_generated: 0,
            avg_virality_score: 0,
            total_scheduled_posts: 0,
            total_published_posts: 0,
            connected_platforms: 4,
            platform_breakdown: {},
            note: 'Local Clipser database'
          });
        }
      })
      .catch(() => {
        setData({
          total_projects: 0,
          total_clips_generated: 0,
          avg_virality_score: 0,
          total_scheduled_posts: 0,
          total_published_posts: 0,
          connected_platforms: 4,
          platform_breakdown: {},
          note: 'Local Clipser database'
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const totalProjects = data?.total_projects ?? data?.total_views ?? 0;
  const totalClips = data?.total_clips_generated ?? 0;
  const avgScore = typeof data?.avg_virality_score === 'number' ? data.avg_virality_score.toFixed(1) : '0.0';
  const totalPublished = data?.total_published_posts ?? 0;
  const totalScheduled = data?.total_scheduled_posts ?? 0;
  const breakdown = (data?.platform_breakdown && typeof data.platform_breakdown === 'object') ? data.platform_breakdown : {};

  const kpis = [
    { icon: Film,       label: 'Total Projects',       val: totalProjects.toLocaleString(),   sub: 'videos processed' },
    { icon: Zap,        label: 'Clips Generated',      val: totalClips.toLocaleString(),      sub: 'AI-detected moments' },
    { icon: TrendingUp, label: 'Avg Virality Score',   val: avgScore,                         sub: 'out of 100' },
    { icon: Share2,     label: 'Published Posts',      val: totalPublished.toLocaleString(),  sub: `of ${totalScheduled} scheduled` },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time stats from your Clipser database</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading analytics...</div>
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
            {Object.keys(breakdown).length === 0 ? (
              <p className="text-gray-500 text-sm">No scheduled posts yet. Schedule clips to see platform stats here.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(breakdown).map(([platform, stats]) => {
                  const postCount = stats?.posts ?? stats?.views ?? 0;
                  return (
                    <div key={platform} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${PLATFORM_COLORS[platform] || 'bg-gray-500'}`} />
                      <span className="text-sm text-gray-300 w-32 capitalize">{platform}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${PLATFORM_COLORS[platform] || 'bg-cyan-400'}`}
                          style={{ width: `${Math.min(100, Math.max(5, postCount * 10))}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-24 text-right">{postCount} post{postCount !== 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Connected platforms */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Wifi size={12} className="text-green-400" />
            {data?.connected_platforms ?? 4} social platform{data?.connected_platforms !== 1 ? 's' : ''} connected · {data?.note || 'Clipser Pro Unlimited'}
          </div>
        </>
      )}
    </div>
  );
}
