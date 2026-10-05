'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { Claim, ClaimStatus } from '@/lib/types';

interface ClaimsExtractionProps {
  claims: Claim[];
}

const STATUS_CONFIG: Record<ClaimStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  True: {
    label:  'TRUE',
    color:  'var(--semantic-credible)',
    bg:     'var(--semantic-credible-bg)',
    border: 'var(--semantic-credible-border)',
    icon:   <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  False: {
    label:  'FALSE',
    color:  'var(--semantic-false)',
    bg:     'var(--semantic-false-bg)',
    border: 'var(--semantic-false-border)',
    icon:   <XCircle className="w-3.5 h-3.5" />,
  },
  Misleading: {
    label:  'MISLEADING',
    color:  'var(--semantic-questionable)',
    bg:     'var(--semantic-questionable-bg)',
    border: 'var(--semantic-questionable-border)',
    icon:   <AlertTriangle className="w-3.5 h-3.5" />,
  },
  Opinion: {
    label:  'OPINION',
    color:  'var(--semantic-opinion)',
    bg:     'var(--semantic-opinion-bg)',
    border: 'var(--semantic-opinion-border)',
    icon:   <MessageSquare className="w-3.5 h-3.5" />,
  },
};

function confidenceLabel(confidence: number): string {
  if (confidence >= 90) return 'Very high';
  if (confidence >= 75) return 'High';
  if (confidence >= 60) return 'Moderate';
  if (confidence >= 40) return 'Low';
  return 'Very low';
}

export default function ClaimsExtraction({ claims }: ClaimsExtractionProps) {
  const counts = claims.reduce(
    (acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; },
    {} as Record<ClaimStatus, number>
  );

  return (
    <div>
      {/* Summary row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(counts) as ClaimStatus[]).map(status => {
          const cfg = STATUS_CONFIG[status];
          return (
            <span
              key={status}
              className="text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1.5"
              style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              {cfg.icon}
              {counts[status]} {status}
            </span>
          );
        })}
        <span className="ml-auto text-xs font-mono self-center" style={{ color: 'var(--text-muted)' }}>
          {claims.length} total
        </span>
      </div>

      {/* Claims list — evidence rows */}
      <div className="space-y-0">
        {claims.map((claim, i) => {
          const cfg        = STATUS_CONFIG[claim.status];
          const confidence = claim.confidence ?? 70;

          return (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease: 'easeOut' }}
              className="evidence-row"
            >
              <div className="flex items-start gap-3">
                {/* Index */}
                <span
                  className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono mt-0.5"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {i + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {claim.text}
                  </p>

                  {/* Status badge + confidence */}
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="flex-1 h-0.5 rounded-full overflow-hidden"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: cfg.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${confidence}%` }}
                          transition={{ duration: 0.8, delay: i * 0.06 + 0.2, ease: 'easeOut' }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-mono flex-shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {confidence}% {confidenceLabel(confidence)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
