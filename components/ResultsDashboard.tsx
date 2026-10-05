'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, Cpu } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import ClaimsExtraction from './ClaimsExtraction';
import TrustScore from './TrustScore';
import FactVerification from './FactVerification';
import Explanation from './Explanation';
import ViralityRisk from './ViralityRisk';
import ContextAnalysis from './ContextAnalysis';
import CounterMessage from './CounterMessage';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

// Section heading — editorial number + label
function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{num}</span>
      <p className="label-caps">{label}</p>
    </div>
  );
}

// Section card — clean solid card
function SectionCard({
  id,
  num,
  label,
  children,
  delay = 0,
}: {
  id: string;
  num: string;
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg p-5"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <SectionLabel num={num} label={label} />
      {children}
    </motion.div>
  );
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const topRef = useRef<HTMLDivElement>(null);

  const trustColor =
    result.trustScore >= 70 ? 'var(--semantic-credible)'
    : result.trustScore >= 40 ? 'var(--semantic-questionable)'
    : 'var(--semantic-false)';

  const trustLabel =
    result.trustScore >= 70 ? 'Credible'
    : result.trustScore >= 40 ? 'Questionable'
    : 'Misinformation';

  const trustBg =
    result.trustScore >= 70 ? 'var(--semantic-credible-bg)'
    : result.trustScore >= 40 ? 'var(--semantic-questionable-bg)'
    : 'var(--semantic-false-bg)';

  const trustBorder =
    result.trustScore >= 70 ? 'var(--semantic-credible-border)'
    : result.trustScore >= 40 ? 'var(--semantic-questionable-border)'
    : 'var(--semantic-false-border)';

  const flaggedCount = result.claims.filter(
    c => c.status === 'False' || c.status === 'Misleading'
  ).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-24" ref={topRef}>

      {/* ── Report header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-lg overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Verdict banner */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: trustBg, borderBottom: `1px solid ${trustBorder}` }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: trustColor }}
            />
            <span className="text-sm font-semibold" style={{ color: trustColor }}>
              {trustLabel}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              · verification complete
            </span>
          </div>

          <button
            id="reset-btn"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-all"
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border)',
              background: 'var(--bg-card)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New analysis
          </button>
        </div>

        {/* Meta + analyzed input */}
        <div className="px-5 py-4">
          {/* Stat summary row */}
          <div className="grid grid-cols-3 gap-0 mb-4">
            {[
              { label: 'Trust score', value: `${result.trustScore}/100`, color: trustColor },
              { label: 'Claims found', value: `${result.claims.length} (${flaggedCount} flagged)`, color: 'var(--text-primary)' },
              { label: 'Virality risk', value: `${result.viralityRisk.level} — ${result.viralityRisk.score}/100`, color: 'var(--text-primary)' },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-4 py-2"
                style={{
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                }}
              >
                <p className="label-caps mb-1">{stat.label}</p>
                <p className="text-sm font-semibold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Meta tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { icon: <Clock className="w-3 h-3" />, text: `${(result.processingTime / 1000).toFixed(1)}s` },
              { icon: <Cpu   className="w-3 h-3" />, text: result.modelVersion },
              { text: result.language.toUpperCase() },
              { text: result.inputType.charAt(0).toUpperCase() + result.inputType.slice(1) },
            ].map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                {tag.icon}
                {tag.text}
              </span>
            ))}
          </div>

          {/* Analyzed input */}
          <div
            className="rounded p-3"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <p className="label-caps mb-1.5">Analyzed input</p>
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
              {result.originalInput}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Sections grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard id="section-claims" num="01" label="Claims" delay={0.15}>
          <ClaimsExtraction claims={result.claims} />
        </SectionCard>

        <SectionCard id="section-trust" num="02" label="Credibility" delay={0.2}>
          <TrustScore score={result.trustScore} breakdown={result.trustBreakdown} />
        </SectionCard>

        <SectionCard id="section-fact" num="03" label="Verification" delay={0.25}>
          <FactVerification data={result.factVerification} />
        </SectionCard>

        <SectionCard id="section-explanation" num="04" label="Explanation" delay={0.3}>
          <Explanation data={result.explanation} />
        </SectionCard>

        <SectionCard id="section-virality" num="05" label="Virality risk" delay={0.35}>
          <ViralityRisk data={result.viralityRisk} />
        </SectionCard>

        <SectionCard id="section-context" num="06" label="Context" delay={0.4}>
          <ContextAnalysis data={result.contextAnalysis} />
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard id="section-counter" num="07" label="Counter message" delay={0.45}>
            <CounterMessage data={result.counterMessage} />
          </SectionCard>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-center text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        AI-generated analysis · Always verify independently · Not legal advice
      </motion.p>
    </div>
  );
}
