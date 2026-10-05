'use client';

import { motion } from 'framer-motion';
import {
  AnalysisResult,
  VerdictLabel,
  EvidenceItem,
  EvidenceAssessment,
  RiskLevel,
  SourceCredibility,
} from '@/lib/api/types';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, RotateCcw, ExternalLink, Clock, Cpu } from 'lucide-react';

// ── Verdict helpers ───────────────────────────────────────────────────────────

const VERDICT_META: Record<VerdictLabel, {
  label:       string;
  color:       string;
  bg:          string;
  border:      string;
  Icon:        React.FC<{ className?: string; style?: React.CSSProperties }>;
}> = {
  likely_true:       { label: 'Likely Accurate',    color: 'var(--semantic-credible)',      bg: 'var(--semantic-credible-bg)',      border: 'var(--semantic-credible-border)',      Icon: CheckCircle },
  likely_authentic:  { label: 'Likely Authentic',   color: 'var(--semantic-credible)',      bg: 'var(--semantic-credible-bg)',      border: 'var(--semantic-credible-border)',      Icon: CheckCircle },
  likely_false:      { label: 'Likely False',        color: 'var(--semantic-false)',         bg: 'var(--semantic-false-bg)',         border: 'var(--semantic-false-border)',         Icon: XCircle },
  likely_manipulated:{ label: 'Likely Manipulated', color: 'var(--semantic-false)',         bg: 'var(--semantic-false-bg)',         border: 'var(--semantic-false-border)',         Icon: XCircle },
  misleading:        { label: 'Misleading',          color: 'var(--semantic-questionable)', bg: 'var(--semantic-questionable-bg)', border: 'var(--semantic-questionable-border)', Icon: AlertTriangle },
  uncertain:         { label: 'Uncertain',            color: 'var(--text-muted)',            bg: 'var(--bg-secondary)',              border: 'var(--border)',                       Icon: HelpCircle },
  opinion:           { label: 'Opinion',              color: 'var(--semantic-opinion)',      bg: 'var(--semantic-opinion-bg)',       border: 'var(--semantic-opinion-border)',       Icon: HelpCircle },
};

const ASSESSMENT_META: Record<EvidenceAssessment, { label: string; color: string; bg: string; border: string }> = {
  true:         { label: 'Accurate',      color: 'var(--semantic-credible)',      bg: 'var(--semantic-credible-bg)',      border: 'var(--semantic-credible-border)' },
  false:        { label: 'Inaccurate',   color: 'var(--semantic-false)',         bg: 'var(--semantic-false-bg)',         border: 'var(--semantic-false-border)' },
  misleading:   { label: 'Misleading',   color: 'var(--semantic-questionable)', bg: 'var(--semantic-questionable-bg)', border: 'var(--semantic-questionable-border)' },
  opinion:      { label: 'Opinion',      color: 'var(--semantic-opinion)',       bg: 'var(--semantic-opinion-bg)',       border: 'var(--semantic-opinion-border)' },
  unverifiable: { label: 'Unverifiable', color: 'var(--text-muted)',            bg: 'var(--bg-secondary)',              border: 'var(--border)' },
};

const RISK_META: Record<RiskLevel, { label: string; color: string }> = {
  high:   { label: 'High virality risk',   color: 'var(--semantic-false)' },
  medium: { label: 'Medium virality risk', color: 'var(--semantic-questionable)' },
  low:    { label: 'Low virality risk',    color: 'var(--semantic-credible)' },
};

const CREDIBILITY_META: Record<SourceCredibility, { label: string; color: string }> = {
  high:    { label: 'High credibility',    color: 'var(--semantic-credible)' },
  medium:  { label: 'Medium credibility',  color: 'var(--semantic-questionable)' },
  low:     { label: 'Low credibility',     color: 'var(--semantic-false)' },
  unknown: { label: 'Unknown credibility', color: 'var(--text-muted)' },
};

