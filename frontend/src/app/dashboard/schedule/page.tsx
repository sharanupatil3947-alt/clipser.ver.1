'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Trash2, Zap, Send, ChevronDown } from 'lucide-react';

interface SocialAccount { id: number; platform: string; account_name: string; status: string; }
interface ScheduledPost { id: number; clip_id: string; platform: string; scheduled_time: string; caption: string; hashtags: string; status: string; published_post_url?: string; }
interface ClipOption { id: string; title: string; virality_score: number; }

const PLATFORM_META: Record<string, { label: string; color: string; bg: string }> = {
  youtube:   { label: 'YouTube Shorts', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  tiktok:    { label: 'TikTok',         color: 'text-white',      bg: 'bg-white/10 border-white/20' },
  instagram: { label: 'Instagram Reels',color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20' },
  linkedin:  { label: 'LinkedIn',       color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
};

const STATUS_STYLES: Record<string, string> = {
  scheduled:            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  publishing:           'bg-blue-500/10 text-blue-400 border-blue-500/20',
  published:            'bg-green-500/10 text-green-400 border-green-500/20',
  simulated_published:  'bg-green-500/10 text-green-400 border-green-500/20',
  failed:               'bg-red-500/10 text-red-400 border-red-500/20',
};

const API = 'http://localhost:8000/api/v1';
function authHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('clipser_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function SchedulePage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [clips, setClips] = useState<ClipOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ clip_id: '', platform: 'youtube', scheduled_time: '', caption: '', hashtags: '#viral #shorts #clipser #ai' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadClips() {
    try {
      // Fetch clips from all projects
      const projRes = await fetch(`${API}/projects`, { headers: authHeader() });
      if (projRes.ok) {
        const projects = await projRes.json();
        const allClips: ClipOption[] = [];
        for (const proj of (Array.isArray(projects) ? projects : [])) {
          try {
            const projDetailRes = await fetch(`${API}/projects/${proj.id}`, { headers: authHeader() });
            if (projDetailRes.ok) {
              const detail = await projDetailRes.json();
              if (detail.clips && Array.isArray(detail.clips)) {
                for (const c of detail.clips) {
                  allClips.push({ id: c.id, title: c.title, virality_score: c.virality_score || 0 });
                }
              }
            }
          } catch {}
        }
        // Also add well-known demo clips if not already present
        const knownIds = new Set(allClips.map(c => c.id));
        const demoClips: ClipOption[] = [
          { id: 'clip_secret_01', title: 'THE COMPOUNDING CAREER SECRET', virality_score: 94 },
          { id: 'clip_advice_02', title: 'WHY YOU SHOULD IGNORE ADVICE', virality_score: 92 },
          { id: 'clip_chatgpt_03', title: 'WHY NOBODY BELIEVED CHATGPT', virality_score: 90 },
        ];
        for (const dc of demoClips) {
          if (!knownIds.has(dc.id)) allClips.push(dc);
        }
        setClips(allClips);
        if (allClips.length > 0 && !form.clip_id) {
          setForm(f => ({ ...f, clip_id: allClips[0].id }));
        }
      }
    } catch {}
  }

  async function load() {
    setLoading(true);
    try {
      const [acc, ps] = await Promise.all([
        fetch(`${API}/schedule/accounts`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${API}/schedule/posts`,    { headers: authHeader() }).then(r => r.json()),
      ]);
      setAccounts(Array.isArray(acc) ? acc : []);
      setPosts(Array.isArray(ps) ? ps : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); loadClips(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/schedule/posts`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, scheduled_time: new Date(form.scheduled_time).toISOString() }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Failed'); }
      setShowModal(false);
      setForm(f => ({ ...f, scheduled_time: '', caption: '' }));
      load();
    } catch (err: any) { setError(err.message); }
    setSubmitting(false);
  }

  async function publishNow(postId: number) {
    await fetch(`${API}/schedule/posts/${postId}/publish-now`, { method: 'POST', headers: authHeader() });
    load();
  }

  async function deletePost(postId: number) {
    await fetch(`${API}/schedule/posts/${postId}`, { method: 'DELETE', headers: authHeader() });
    load();
  }

  // Auto-fill caption when clip changes
  const handleClipChange = (clipId: string) => {
    setForm(f => ({ ...f, clip_id: clipId }));
    const clip = clips.find(c => c.id === clipId);
    if (clip && !form.caption) {
      setForm(f => ({ ...f, clip_id: clipId, caption: clip.title }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Social Media Scheduler</h1>
          <p className="text-xs text-gray-400 mt-1">Auto-publish to YouTube Shorts, TikTok, Instagram Reels, and LinkedIn</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/20"
        >
          <Calendar size={16} /> Schedule Clip
        </button>
      </div>

      {/* Connected Platforms */}
      <div className="p-4 rounded-xl bg-[#0f0f15] border border-gray-800">
        <p className="text-xs font-semibold text-gray-400 mb-3">Connected Platforms</p>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <span className="text-xs text-gray-500">Loading...</span>
          ) : accounts.length === 0 ? (
            <span className="text-xs text-gray-500">No platforms connected</span>
          ) : accounts.map(acc => {
            const meta = PLATFORM_META[acc.platform];
            return (
              <span key={acc.id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${meta?.bg || 'bg-white/5 border-white/10'} ${meta?.color || 'text-gray-300'}`}>
                <CheckCircle2 size={12} className="text-green-400" />
                {meta?.label || acc.platform} · {acc.account_name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Scheduled Posts Queue */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-300">Scheduled Queue ({posts.length})</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500 text-sm">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-gray-700">
            <Calendar className="mx-auto text-gray-600 mb-2" size={32} />
            <p className="text-gray-400 text-sm">No posts scheduled yet.</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-blue-400 text-xs hover:underline">Schedule your first clip →</button>
          </div>
        ) : posts.map(post => {
          const meta = PLATFORM_META[post.platform];
          const statusCls = STATUS_STYLES[post.status] || 'bg-gray-700 text-gray-300';
          return (
            <div key={post.id} className="p-4 rounded-xl bg-[#0f0f15] border border-gray-800 flex items-center justify-between gap-4 hover:border-gray-700 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`px-2 py-1 rounded-lg text-xs font-bold border shrink-0 ${meta?.bg || 'bg-white/5 border-white/10'} ${meta?.color || 'text-gray-300'}`}>
                  {meta?.label || post.platform}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{post.caption || post.clip_id}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <Clock size={11} />
                    {new Date(post.scheduled_time).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${statusCls}`}>{post.status.replace('_', ' ')}</span>
                {post.published_post_url && (
                  <a href={post.published_post_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">View</a>
                )}
                {post.status === 'scheduled' && (
                  <button onClick={() => publishNow(post.id)} title="Publish now" className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-400 transition">
                    <Send size={14} />
                  </button>
                )}
                <button onClick={() => deletePost(post.id)} title="Remove" className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white">Schedule a Clip</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Select Clip</label>
                {clips.length > 0 ? (
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400 appearance-none"
                    value={form.clip_id}
                    onChange={e => handleClipChange(e.target.value)}
                  >
                    {clips.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title} (Score: {c.virality_score})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    placeholder="e.g. clip_secret_01"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                    value={form.clip_id}
                    onChange={e => setForm(f => ({ ...f, clip_id: e.target.value }))}
                  />
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Platform</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  value={form.platform}
                  onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                >
                  {Object.entries(PLATFORM_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  value={form.scheduled_time}
                  onChange={e => setForm(f => ({ ...f, scheduled_time: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Caption</label>
                <input
                  placeholder="Your hook caption..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  value={form.caption}
                  onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Hashtags</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  value={form.hashtags}
                  onChange={e => setForm(f => ({ ...f, hashtags: e.target.value }))}
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2">
                  <Zap size={14} /> {submitting ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
