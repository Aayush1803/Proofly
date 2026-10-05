'use client';

import { motion } from 'framer-motion';
import { ViralityRisk as ViralityRiskType } from '@/lib/types';

interface ViralityRiskProps {
  data: ViralityRiskType;
}

export default function ViralityRisk({ data }: ViralityRiskProps) {
  const config = {
    Low:    { color: 'var(--semantic-credible)',     bg: 'var(--semantic-credible-bg)',     border: 'var(--semantic-credible-border)' },
    Medium: { color: 'var(--semantic-questionable)', bg: 'var(--semantic-questionable-bg)', border: 'var(--semantic-questionable-border)' },
    High:   { color: 'var(--semantic-false)',        bg: 'var(--semantic-false-bg)',        border: 'var(--semantic-false-border)' },
  }[data.level] ?? { color: 'var(--text-primary)', bg: 'var(--bg-secondary)', border: 'var(--border)' };

  const spreadIndicators = [
    { label: 'Messaging apps', value: data.score > 60 ? 'Very likely' : data.score > 30 ? 'Possible' : 'Unlikely', hot: data.score > 60 },
    { label: 'Social media',   value: data.score > 70 ? 'Trending risk' : data.score > 40 ? 'Moderate' : 'Low',    hot: data.score > 70 },
  ];

  return (
    <div>
      {/* Score display */}
      <div className="flex items-center gap-4 mb-5">
        <div>
          <div
            className="score-display text-5xl"
            style={{ color: config.color }}
          >
            {data.score}
          </div>
          <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
            virality index
          </div>
        </div>

        <div className="flex-1">
          {/* Level badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded"
              style={{ color: config.color, background: config.bg, border: `1px solid ${config.border}` }}
            >
              {data.level} Risk
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${data.score}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="evidence-row">
        <p className="label-caps mb-1.5">Why this score</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {data.reason}
        </p>
      </div>

      {/* Spread indicators */}
      <div className="pt-4">
        <p className="label-caps mb-3">Spread likelihood</p>
        <div className="grid grid-cols-2 gap-3">
          {spreadIndicators.map(indicator => (
            <div
              key={indicator.label}
              className="rounded p-3"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <p className="text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>
                {indicator.label}
              </p>
              <p
                className="text-sm font-medium"
                style={{
                  color: indicator.hot
                    ? 'var(--semantic-false)'
                    : 'var(--text-secondary)',
                }}
              >
                {indicator.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
