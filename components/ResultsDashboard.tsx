'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, Cpu, Zap, ChevronRight } from 'lucide-react';
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

const SECTION_META: Array<{ key: string; label: string; num: string; accent: string }> = [
  { key: 'claims',      label: 'Claims',       num: '01', accent: '#4F8EFF' },
  { key: 'trust',       label: 'Trust',        num: '02', accent: '#7C3AED' },
  { key: 'fact',        label: 'Verification', num: '03', accent: '#22C55E' },
  { key: 'explanation', label: 'Explanation',  num: '04', accent: '#818CF8' },
  { key: 'virality',    label: 'Virality',     num: '05', accent: '#EF4444' },
  { key: 'context',     label: 'Context',      num: '06', accent: '#22D3EE' },
  { key: 'counter',     label: 'Counter',      num: '07', accent: '#4F8EFF' },
];

function SectionBadge({ num, label, accent }: { num: string; label: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span
        className="text-[10px] font-black font-mono px-2.5 py-1 rounded-lg tracking-widest"
        style={{
          background: `${accent}18`,
          color: accent,
          border: `1px solid ${accent}30`,
          boxShadow: `0 0 8px ${accent}18`,
        }}
      >
        {num}
      </span>
      <span
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}20, transparent)` }} />
    </div>
  );
}

function SectionCard({
  id,
  sectionKey,
  children,
  delay = 0,
  fullWidth = false,
}: {
  id: string;
  sectionKey: string;
  children: React.ReactNode;
  delay?: number;
  fullWidth?: boolean;
}) {
  const meta = SECTION_META.find(m => m.key === sectionKey)!;
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="section-card rounded-2xl p-6"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
        willChange: 'transform',
      }}
    >
      <SectionBadge num={meta.num} label={meta.label} accent={meta.accent} />
      {children}
    </motion.div>
  );
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const topRef = useRef<HTMLDivElement>(null);

  const trustColor =
    result.trustScore >= 70 ? '#22C55E' : result.trustScore >= 40 ? '#F59E0B' : '#EF4444';

  const trustLabel =
    result.trustScore >= 70 ? 'Credible' : result.trustScore >= 40 ? 'Questionable' : 'Misinformation';

  const viralColor =
    result.viralityRisk.level === 'High' ? '#EF4444'
    : result.viralityRisk.level === 'Medium' ? '#F59E0B'
    : '#22C55E';

  const statCards = [
    {
      id: 'stat-trust',
      label: 'Trust Score',
      value: `${result.trustScore}`,
      unit: '/100',
      sub: trustLabel,
      color: trustColor,
      icon: '🛡',
    },
    {
      id: 'stat-claims',
      label: 'Claims Found',
      value: result.claims.length.toString(),
      unit: '',
      sub: `${result.claims.filter(c => c.status === 'False' || c.status === 'Misleading').length} flagged`,
      color: '#4F8EFF',
      icon: '🔍',
    },
    {
      id: 'stat-virality',
      label: 'Virality Risk',
      value: result.viralityRisk.level,
      unit: '',
      sub: `Score: ${result.viralityRisk.score}/100`,
      color: viralColor,
      icon: '📡',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-24" ref={topRef}>

      {/* ── Page Title ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-black display-font mb-1">
          <span style={{ color: 'var(--text-primary)' }}>Analysis </span>
          <span className="gradient-text">Report</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Mitra AI has completed the 9-step multimodal fact-check pipeline
        </p>
      </motion.div>

      {/* ── Result Header ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 rounded-2xl p-5"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(18px)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Status line */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: trustColor, boxShadow: `0 0 10px ${trustColor}` }}
                animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                Analysis Complete
              </h2>
              <span
                className="text-xs font-black px-3 py-1 rounded-full"
                style={{
                  background: `${trustColor}18`,
                  color: trustColor,
                  border: `1px solid ${trustColor}35`,
                  boxShadow: `0 0 12px ${trustColor}15`,
                }}
              >
                {trustLabel}
              </span>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { icon: <Clock className="w-3 h-3" />, text: `${(result.processingTime / 1000).toFixed(1)}s` },
                { icon: <Cpu className="w-3 h-3" />, text: result.modelVersion },
                { icon: <Zap className="w-3 h-3" />, text: result.language.toUpperCase() },
                { icon: null, text: result.inputType.charAt(0).toUpperCase() + result.inputType.slice(1) },
              ].map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {tag.icon}
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onReset}
            id="reset-btn"
            className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl font-semibold transition-all duration-250 flex-shrink-0 group"
            style={{
              color: 'var(--text-secondary)',
              border: '1px solid var(--bg-border)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'rgba(79,142,255,0.45)';
              e.currentTarget.style.background = 'rgba(79,142,255,0.07)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(79,142,255,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--bg-border)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-500" />
            New Analysis
          </button>
        </div>

        {/* Analyzed input */}
        <div
          className="mt-4 pt-4 flex items-start gap-3"
          style={{ borderTop: '1px solid var(--bg-border)' }}
        >
          <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#4F8EFF' }} />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              Analyzed Input
            </p>
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
              {result.originalInput}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.id}
            id={stat.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(18px)',
              border: `1px solid ${stat.color}22`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 0 ${stat.color}00, inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
            whileHover={{
              boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${stat.color}15`,
              borderColor: `${stat.color}40`,
              y: -3,
            }}
          >
            {/* Glow blob */}
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: `${stat.color}10`, filter: 'blur(20px)' }}
            />

            <p className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </p>
            <p className="font-black display-font leading-none" style={{ color: stat.color, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
              {stat.value}
              {stat.unit && <span className="text-lg ml-1 opacity-60">{stat.unit}</span>}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main Sections Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard id="section-claims" sectionKey="claims" delay={0.2}>
          <ClaimsExtraction claims={result.claims} />
        </SectionCard>

        <SectionCard id="section-trust" sectionKey="trust" delay={0.25}>
          <TrustScore score={result.trustScore} breakdown={result.trustBreakdown} />
        </SectionCard>

        <SectionCard id="section-fact" sectionKey="fact" delay={0.3}>
          <FactVerification data={result.factVerification} />
        </SectionCard>

        <SectionCard id="section-explanation" sectionKey="explanation" delay={0.35}>
          <Explanation data={result.explanation} />
        </SectionCard>

        <SectionCard id="section-virality" sectionKey="virality" delay={0.4}>
          <ViralityRisk data={result.viralityRisk} />
        </SectionCard>

        <SectionCard id="section-context" sectionKey="context" delay={0.45}>
          <ContextAnalysis data={result.contextAnalysis} />
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard id="section-counter" sectionKey="counter" delay={0.5}>
            <CounterMessage data={result.counterMessage} />
          </SectionCard>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-10 text-center text-[11px]"
        style={{ color: 'var(--text-muted)' }}
      >
        Analysis powered by{' '}
        <span
          className="font-semibold"
          style={{ color: '#4F8EFF' }}
        >
          proofly-v2.1.0-multimodal
        </span>
        {' '}· Results are AI-generated and should be independently verified · Not legal advice
      </motion.div>
    </div>
  );
}
