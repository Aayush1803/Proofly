'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { FactVerification as FactVerificationType } from '@/lib/types';

interface FactVerificationProps {
  data: FactVerificationType;
}

const LOGO_COLORS: Record<string, string> = {
  R: '#FF8C00', P: '#1E40AF', A: '#16A34A', W: '#0EA5E9',
  B: '#DC2626', S: '#7C3AED', F: '#059669', I: '#2563EB',
};

export default function FactVerification({ data }: FactVerificationProps) {
  return (
    <div>
      {/* Verified fact */}
      <div
        className="rounded p-4 mb-5"
        style={{
          background: 'var(--semantic-credible-bg)',
          border: '1px solid var(--semantic-credible-border)',
          borderLeft: '3px solid var(--semantic-credible)',
        }}
      >
        <p className="label-caps mb-2" style={{ color: 'var(--semantic-credible)' }}>
          Verified information
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {data.correctedFact}
        </p>
      </div>

      {/* Sources */}
      <div>
        <p className="label-caps mb-3">Trusted sources</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.sources.map((source, i) => (
            <motion.a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded border transition-all group"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }}
            >
              <div
                className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: LOGO_COLORS[source.logo] || 'var(--accent)' }}
              >
                {source.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {source.name}
                </p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                  {source.url.replace('https://', '').split('/')[0]}
                </p>
              </div>
              <ExternalLink
                className="w-3.5 h-3.5 flex-shrink-0 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
