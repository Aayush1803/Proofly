'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Link2, Upload, X, FileText, FileAudio, FileVideo, Image as ImageIcon } from 'lucide-react';
import { InputType } from '@/lib/api/types';

interface HeroProps {
  onSubmit: (input: string, type: InputType, file?: File) => void;
  isLoading: boolean;
}

const SAMPLE_POOL = [
  `A widely circulated health claim states that consuming 5 basil (tulsi) leaves daily on an empty stomach removes all liver toxins and prevents diabetes. The post attributes this to Patanjali research, though no published study has been cited.`,
  `A message circulating in several professional groups claims the government is planning to cut EPFO pension payouts by 30% starting January. The claim is attributed to a news channel broadcast but no official notification has been found.`,
  `A screenshot resembling a news article is being shared online, claiming that Jio will begin charging ₹200/month for internet calls from next month. No verifiable source has been linked in the post.`,
  `A viral reel claims that Indian school children who consume fluoride-treated tap water score lower on IQ assessments, citing a Harvard study. The claim is spreading rapidly and raising public concern.`,
  `A widely shared video claims that a mixture of lemon juice and baking soda can completely cure COVID-19 within 48 hours. The video has accumulated over 2 million views across platforms.`,
];

const SAMPLE_URL = 'https://www.indiatoday.in/fact-check';

type TabType = 'text' | 'url' | 'media';

