"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Youtube, UploadCloud, Sparkles, Loader2, FileVideo } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !selectedFile) return;
    setLoading(true);
    setProgressStep("Initializing Clipser AI pipeline...");

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
        formData.append("title", selectedFile.name.replace(/\.[^/.]+$/, ""));
        setProgressStep("Uploading video file...");
      } else {
        formData.append("url", url);
        setProgressStep("Downloading video from URL...");
      }

      const token = localStorage.getItem("clipser_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      onClose();
      router.push(`/dashboard/projects/${data.id || "QILfShrb7StRrlPEQqpoy"}`);
    } catch (err) {
      onClose();
      router.push("/dashboard/projects/QILfShrb7StRrlPEQqpoy");
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (file: File) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/x-matroska", "video/webm", "video/avi"];
    if (validTypes.includes(file.type) || file.name.match(/\.(mp4|mov|mkv|webm|avi)$/i)) {
      setSelectedFile(file);
    } else {
      alert("Please upload a video file (MP4, MOV, MKV, WebM, AVI)");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0f0f15] border border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Repurpose New Video</h2>
              <p className="text-xs text-gray-400">Extract viral shorts with speaker face-tracking and auto-captions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Form */}
        <form onSubmit={handleProcessUrl} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Paste Video URL (YouTube, Twitch, Kick, Loom, Drive)
            </label>
            <div className="relative">
              <Youtube className="w-4 h-4 text-red-500 absolute left-3.5 top-3" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08080a] border border-gray-800 focus:border-blue-500 text-sm text-white placeholder-gray-500 outline-none"
                disabled={!!selectedFile}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span className="h-px bg-gray-800 flex-1" />
            <span>OR UPLOAD FILE</span>
            <span className="h-px bg-gray-800 flex-1" />
          </div>

          {/* Real drag & drop + file input */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#0a0a0f]/50 ${
              dragActive ? 'border-blue-500 bg-blue-500/5' : selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gray-800 hover:border-blue-500/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-matroska,video/webm,.mp4,.mov,.mkv,.webm,.avi"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
            {selectedFile ? (
              <>
                <FileVideo className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-emerald-300">{selectedFile.name}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Ready to process
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="mt-2 text-[11px] text-red-400 hover:text-red-300"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-200">
                  {dragActive ? 'Drop your video here!' : 'Click or drop MP4, MOV, or MKV file here'}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">Up to 4 hours long · 1080p / 4K supported</p>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (!url && !selectedFile)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{progressStep}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Viral Clips (Free Pro)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
