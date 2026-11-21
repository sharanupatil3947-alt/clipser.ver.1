'use client';
import { useState, useEffect } from 'react';
import { LayoutTemplate, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  aspect_ratio: string;
  caption_style: string;
  hook_position: string;
  crop_strategy: string;
}

const ASPECT_ICONS: Record<string, string> = {
  '9:16': '📱',
  '1:1': '⬛',
  '4:5': '🖼️',
};

const STYLE_COLORS: Record<string, string> = {
  karaoke_cyan_glow: 'text-cyan-400 border-cyan-400',
  bold_white: 'text-white border-white',
  minimal: 'text-gray-300 border-gray-300',
  neon: 'text-green-400 border-green-400',
  shadow: 'text-yellow-400 border-yellow-400',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('clipser_token');
    fetch('http://localhost:8000/api/v1/templates', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setTemplates)
      .catch(() => {
        // Fallback static list if backend not running
        setTemplates([
          { id: 'podcast', name: 'Podcast', description: 'Two-speaker layout with centred crop and clean captions', aspect_ratio: '9:16', caption_style: 'bold_white', hook_position: 'top', crop_strategy: 'center' },
          { id: 'interview', name: 'Interview', description: 'Active speaker tracking with karaoke captions', aspect_ratio: '9:16', caption_style: 'karaoke_cyan_glow', hook_position: 'top', crop_strategy: 'face_track' },
          { id: 'tutorial', name: 'Tutorial', description: 'Screen-focused crop with minimal captions at the bottom', aspect_ratio: '9:16', caption_style: 'minimal', hook_position: 'bottom', crop_strategy: 'center' },
          { id: 'gaming', name: 'Gaming', description: 'High-energy neon captions with fast cuts', aspect_ratio: '9:16', caption_style: 'neon', hook_position: 'top', crop_strategy: 'center' },
          { id: 'motivational', name: 'Motivational', description: 'Speaker-centred with shadow captions and bold hooks', aspect_ratio: '9:16', caption_style: 'shadow', hook_position: 'center', crop_strategy: 'face_track' },
          { id: 'square_social', name: 'Square (1:1)', description: 'Square format for Instagram feed and LinkedIn', aspect_ratio: '1:1', caption_style: 'bold_white', hook_position: 'top', crop_strategy: 'center' },
          { id: 'portrait_feed', name: 'Portrait (4:5)', description: '4:5 portrait for Instagram feed posts', aspect_ratio: '4:5', caption_style: 'minimal', hook_position: 'top', crop_strategy: 'face_track' },
        ]);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-2">
        <LayoutTemplate className="text-cyan-400" size={28} />
        <h1 className="text-2xl font-bold text-white">Clip Templates</h1>
      </div>
      <p className="text-gray-400 mb-8">
        Choose a template when editing a clip to apply a preset crop ratio, caption style, and hook position.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`text-left p-5 rounded-2xl border transition group ${
              selected === t.id
                ? 'bg-cyan-500/10 border-cyan-400'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            {/* Aspect ratio badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{ASPECT_ICONS[t.aspect_ratio] || '🎬'}</span>
              <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                {t.aspect_ratio}
              </span>
            </div>

            <h3 className="text-white font-semibold text-lg mb-1">{t.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{t.description}</p>

            {/* Caption style badge */}
            <div className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-1 ${STYLE_COLORS[t.caption_style] || 'text-gray-400 border-gray-400'}`}>
              <Zap size={10} />
              {t.caption_style.replace(/_/g, ' ')}
            </div>

            {/* Crop strategy */}
            <div className="mt-2 text-xs text-gray-500">
              Crop: {t.crop_strategy === 'face_track' ? '🎯 Face tracking' : '⬜ Centered'}
            </div>

            {selected === t.id && (
              <div className="mt-3 text-xs text-cyan-400 font-medium">✓ Selected</div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 p-4 rounded-xl bg-cyan-500/10 border border-cyan-400 text-cyan-300 text-sm">
          Template <strong className="text-white">{templates.find(t => t.id === selected)?.name}</strong> selected.
          This will be applied when you edit a clip. Go to your project clips and open the editor to use it.
        </div>
      )}
    </div>
  );
}