const EVIDENCE_TYPE_LABELS: Record<EvidenceItem['type'], string> = {
  claim:         'Claim',
  visual_signal: 'Visual signal',
  audio_signal:  'Audio signal',
  metadata:      'Metadata',
  source_check:  'Source check',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-lg overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="label-caps">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function EvidenceRow({ item }: { item: EvidenceItem }) {
  const meta = ASSESSMENT_META[item.assessment];
  const pct  = Math.round(item.confidence * 100);

  return (
    <div className="evidence-row flex gap-4">
      {/* Index */}
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
        style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
      >
        {item.id}
      </span>
      <div className="flex-1 min-w-0">
        {/* Type tag */}
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          {EVIDENCE_TYPE_LABELS[item.type]}
        </p>
        {/* Claim text */}
        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
        {item.explanation && (
          <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {item.explanation}
          </p>
        )}
        {/* Assessment + confidence */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
          >
            {meta.label}
          </span>
          <div className="flex-1 max-w-32">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: meta.color }} />
              </div>
              <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface VerificationReportProps {
  result:   AnalysisResult;
  onReset?: () => void;
}

export default function VerificationReport({ result, onReset }: VerificationReportProps) {
  const verdictMeta = VERDICT_META[result.verdict.label] ?? VERDICT_META.uncertain;
  const VerdictIcon = verdictMeta.Icon;
  const confidence  = Math.round(result.verdict.confidence * 100);
  const viralPct    = Math.round(result.risk.virality_score * 100);
  const riskMeta    = RISK_META[result.risk.level];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      {/* ── Verdict header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg overflow-hidden mb-6"
        style={{
          background: verdictMeta.bg,
          border: `1px solid ${verdictMeta.border}`,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Header bar */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${verdictMeta.border}` }}
        >
          <p className="label-caps" style={{ color: verdictMeta.color }}>Verification report</p>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {new Date(result.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded ml-3 transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <RotateCcw className="w-3 h-3" /> New analysis
              </button>
            )}
          </div>
        </div>

        {/* Verdict body */}
        <div className="px-6 py-6">
          <div className="flex items-start gap-4">
            <VerdictIcon className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: verdictMeta.color }} />
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-semibold mb-1" style={{ color: verdictMeta.color }}>
                {verdictMeta.label}
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {result.verdict.summary}
              </p>
            </div>
            {/* Confidence */}
            <div className="text-right flex-shrink-0">
              <p className="score-display text-4xl" style={{ color: verdictMeta.color }}>{confidence}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>confidence</p>
              <div className="mt-2 w-20">
                <div className="h-1.5 rounded-full w-full" style={{ background: 'var(--bg-card)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${confidence}%`, background: verdictMeta.color }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meta strip */}
          <div className="mt-5 pt-4 flex flex-wrap gap-x-6 gap-y-2" style={{ borderTop: `1px solid ${verdictMeta.border}` }}>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {result.model.name} v{result.model.version}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {result.processing_time_ms.toLocaleString()} ms
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {result.input_type} analysis
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Disclaimer ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 px-4 py-3 rounded-md text-xs leading-relaxed"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <strong style={{ color: 'var(--text-secondary)' }}>About this report:</strong>{' '}
        This is an AI-assisted assessment, not a definitive determination of truth. Confidence scores reflect
        model certainty, not absolute accuracy. Always verify important claims with primary sources.
        You are the final decision-maker.
      </motion.div>

      <div className="space-y-4">
        {/* ── Evidence ────────────────────────────────────────────── */}
        {result.evidence.length > 0 && (
          <SectionCard index={1} title="Evidence">
            <div>
              {result.evidence.map(item => (
                <EvidenceRow key={item.id} item={item} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Explanation ─────────────────────────────────────────── */}
        <SectionCard index={2} title="Analysis">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Technical
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {result.explanation.technical}
              </p>
            </div>
            {result.explanation.simple && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Plain language
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {result.explanation.simple}
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── Sources ─────────────────────────────────────────────── */}
        {result.sources.length > 0 && (
          <SectionCard index={3} title="Sources">
            <div className="space-y-0">
              {result.sources.map((source, i) => {
                const cred = CREDIBILITY_META[source.credibility];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3"
                    style={i > 0 ? { borderTop: '1px solid var(--border)' } : {}}
                  >
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                    >
                      {source.logo ?? source.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{source.name}</p>
                      <p className="text-xs" style={{ color: cred.color }}>{cred.label}</p>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* ── Risk + Context ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Virality risk */}
          <SectionCard index={4} title="Virality risk">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="score-display text-4xl" style={{ color: riskMeta.color }}>{viralPct}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>/ 100</p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{ color: riskMeta.color, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                {riskMeta.label}
              </span>
            </div>
            <div className="mb-3">
              <div className="h-1.5 rounded-full w-full" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full" style={{ width: `${viralPct}%`, background: riskMeta.color }} />
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {result.risk.reasoning}
            </p>
          </SectionCard>

          {/* Context */}
          <SectionCard index={5} title="Context">
            <div className="space-y-3">
              {result.context.regional_context && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Regional</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {result.context.regional_context}
                  </p>
                </div>
              )}
              <div style={result.context.regional_context ? { borderTop: '1px solid var(--border)', paddingTop: '0.75rem' } : {}}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Sensitivity</p>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    color: result.context.sensitivity === 'high' ? 'var(--semantic-false)' : result.context.sensitivity === 'medium' ? 'var(--semantic-questionable)' : 'var(--semantic-credible)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {result.context.sensitivity.toUpperCase()}
                </span>
                {result.context.sensitivity_note && (
                  <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-muted)' }}>
                    {result.context.sensitivity_note}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Model info ───────────────────────────────────────────── */}
        <SectionCard index={6} title="Model information">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Model',   value: result.model.name },
              { label: 'Version', value: result.model.version },
              { label: 'Type',    value: result.model.type ?? result.input_type },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  {item.label}
                </p>
                <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            Results reflect the model&apos;s assessment at the time of analysis.
            Model outputs are probabilistic — not determinate verdicts.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