const LANGUAGES = [
  { en: 'Hindi',     native: 'हिन्दी' },
  { en: 'Bengali',   native: 'বাংলা' },
  { en: 'Telugu',    native: 'తెలుగు' },
  { en: 'Marathi',   native: 'मराठी' },
  { en: 'Tamil',     native: 'தமிழ்' },
  { en: 'Urdu',      native: 'اردو' },
  { en: 'Gujarati',  native: 'ગુજરાતી' },
  { en: 'Kannada',   native: 'ಕನ್ನಡ' },
  { en: 'Malayalam', native: 'മലയാളം' },
  { en: 'Punjabi',   native: 'ਪੰਜਾਬੀ' },
  { en: 'Odia',      native: 'ଓଡ଼ିଆ' },
  { en: 'Assamese',  native: 'অসমীয়া' },
  { en: 'Maithili',  native: 'मैथिली' },
  { en: 'Sanskrit',  native: 'संस्कृतम्' },
  { en: 'Kashmiri',  native: 'کٲشُر' },
  { en: 'Nepali',    native: 'नेपाली' },
  { en: 'Sindhi',    native: 'سنڌي' },
  { en: 'Konkani',   native: 'कोंकणी' },
  { en: 'Dogri',     native: 'डोगरी' },
  { en: 'Manipuri',  native: 'মৈতৈলোন্' },
  { en: 'Bodo',      native: 'बड़ो' },
  { en: 'Santali',   native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { en: 'English',   native: 'English' },
];

export default function Hero({ onSubmit, isLoading }: HeroProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput,  setUrlInput]  = useState('');
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
    if (isLoading) return;
    if (activeTab === 'text' && textInput.trim()) onSubmit(textInput.trim(), 'text');
    else if (activeTab === 'url' && urlInput.trim()) onSubmit(urlInput.trim(), 'url');
    else if (activeTab === 'media' && uploadedFile) onSubmit(uploadedFile.name, 'media', uploadedFile);
  };

  const loadSample = () => {
    if (activeTab === 'text') {
      setTextInput(SAMPLE_POOL[Math.floor(Math.random() * SAMPLE_POOL.length)]);
    }
    if (activeTab === 'url') setUrlInput(SAMPLE_URL);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'text',  label: 'Text',  icon: <Type   className="w-3.5 h-3.5" /> },
    { id: 'url',   label: 'URL',   icon: <Link2  className="w-3.5 h-3.5" /> },
    { id: 'media', label: 'Media', icon: <Upload className="w-3.5 h-3.5" /> },
  ];

  const isReadyToSubmit =
    (activeTab === 'text'  && textInput.trim().length > 10) ||
    (activeTab === 'url'   && urlInput.trim().length > 5)   ||
    (activeTab === 'media' && uploadedFile !== null);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ── Page title ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 max-w-xl"
      >
        <p className="label-caps mb-4">
          Misinformation analysis · India-first · 23 languages
        </p>
        <h1
          className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Verify before you share.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Paste a claim, link, or upload a file. Our 9-step analysis pipeline
          examines sources, context, and evidence.
        </p>
      </motion.div>

      {/* ── Verification workspace ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
          {/* ── Tab bar ─────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-0 px-5"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-3 py-3.5 text-sm transition-all border-b-2"
                style={{
                  borderBottomColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  background: 'transparent',
                  marginBottom: '-1px',
                }}
              >
                <span style={{ color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-xs py-1" style={{ color: 'var(--text-muted)' }}>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--semantic-credible)' }}
              />
              Auto-detect language
            </div>
          </div>

          {/* ── Input area ──────────────────────────────────────────── */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {/* Text */}
              {activeTab === 'text' && (
                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <textarea
                    id="text-input"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    placeholder="Paste a viral message, news article, social media post, or any text claim..."
                    rows={7}
                    className="w-full text-sm resize-none focus:outline-none leading-relaxed rounded-md p-3.5 transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={loadSample}
                      className="text-xs transition-colors"
                      style={{ color: 'var(--accent)' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                    >
                      Load sample
                    </button>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {textInput.length} chars
                    </span>
                  </div>
                </motion.div>
              )}

              {/* URL */}
              {activeTab === 'url' && (
                <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <div className="relative">
                    <Link2
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      id="url-input"
                      type="url"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      placeholder="https://example.com/article-to-verify"
                      className="w-full rounded-md pl-10 pr-4 py-3 text-sm font-mono transition-colors focus:outline-none"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Supports news articles, YouTube, Twitter/X, Instagram, blogs, and any public URL.
                    </p>
                    <button
                      onClick={loadSample}
                      className="text-xs flex-shrink-0 ml-4"
                      style={{ color: 'var(--accent)' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                    >
                      Load sample
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Media */}
              {activeTab === 'media' && (
                <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  {uploadedFile ? (
                    <div
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
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className="h-36 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-all"
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
                        Images · Audio · Video · PDF · Max 20 MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,audio/*,video/*,application/pdf,text/plain,.heic,.heif,.avif,.mkv,.avi,.mov,.flv,.wmv,.m4a,.flac,.ogg,.opus,.aac"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Submit ──────────────────────────────────────────────── */}
            <button
              id="analyze-button"
              onClick={handleSubmit}
              disabled={!isReadyToSubmit || isLoading}
              className="mt-4 w-full py-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
              style={
                isReadyToSubmit && !isLoading
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
              }
              onMouseEnter={e => {
                if (isReadyToSubmit && !isLoading) e.currentTarget.style.background = 'var(--accent-hover)';
              }}
              onMouseLeave={e => {
                if (isReadyToSubmit && !isLoading) e.currentTarget.style.background = 'var(--accent)';
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.5)', borderTopColor: 'transparent' }}
                  />
                  Analyzing…
                </>
              ) : (
                <>
                  Run verification
                  {isReadyToSubmit && (
                    <span className="text-xs opacity-70 font-normal">~3–5 sec</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Trust indicators ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>
          {['India-first context', '23 official languages', 'Free to use', 'Open source'].map(badge => (
            <div key={badge} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
              {badge}
            </div>
          ))}
        </div>

        {/* ── Language grid ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-8"
        >
          <div
            className="rounded-lg p-5"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <p className="label-caps mb-4">23 supported languages</p>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map(lang => (
                <div
                  key={lang.en}
                  title={lang.en}
                  className="px-2.5 py-1 rounded text-xs cursor-default transition-colors"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <span>{lang.native}</span>
                  <span
                    className="text-[10px] ml-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {lang.en !== lang.native && lang.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
