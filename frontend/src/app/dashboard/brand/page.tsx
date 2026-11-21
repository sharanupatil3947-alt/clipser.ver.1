'use client';
import { useState, useEffect } from 'react';
import { Palette, Upload, Save, Check } from 'lucide-react';

const FONTS = ['Arial', 'Impact', 'Georgia', 'Helvetica', 'Roboto', 'Montserrat', 'Oswald'];
const CAPTION_STYLES = [
  { id: 'karaoke_cyan_glow', label: 'Karaoke Cyan Glow', preview: 'bg-cyan-400' },
  { id: 'bold_white', label: 'Bold White', preview: 'bg-white' },
  { id: 'minimal', label: 'Minimal', preview: 'bg-gray-300' },
  { id: 'neon', label: 'Neon Green', preview: 'bg-green-400' },
  { id: 'shadow', label: 'Shadow Gold', preview: 'bg-yellow-400' },
];

export default function BrandKitPage() {
  const [kit, setKit] = useState({
    name: 'Default',
    primary_color: '#00FFFF',
    accent_color: '#FF00FF',
    font_family: 'Arial',
    logo_path: null as string | null,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('clipser_token');
    fetch('http://localhost:8000/api/v1/brand', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setKit(data))
      .catch(() => {});
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('clipser_token');
    const form = new FormData();
    form.append('name', kit.name);
    form.append('primary_color', kit.primary_color);
    form.append('accent_color', kit.accent_color);
    form.append('font_family', kit.font_family);
    if (logoFile) form.append('logo', logoFile);

    try {
      await fetch('http://localhost:8000/api/v1/brand', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Palette className="text-cyan-400" size={28} />
        <h1 className="text-2xl font-bold text-white">Brand Kit</h1>
      </div>

      <div className="space-y-6">
        {/* Kit Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Kit Name</label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            value={kit.name}
            onChange={e => setKit({ ...kit, name: e.target.value })}
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Logo / Watermark</label>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <img src={logoPreview} alt="logo preview" className="w-16 h-16 object-contain rounded-lg bg-white/10 p-1" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                <Upload size={20} className="text-gray-500" />
              </div>
            )}
            <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition">
              Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={kit.primary_color}
                onChange={e => setKit({ ...kit, primary_color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-white font-mono text-sm">{kit.primary_color}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={kit.accent_color}
                onChange={e => setKit({ ...kit, accent_color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-white font-mono text-sm">{kit.accent_color}</span>
            </div>
          </div>
        </div>

        {/* Font */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Caption Font</label>
          <div className="grid grid-cols-3 gap-2">
            {FONTS.map(font => (
              <button
                key={font}
                onClick={() => setKit({ ...kit, font_family: font })}
                className={`py-2 px-3 rounded-lg text-sm transition ${
                  kit.font_family === font
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Caption Style Preview */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Caption Style</label>
          <div className="space-y-2">
            {CAPTION_STYLES.map(style => (
              <div
                key={style.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className={`w-4 h-4 rounded-full ${style.preview}`} />
                <span className="text-white text-sm">{style.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Caption style is selected per-clip in the editor.</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          {saved ? <><Check size={18} /> Saved!</> : loading ? 'Saving...' : <><Save size={18} /> Save Brand Kit</>}
        </button>
      </div>
    </div>
  );
}
