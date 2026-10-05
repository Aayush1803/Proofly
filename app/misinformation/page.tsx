'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import ProcessingState from '@/components/ProcessingState';
import ResultsDashboard from '@/components/ResultsDashboard';
import { useAnalysis } from '@/lib/hooks/useAnalysis';

export default function MisinformationPage() {
  const { status } = useSession();
  const router = useRouter();

  const { appState, currentStep, result, error, handleSubmit, handleReset } = useAnalysis();

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
        {/* Idle — show input workspace */}
        {appState === 'idle' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <Hero
              onSubmit={(input, type, file) => handleSubmit(input, type, file)}
              isLoading={false}
            />
          </motion.div>
        )}

        {/* Processing */}
        {appState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4"
          >
            <div className="text-center mb-8">
              <p className="label-caps mb-3">Running verification pipeline</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Analyzing content
              </h2>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Our 9-step AI pipeline is examining your content...
              </p>
            </div>
            <ProcessingState isVisible={true} currentStep={currentStep} />
          </motion.div>
        )}

        {/* Results */}
        {appState === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-20 pb-16"
          >
            <div className="max-w-5xl mx-auto px-4 mb-8 text-center">
              <p className="label-caps mb-2">9-step pipeline complete</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Verification report
              </h2>
            </div>
            <ResultsDashboard result={result} onReset={handleReset} />
          </motion.div>
        )}

        {/* Error */}
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
