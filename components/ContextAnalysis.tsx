'use client';

import { motion } from 'framer-motion';
import { ContextAnalysis as ContextAnalysisType } from '@/lib/types';

interface ContextAnalysisProps {
  data: ContextAnalysisType;
}

export default function ContextAnalysis({ data }: ContextAnalysisProps) {
  const sensitivityLevel = data.sensitivity.startsWith('HIGH')
    ? 'high'
    : data.sensitivity.startsWith('MEDIUM')
    ? 'medium'
    : 'low';

  const sensitivityConfig = {
    high:   { color: 'var(--semantic-false)',        bg: 'var(--semantic-false-bg)',        border: 'var(--semantic-false-border)' },
    medium: { color: 'var(--semantic-questionable)', bg: 'var(--semantic-questionable-bg)', border: 'var(--semantic-questionable-border)' },
    low:    { color: 'var(--semantic-credible)',     bg: 'var(--semantic-credible-bg)',     border: 'var(--semantic-credible-border)' },
  }[sensitivityLevel];

  const rows = [
    { label: 'Regional context',  text: data.regional,    badge: 'India-specific' },
    { label: 'Cultural framing',  text: data.cultural,    badge: null },
  ];

  return (
    <div>
      <div className="space-y-0">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="evidence-row"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="label-caps">{row.label}</p>
              {row.badge && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-medium"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {row.badge}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {row.text}
            </p>
          </motion.div>
        ))}

        {/* Sensitivity */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="pt-4"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="label-caps">Sensitivity assessment</p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{ color: sensitivityConfig.color, background: sensitivityConfig.bg, border: `1px solid ${sensitivityConfig.border}` }}
            >
              {sensitivityLevel.toUpperCase()}
            </span>
          </div>
          <div
            className="rounded p-3 text-sm leading-relaxed"
            style={{
              background: sensitivityConfig.bg,
              border: `1px solid ${sensitivityConfig.border}`,
              color: 'var(--text-secondary)',
            }}
          >
            {data.sensitivity}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
