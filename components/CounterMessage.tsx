'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Copy, Check, Sparkles } from 'lucide-react';
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
      // fallback
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(79,142,255,0.25), rgba(124,58,237,0.25))',
            border: '1px solid rgba(79,142,255,0.3)',
            boxShadow: '0 0 16px rgba(79,142,255,0.15)',
          }}
        >
          <MessageSquare className="w-4 h-4" style={{ color: '#4F8EFF' }} />
        </div>
        <div>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Counter Message
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Factual response ready to share
          </p>
        </div>
        <motion.div
          className="ml-auto flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full"
          style={{
            background: 'rgba(79,142,255,0.08)',
            border: '1px solid rgba(79,142,255,0.2)',
            color: '#4F8EFF',
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles className="w-3 h-3" />
          AI-Generated
        </motion.div>
      </div>

      {/* Counter message card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Top gradient line */}
        <div
          className="h-px w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #4F8EFF, #7C3AED, #22D3EE, transparent)',
          }}
        />

        {/* Left accent bar */}
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{
            background: 'linear-gradient(180deg, #4F8EFF, #7C3AED)',
            boxShadow: '0 0 12px rgba(79,142,255,0.4)',
          }}
        />

        <div className="p-6 pl-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              Suggested Response
            </span>

            <motion.button
              id="copy-counter-btn"
              onClick={handleCopy}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              className="relative flex items-center gap-2 text-xs px-4 py-2 rounded-xl font-semibold transition-all duration-300 overflow-hidden"
              style={
                copied
                  ? {
                      background: 'rgba(34,197,94,0.15)',
                      color: '#22C55E',
                      border: '1px solid rgba(34,197,94,0.35)',
                      boxShadow: '0 0 16px rgba(34,197,94,0.15)',
                    }
                  : {
                      background: 'rgba(79,142,255,0.12)',
                      color: '#4F8EFF',
                      border: '1px solid rgba(79,142,255,0.3)',
                      boxShadow: '0 0 16px rgba(79,142,255,0.1)',
                    }
              }
            >
              {/* Shimmer on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />

              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Message text */}
          <p
            className="text-sm leading-[1.85] whitespace-pre-wrap"
            style={{ color: 'var(--text-secondary)' }}
          >
            {data.text}
          </p>

          {/* Bottom hint */}
          <p
            className="text-[10px] mt-5 pt-4 font-mono"
            style={{
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--bg-border)',
            }}
          >
            AI-generated · Always verify before sharing · Not legal advice
          </p>
        </div>
      </motion.div>
    </div>
  );
}
