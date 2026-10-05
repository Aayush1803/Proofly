'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileVideo, FileAudio, Image as ImageIcon, FileText } from 'lucide-react';

interface DeepfakeHeroProps {
  onSubmit: (file: File) => void;
  isLoading: boolean;
}

const ACCEPTED_TYPES =
  'image/*,audio/*,video/*,application/pdf,.heic,.heif,.avif,.mkv,.avi,.mov,.flv,.wmv,.m4a,.flac,.ogg,.opus,.aac';

const FORENSIC_SIGNALS = [
  'GAN artifact detection',
  'Face-swap signature scan',
  'Audio-visual sync analysis',
  'Metadata forensics',
  'Compression artifact analysis',
  'Temporal consistency check',
];

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
    if (file.type.startsWith('video')) return <FileVideo className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />;
    if (file.type.startsWith('audio')) return <FileAudio className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />;
    if (file.type.startsWith('image')) return <ImageIcon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />;
    return <FileText className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />;
  };

  const handleSubmit = () => {
    if (isLoading || !uploadedFile) return;
    onSubmit(uploadedFile);
  };

  const isReady = uploadedFile !== null && !isLoading;

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 max-w-xl"
      >
        <p className="label-caps mb-4">
          Media forensics · Visual + audio analysis · Gemini multimodal
        </p>
        <h1
          className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Detect fabricated media.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Upload an image, video, or audio file. Our forensic pipeline surfaces
          manipulation signals across pixel, audio, and metadata layers.
        </p>

        {/* Disclaimer */}
        <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          AI-assisted analysis · Not a substitute for forensic expert review
        </p>
      </motion.div>

      {/* Upload workspace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Media forensics scanner
            </p>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              DEEPFAKE · v1
            </span>
          </div>

          {/* Drop zone / file preview */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {uploadedFile ? (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-md p-3.5"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  {getFileIcon(uploadedFile)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {uploadedFile.size > 1024 * 1024
                        ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`
                        : `${(uploadedFile.size / 1024).toFixed(0)} KB`
                      } · {uploadedFile.type || 'unknown type'}
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--semantic-false)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
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
                  className="h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-all"
                  style={{
                    borderColor: dragActive ? 'var(--accent)' : 'var(--border)',
                    background: dragActive ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                  }}
                >
                  <Upload className="w-6 h-6 mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Drop a file or{' '}
                    <span style={{ color: 'var(--accent)' }}>browse</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Images · Video · Audio · Max 20 MB
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
            <button
              id="deepfake-analyze-button"
              onClick={handleSubmit}
              disabled={!isReady}
              className="mt-4 w-full py-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
              style={
                isReady
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
              }
              onMouseEnter={e => {
                if (isReady) e.currentTarget.style.background = 'var(--accent-hover)';
              }}
              onMouseLeave={e => {
                if (isReady) e.currentTarget.style.background = 'var(--accent)';
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'transparent' }}
                  />
                  Analyzing media…
                </>
              ) : (
                <>
                  Run forensic analysis
                  {isReady && (
                    <span className="text-xs opacity-70 font-normal">~5–15 sec</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Forensic signals */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-lg p-5"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <p className="label-caps mb-3">Forensic signal coverage</p>
          <div className="flex flex-wrap gap-2">
            {FORENSIC_SIGNALS.map(signal => (
              <span
                key={signal}
                className="text-xs px-2.5 py-1 rounded"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                {signal}
              </span>
            ))}
          </div>

          {/* Supported formats */}
          <div
            className="mt-4 pt-4 grid grid-cols-3 gap-3 text-center"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {[
              { type: 'Images', formats: 'PNG · JPEG · WebP · HEIC' },
              { type: 'Video',  formats: 'MP4 · AVI · MOV · MKV' },
              { type: 'Audio',  formats: 'MP3 · WAV · M4A · OGG' },
            ].map(item => (
              <div key={item.type}>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  {item.type}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.formats}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
