'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { TrustBreakdown } from '@/lib/types';

interface TrustScoreProps {
  score: number;
  breakdown: TrustBreakdown;
}

function getConfig(score: number) {
  if (score >= 70) return {
    color:     'var(--semantic-credible)',
    bg:        'var(--semantic-credible-bg)',
    border:    'var(--semantic-credible-border)',
    label:     'High credibility',
    sublabel:  'Content is likely trustworthy',
    verdict:   'CREDIBLE',
  };
  if (score >= 40) return {
    color:     'var(--semantic-questionable)',
    bg:        'var(--semantic-questionable-bg)',
    border:    'var(--semantic-questionable-border)',
    label:     'Moderate risk',
    sublabel:  'Verify before sharing',
    verdict:   'QUESTIONABLE',
  };
  return {
    color:     'var(--semantic-false)',
    bg:        'var(--semantic-false-bg)',
    border:    'var(--semantic-false-border)',
    label:     'Low credibility',
    sublabel:  'High misinformation risk',
    verdict:   'MISINFORMATION',
  };
}

// Animated number counter
function Counter({ target, delay = 0.3 }: { target: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = target / 50;
      const interval = setInterval(() => {
        start = Math.min(start + step, target);
        setDisplay(Math.round(start));
        if (start >= target) clearInterval(interval);
      }, 20);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, delay]);
  return <>{display}</>;
}

export default function TrustScore({ score, breakdown }: TrustScoreProps) {
  const cfg = getConfig(score);

  const metrics = [
    { label: 'Source reliability',  value: breakdown.sourceReliability,  invert: false },
    { label: 'Factual accuracy',    value: breakdown.factualAccuracy,     invert: false },
    { label: 'Context integrity',   value: breakdown.contextIntegrity,    invert: false },
    { label: 'Emotional language',  value: breakdown.emotionalLanguage,   invert: true  },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <p className="label-caps">Credibility assessment</p>
        <span
          className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded"
          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
        >
          {cfg.verdict}
        </span>
      </div>

      {/* Score display — editorial large number */}
      <div className="flex items-end gap-6 mb-6">
        <div>
          <div
            className="score-display text-7xl"
            style={{ color: cfg.color }}
          >
            <Counter target={score} delay={0.3} />
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
            out of 100
          </div>
        </div>

        <div className="flex-1 pb-2">
          {/* Status box */}
          <div
            className="rounded p-3 mb-3"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            <p className="text-sm font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cfg.sublabel}</p>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: cfg.color }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Sub-metric breakdown */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <p className="label-caps mb-4">Score breakdown</p>
        <div className="space-y-0">
          {metrics.map((m, i) => {
            // For emotional language: high = bad, so bar color inverts
            const barColor = m.invert
              ? m.value > 60
                ? 'var(--semantic-false)'
                : m.value > 35
                ? 'var(--semantic-questionable)'
                : 'var(--semantic-credible)'
              : cfg.color;

            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="evidence-row"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {m.value}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: barColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1.0, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* High-risk warning */}
      {score < 35 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-4 flex items-center gap-2.5 p-3 rounded text-xs"
          style={{
            background: 'var(--semantic-false-bg)',
            border: '1px solid var(--semantic-false-border)',
            color: 'var(--semantic-false)',
          }}
        >
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Do not share — high misinformation risk detected
        </motion.div>
      )}
    </div>
  );
}
