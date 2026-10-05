'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ProcessingStage } from '@/lib/api/types';

interface ProcessingViewProps {
  stages:      ProcessingStage[];
  currentStep: number;
  title?:      string;
  subtitle?:   string;
}

export default function ProcessingView({
  stages,
  currentStep,
  title    = 'Analyzing',
  subtitle = 'Processing your content…',
}: ProcessingViewProps) {
  const progress = Math.round(Math.min(100, (currentStep / stages.length) * 100));

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <p className="label-caps mb-3">Running analysis pipeline</p>
        <h1 className="font-serif text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
      </div>

      {/* Stage list card */}
      <div
        className="w-full max-w-md rounded-lg overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
      >
        {/* Card header with progress */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
              style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--accent)' }}
            />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Pipeline running
            </p>
          </div>
          <span className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            {progress}%
          </span>
        </div>

        {/* Thin progress bar */}
        <div className="w-full h-px relative" style={{ background: 'var(--border)' }}>
          <motion.div
            className="absolute left-0 top-0 h-full"
            style={{ background: 'var(--accent)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Steps */}
        <div className="px-5 py-3">
          {stages.map((stage, i) => {
            const status =
              i < currentStep ? 'done' :
              i === currentStep ? 'active' : 'pending';

            return (
              <div key={stage.id} className="processing-step">
                {/* Indicator */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
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
                      style={{ background: 'var(--border-strong)', opacity: 0.4 }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm"
                    style={{
                      color: status === 'active' ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: status === 'active' ? 500 : 400,
                      textDecoration: status === 'done' ? 'line-through' : 'none',
                      opacity: status === 'pending' ? 0.5 : 1,
                    }}
                  >
                    {stage.label}
                  </p>
                  {status === 'active' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {stage.sublabel}
                    </motion.p>
                  )}
                </div>

                {/* Stage index */}
                <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
                  {i + 1}/{stages.length}
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
            Step {Math.min(currentStep + 1, stages.length)} of {stages.length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Do not close this tab</p>
        </div>
      </div>
    </section>
  );
}
