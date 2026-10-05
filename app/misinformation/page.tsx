'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import ProcessingView from '@/components/ProcessingView';
import VerificationReport from '@/components/VerificationReport';
import ErrorState from '@/components/ErrorState';
import { useVerification, MISINFO_STAGES } from '@/lib/hooks/useVerification';
import { InputType } from '@/lib/api/types';

export default function MisinformationPage() {
  const { status } = useSession();
  const router = useRouter();
  const { appState, currentStep, stages, result, error, submit, reset } = useVerification('misinfo');

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

  const handleSubmit = (input: string, type: InputType, file?: File) => {
    submit(input, type, file);
  };

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      <AnimatePresence mode="wait">
        {appState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Hero onSubmit={handleSubmit} isLoading={false} />
          </motion.div>
        )}

        {appState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProcessingView
              stages={stages}
              currentStep={currentStep}
              title="Analyzing content"
              subtitle="Running misinformation detection pipeline…"
            />
          </motion.div>
        )}

        {appState === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-20 pb-16"
          >
            <VerificationReport result={result} onReset={reset} />
          </motion.div>
        )}

        {appState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center pt-20 px-4"
          >
            <ErrorState message={error ?? 'Analysis failed. Please try again.'} onRetry={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
