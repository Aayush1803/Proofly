'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Brain, Waves, Eye, Database, Search, Shield, Zap } from 'lucide-react';

interface ProcessingStateProps {
  isVisible: boolean;
  currentStep: number;
}

const STEPS = [
  { id: 0, label: 'Input preprocessing',      sublabel: 'Tokenizing and normalizing content',          icon: <Zap      className="w-3.5 h-3.5" /> },
  { id: 1, label: 'Audio track extraction',   sublabel: 'Separating audio from media stream',          icon: <Waves    className="w-3.5 h-3.5" /> },
  { id: 2, label: 'Spectrogram analysis',     sublabel: 'Running audio fingerprint detection',         icon: <Waves    className="w-3.5 h-3.5" /> },
  { id: 3, label: 'Vision transformer pass',  sublabel: 'Analyzing frames for visual manipulation',    icon: <Eye      className="w-3.5 h-3.5" /> },
  { id: 4, label: 'Claims extraction',        sublabel: 'Decomposing text into verifiable assertions', icon: <Brain    className="w-3.5 h-3.5" /> },
  { id: 5, label: 'Source verification',      sublabel: 'Cross-referencing Reuters, PTI, WHO',         icon: <Database className="w-3.5 h-3.5" /> },
  { id: 6, label: 'Virality risk modeling',   sublabel: 'Computing social propagation score',          icon: <Search   className="w-3.5 h-3.5" /> },
  { id: 7, label: 'Report generation',        sublabel: 'Composing analysis and counter-narrative',    icon: <Shield   className="w-3.5 h-3.5" /> },
];

export default function ProcessingState({ isVisible, currentStep }: ProcessingStateProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round((currentStep / STEPS.length) * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="w-full max-w-xl mx-auto px-4"
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
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                {/* Subtle spinner */}
                <div
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                  style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--accent)' }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Verification in progress{dots}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    proofly · multimodal pipeline
                  </p>
                </div>
              </div>

              {/* Progress percent */}
              <div className="text-right">
                <div
                  className="text-xl font-semibold font-mono"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {progress}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>complete</div>
              </div>
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

            {/* Steps list */}
            <div className="px-5 py-4 space-y-0">
              {STEPS.map((step, i) => {
                const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';
                return (
                  <div key={step.id} className="processing-step">
                    {/* Status indicator */}
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {status === 'done' ? (
                        <Check className="w-3.5 h-3.5" style={{ color: 'var(--semantic-credible)' }} />
                      ) : status === 'active' ? (
                        <div
                          className="w-2.5 h-2.5 rounded-full step-active"
                          style={{ background: 'var(--accent)' }}
                        />
                      ) : (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: 'var(--border-strong)', opacity: 0.5 }}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm"
                        style={{
                          color: status === 'done'
                            ? 'var(--text-muted)'
                            : status === 'active'
                            ? 'var(--text-primary)'
                            : 'var(--text-muted)',
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

                    {/* Step number */}
                    <span
                      className="flex-shrink-0 text-xs font-mono"
                      style={{ color: 'var(--text-muted)', opacity: 0.5 }}
                    >
                      {i + 1}/{STEPS.length}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                Est. {Math.max(1, 5 - Math.floor(currentStep * 0.6))}s remaining
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Do not close this window
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
