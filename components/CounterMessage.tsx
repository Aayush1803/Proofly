'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { CounterMessage as CounterMessageType } from '@/lib/types';

interface CounterMessageProps {
  data: CounterMessageType;
}

export default function CounterMessage({ data }: CounterMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback — no op
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="label-caps">Suggested response</p>
        <span
          className="text-[10px] px-2 py-0.5 rounded font-medium"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          AI-generated
        </span>
      </div>

      {/* Message body */}
      <div
        className="rounded p-4 relative"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--border-strong)',
        }}
      >
        <p
          className="text-sm leading-[1.85] whitespace-pre-wrap pr-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          {data.text}
        </p>

        {/* Copy button — positioned top-right */}
        <button
          id="copy-counter-btn"
          onClick={handleCopy}
          className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border transition-all"
          style={
            copied
              ? {
                  background: 'var(--semantic-credible-bg)',
                  color: 'var(--semantic-credible)',
                  borderColor: 'var(--semantic-credible-border)',
                }
              : {
                  background: 'var(--bg-card)',
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)',
                }
          }
          onMouseEnter={e => {
            if (!copied) {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.background = 'var(--bg-hover)';
            }
          }}
          onMouseLeave={e => {
            if (!copied) {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }
          }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{   scale: 0.8,  opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{   scale: 0.8,  opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] mt-3 font-mono" style={{ color: 'var(--text-muted)' }}>
        AI-generated · Always verify before sharing · Not legal advice
      </p>
    </div>
  );
}
