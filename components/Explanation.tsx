'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Explanation as ExplanationType } from '@/lib/types';

interface ExplanationProps {
  data: ExplanationType;
}

export default function Explanation({ data }: ExplanationProps) {
  const [eli10Open, setEli10Open] = useState(true);

  return (
    <div>
      {/* Detailed explanation */}
      <div className="evidence-row">
        <p className="label-caps mb-2">Detailed analysis</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {data.detailed}
        </p>
      </div>

      {/* ELI10 collapsible */}
      <div
        className="mt-4 rounded overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
      >
        <button
          onClick={() => setEli10Open(!eli10Open)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
          style={{ background: 'var(--bg-secondary)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              ELI10
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Explain like I&apos;m 10
            </span>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color: 'var(--text-muted)',
              transform: eli10Open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        <AnimatePresence>
          {eli10Open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div
                className="px-4 py-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {data.eli10}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
