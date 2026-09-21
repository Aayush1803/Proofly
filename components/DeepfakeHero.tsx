'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, FileVideo, FileAudio, Image as ImageIcon, FileText,
  ScanLine, ShieldAlert,
} from 'lucide-react';

interface DeepfakeHeroProps {
  onSubmit: (file: File) => void;
  isLoading: boolean;
}

const ACCEPTED_TYPES =
  'image/*,audio/*,video/*,application/pdf,.heic,.heif,.avif,.mkv,.avi,.mov,.flv,.wmv,.m4a,.flac,.ogg,.opus,.aac';

export default function DeepfakeHero({ onSubmit, isLoading }: DeepfakeHeroProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) setUploadedFile(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video')) return <FileVideo className="w-6 h-6 text-purple-400" />;
    if (file.type.startsWith('audio')) return <FileAudio className="w-6 h-6 text-blue-400" />;
    if (file.type.startsWith('image')) return <ImageIcon className="w-6 h-6 text-emerald-400" />;
    return <FileText className="w-6 h-6 text-gray-400" />;
  };

  const handleSubmit = () => {
    if (isLoading || !uploadedFile) return;
    onSubmit(uploadedFile);
  };

  const isReady = uploadedFile !== null && !isLoading;

  // Forensic signal tags that rotate visually
  const SIGNALS = [
    { label: 'GAN artifact detection', color: '#EF4444' },
    { label: 'Face-swap signature scan', color: '#F59E0B' },
    { label: 'Audio-visual sync analysis', color: '#4F8EFF' },
    { label: 'Metadata forensics', color: '#22D3EE' },
    { label: 'Compression artifact analysis', color: '#7C3AED' },
    { label: 'Temporal consistency check', color: '#22C55E' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #EF4444 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', filter: 'blur(40px)' }} />
        {/* Grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(var(--glass-border) 1px, transparent 1px), linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.5,
          }} />
      </div>

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center mb-10 relative z-10"
      >
        <div className="section-label mb-6"
          style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
          <span className="live-dot" style={{ background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.65)' }} />
          Powered by Gemini Multimodal · Visual + Audio Forensics
        </div>

        <h1 className="display-font text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4">
          <span style={{ color: 'var(--text-primary)' }}>Detect the</span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 50%, #7C3AED 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>fabricated.</span>
        </h1>

        <p className="text-lg max-w-xl mx-auto mt-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Upload an image, video, or audio file.
          <br />
          <span style={{ color: 'var(--text-primary)' }} className="font-semibold">Proofly</span> runs multimodal AI forensics to surface manipulation signals.
        </p>

        {/* Disclaimer badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-xs"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#F59E0B',
          }}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          AI-assisted analysis · Not a substitute for forensic expert review
        </motion.div>
      </motion.div>

      {/* Upload card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass rounded-2xl overflow-hidden"
          style={{
            border: '1px solid var(--glass-border)',
            boxShadow: '0 0 0 1px rgba(239,68,68,0.08), 0 16px 48px rgba(0,0,0,0.4)',
          }}>

          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--bg-border)' }}>
            <div className="flex items-center gap-2">
              <ScanLine className="w-4 h-4" style={{ color: '#EF4444' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Media Forensics Scanner
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.10)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.20)' }}>
              DEEPFAKE · v1
            </span>
          </div>

          {/* Drop zone */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {uploadedFile ? (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex items-center justify-between rounded-xl p-4"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(uploadedFile)}
                    <div>
                      <p className="text-sm font-medium truncate max-w-xs" style={{ color: 'var(--text-primary)' }}>
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {uploadedFile.size > 1024 * 1024
                          ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`
                          : `${(uploadedFile.size / 1024).toFixed(0)} KB`
                        } · {uploadedFile.type || 'unknown type'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-[#4A4A60] hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="drop-zone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className="relative h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
                  style={{
                    borderColor: dragActive ? '#EF4444' : 'var(--bg-border)',
                    background: dragActive ? 'rgba(239,68,68,0.04)' : 'var(--bg-secondary)',
                  }}
                >
                  <div className="relative mb-3">
                    <Upload className="w-8 h-8 mx-auto"
                      style={{ color: dragActive ? '#EF4444' : 'var(--text-muted)' }} />
                    {dragActive && <div className="scan-line" style={{ background: 'linear-gradient(90deg, transparent, #EF4444, transparent)' }} />}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Drop media file or <span style={{ color: '#EF4444' }}>browse</span>
                  </p>
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    Images · Video · Audio · Max 20MB
                  </p>
                  <p className="text-[10px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                    JPEG · PNG · WebP · MP4 · AVI · MOV · MP3 · WAV · HEIC
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Submit */}
            <motion.button
              id="deepfake-analyze-button"
              onClick={handleSubmit}
              disabled={!isReady}
              whileHover={isReady ? { scale: 1.02 } : {}}
              whileTap={isReady ? { scale: 0.98 } : {}}
              className="mt-5 w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-300"
              style={isReady ? {
                background: 'linear-gradient(140deg, #C0392B 0%, #9B59B6 50%, #7C3AED 100%)',
                color: 'white',
                boxShadow: '0 4px 0 rgba(0,0,0,0.28), 0 8px 28px rgba(239,68,68,0.35)',
              } : {
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                border: '1px solid var(--bg-border)',
                cursor: 'not-allowed',
              }}
            >
              <ScanLine className="w-4 h-4" />
              {isLoading ? 'Analyzing media...' : 'Run Forensic Analysis'}
              {isReady && !isLoading && (
                <span className="text-xs opacity-70 font-normal">~5–15 sec</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Forensic signals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 glass rounded-2xl p-5"
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="section-label"
              style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.20)' }}>
              🔬 Forensic Signal Coverage
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIGNALS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className="frosted-badge flex items-center gap-1.5 cursor-default"
              >
                <span className="text-[10px] font-mono" style={{ color: s.color }}>●</span>
                <span className="text-[10px]">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {[
            { value: 'Images', label: 'PNG · JPEG · WebP · HEIC' },
            { value: 'Video', label: 'MP4 · AVI · MOV · MKV' },
            { value: 'Audio', label: 'MP3 · WAV · M4A · OGG' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="stat-number text-xl counter-reveal"
                style={{
                  animationDelay: `${0.5 + i * 0.12}s`,
                  background: 'linear-gradient(135deg, #EF4444 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                {stat.value}
              </div>
              <div className="text-xs mt-1 mono-font" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
