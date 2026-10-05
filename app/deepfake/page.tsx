'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';
import NavBar from '@/components/NavBar';
import DeepfakeHero from '@/components/DeepfakeHero';
import ResultsDashboard from '@/components/ResultsDashboard';
import { useDeepfakeAnalysis } from '@/lib/hooks/useDeepfakeAnalysis';

const DEEPFAKE_STEPS = [
  { label: 'Ingesting media file',          sublabel: 'Reading file metadata and type' },
  { label: 'Extracting visual frames',      sublabel: 'Sampling frames for pixel analysis' },
  { label: 'Pixel-level anomaly scan',      sublabel: 'Detecting GAN artifacts and blending seams' },
  { label: 'Audio waveform analysis',       sublabel: 'Examining voice synthesis markers' },
  { label: 'Temporal consistency check',    sublabel: 'Frame-to-frame motion coherence' },
  { label: 'Metadata & artifact forensics', sublabel: 'Compression and EXIF analysis' },
  { label: 'Gemini multimodal reasoning',   sublabel: 'AI holistic assessment in progress' },
  { label: 'Generating forensic report',    sublabel: 'Compiling manipulation signals' },
];

function DeepfakeProcessing({ currentStep }: { currentStep: number }) {
  const progress = Math.round((currentStep / DEEPFAKE_STEPS.length) * 100);
  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
              style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--accent)' }}
            />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Forensic scan running…</p>
          </div>
          <span className="text-lg font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>{progress}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-px" style={{ background: 'var(--border)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'var(--accent)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Steps */}
        <div className="px-5 py-4 space-y-0">
          {DEEPFAKE_STEPS.map((step, i) => {
            const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';
            return (
              <div key={step.label} className="processing-step">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {status === 'done' ? (
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--semantic-credible)' }} />
                  ) : status === 'active' ? (
                    <div className="w-2.5 h-2.5 rounded-full step-active" style={{ background: 'var(--accent)' }} />
                  ) : (
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--border-strong)', opacity: 0.5 }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm"
                    style={{
                      color: status === 'active' ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: status === 'active' ? '500' : '400',
                      textDecoration: status === 'done' ? 'line-through' : 'none',
                      opacity: status === 'pending' ? 0.5 : 1,
                    }}
                  >
                    {step.label}
                  </p>
                  {status === 'active' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {step.sublabel}
                    </motion.p>
                  )}
                </div>
                <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
                  {i + 1}/{DEEPFAKE_STEPS.length}
                </span>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 flex justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Est. {Math.max(1, 15 - Math.floor(currentStep * 1.8))}s remaining
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Do not close</p>
        </div>
      </div>
    </div>
  );
}

export default function DeepfakePage() {
  const { status } = useSession();
  const router = useRouter();
  const { appState, currentStep, stepLabel, result, error, handleSubmit, handleReset } = useDeepfakeAnalysis();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      <AnimatePresence mode="wait">
        {appState === 'idle' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DeepfakeHero onSubmit={file => handleSubmit(file)} isLoading={false} />
          </motion.div>
        )}

        {appState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4"
          >
            <div className="text-center mb-8">
              <p className="label-caps mb-3">Running forensic pipeline</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Analyzing media
              </h2>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Gemini multimodal AI is examining your media for manipulation signals...
              </p>
            </div>
            <DeepfakeProcessing currentStep={currentStep} />
          </motion.div>
        )}

        {appState === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-20 pb-16"
          >
            <div className="max-w-5xl mx-auto px-4 mb-8 text-center">
              <p className="label-caps mb-2">Forensic pipeline complete</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Forensic report
              </h2>
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
            className="min-h-screen flex flex-col items-center justify-center px-4 pt-20"
          >
            <div
              className="rounded-lg p-8 max-w-md w-full text-center"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--semantic-false-border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--semantic-false-bg)', border: '1px solid var(--semantic-false-border)' }}
              >
                <span className="text-sm" style={{ color: 'var(--semantic-false)' }}>!</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Analysis failed
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{error}</p>
              <button
                onClick={handleReset}
                className="btn-primary w-full py-2.5 rounded-md font-semibold text-sm"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
