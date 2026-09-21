'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, ScanLine } from 'lucide-react';
import NavBar from '@/components/NavBar';
import DeepfakeHero from '@/components/DeepfakeHero';
import ResultsDashboard from '@/components/ResultsDashboard';
import { useDeepfakeAnalysis } from '@/lib/hooks/useDeepfakeAnalysis';

// Deepfake-specific processing steps
const DEEPFAKE_STEP_LABELS = [
  { label: 'Ingesting media file', sublabel: 'Reading file metadata and type' },
  { label: 'Extracting visual frames', sublabel: 'Sampling frames for pixel analysis' },
  { label: 'Pixel-level anomaly scan', sublabel: 'Detecting GAN artifacts and blending seams' },
  { label: 'Audio waveform analysis', sublabel: 'Examining voice synthesis markers' },
  { label: 'Temporal consistency check', sublabel: 'Frame-to-frame motion coherence' },
  { label: 'Metadata & artifact forensics', sublabel: 'Compression and EXIF analysis' },
  { label: 'Gemini multimodal reasoning', sublabel: 'AI holistic assessment in progress' },
  { label: 'Generating forensic report', sublabel: 'Compiling manipulation signals' },
];

function DeepfakeProcessing({ currentStep, stepLabel }: { currentStep: number; stepLabel: string }) {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {DEEPFAKE_STEP_LABELS.map((step, i) => {
        const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';
        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: status === 'pending' ? 0.35 : 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: status === 'active' ? 'rgba(239,68,68,0.07)' : 'var(--glass-bg)',
              border: `1px solid ${status === 'active' ? 'rgba(239,68,68,0.25)' : 'var(--glass-border)'}`,
            }}
          >
            {/* Step indicator */}
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: status === 'done' ? 'rgba(34,197,94,0.15)' : status === 'active' ? 'rgba(239,68,68,0.15)' : 'var(--bg-secondary)',
                border: `1px solid ${status === 'done' ? 'rgba(34,197,94,0.35)' : status === 'active' ? 'rgba(239,68,68,0.35)' : 'var(--bg-border)'}`,
              }}>
              {status === 'done' ? (
                <span className="text-[10px] text-green-400">✓</span>
              ) : status === 'active' ? (
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#EF4444' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              ) : (
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate"
                style={{ color: status === 'active' ? '#EF4444' : status === 'done' ? '#22C55E' : 'var(--text-muted)' }}>
                {step.label}
              </p>
              {status === 'active' && (
                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {step.sublabel}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
      <p className="text-center text-xs font-mono pt-2" style={{ color: 'var(--text-muted)' }}>
        {stepLabel}
      </p>
    </div>
  );
}

export default function DeepfakePage() {
  const { status } = useSession();
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);

  const { appState, currentStep, stepLabel, result, error, handleSubmit, handleReset } = useDeepfakeAnalysis();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EF4444] animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <main className="relative min-h-screen">
      <NavBar />

      <AnimatePresence mode="wait">
        {appState === 'idle' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <DeepfakeHero onSubmit={(file) => handleSubmit(file)} isLoading={false} />
          </motion.div>
        )}

        {appState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #C0392B, #7C3AED)',
                  boxShadow: '0 8px 32px rgba(239,68,68,0.35)',
                }}>
                <ScanLine className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                Running{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Forensic Analysis
                </span>
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Gemini multimodal AI is examining your media for manipulation signals...
              </p>
            </motion.div>
            <DeepfakeProcessing currentStep={currentStep} stepLabel={stepLabel} />
          </motion.div>
        )}

        {appState === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={resultRef}
            className="min-h-screen pt-24 pb-16"
          >
            <div className="max-w-5xl mx-auto px-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Forensic{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #7C3AED 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Report
                  </span>
                </h2>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Proofly has completed multimodal AI forensic analysis of your media
                </p>
              </motion.div>
            </div>
            <ResultsDashboard result={result} onReset={handleReset} />
          </motion.div>
        )}

        {appState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 pt-24"
          >
            <div className="glass rounded-2xl border p-8 max-w-md w-full text-center"
              style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(239,68,68,0.15)' }}>
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Analysis Failed
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{error}</p>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #C0392B, #7C3AED)' }}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #EF4444 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>
    </main>
  );
}
