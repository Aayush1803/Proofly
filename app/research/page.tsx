'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, FlaskConical, Shield, Brain, ScanLine, AlertTriangle,
  BookOpen, ExternalLink, Microscope, Cpu, Globe, CheckCircle, XCircle, Info,
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const METHODOLOGY_MISINFO = [
  {
    step: '01', icon: Globe, color: '#4F8EFF',
    title: 'Language Detection & Normalization',
    desc: 'Gemini auto-detects input language across all 23 official Indian languages and code-mixed variants like Hinglish. Content is internally analyzed in English, with outputs generated in the original language.',
    tags: ['NLP', 'Multilingual', 'Code-mix detection'],
  },
  {
    step: '02', icon: Brain, color: '#7C3AED',
    title: 'Claim Extraction & Segmentation',
    desc: 'The model segments the input into individual, independently-verifiable assertions. Opinions, rhetorical questions, and non-verifiable statements are filtered out before fact-checking begins.',
    tags: ['Semantic parsing', 'Claim boundary detection', 'Opinion filter'],
  },
  {
    step: '03', icon: FlaskConical, color: '#22D3EE',
    title: 'Factual Verification via Gemini',
    desc: 'Each extracted claim is passed to Gemini 3.6 Flash, which cross-references its training knowledge base and applies logical consistency reasoning. No live web scraping is used for claim verification.',
    tags: ['Gemini 3.6 Flash', 'Knowledge base reasoning', 'Consistency check'],
  },
  {
    step: '04', icon: Shield, color: '#22C55E',
    title: 'Trust Scoring & Breakdown',
    desc: 'A composite 0–100 Trust Score is computed from four sub-dimensions: source reliability, factual accuracy, context integrity, and emotional language manipulation index.',
    tags: ['Composite scoring', 'Source reliability', 'Emotional language index'],
  },
  {
    step: '05', icon: Microscope, color: '#F59E0B',
    title: 'Virality Risk Assessment',
    desc: 'Emotional appeal intensity, sensationalist language patterns, and structural shareability signals are analyzed to predict how likely false content is to spread across messaging platforms.',
    tags: ['Shareability signals', 'Emotional appeal', 'Platform patterns'],
  },
];

const METHODOLOGY_DEEPFAKE = [
  {
    step: '01', icon: ScanLine, color: '#EF4444',
    title: 'Multimodal Media Ingestion',
    desc: 'Media files (image, video, audio) are Base64-encoded and streamed directly to Gemini\'s multimodal API. All analysis happens on the server — files are not stored permanently.',
    tags: ['Base64 streaming', 'Multimodal API', 'On-server processing'],
  },
  {
    step: '02', icon: Cpu, color: '#F59E0B',
    title: 'Visual Content Analysis',
    desc: 'Gemini evaluates the visual content holistically — examining lighting consistency, facial geometry coherence, background-foreground blending, and perceptible compression artifacts.',
    tags: ['Visual coherence', 'Lighting analysis', 'Artifact detection'],
  },
  {
    step: '03', icon: Brain, color: '#7C3AED',
    title: 'Audio-Visual Synchronization Check',
    desc: 'For video content, Gemini analyzes whether audio characteristics (speech patterns, lip-sync timing, voice naturalness) align with visual content — a key signal in video deepfakes.',
    tags: ['Lip-sync analysis', 'Voice naturalness', 'A/V coherence'],
  },
  {
    step: '04', icon: FlaskConical, color: '#22D3EE',
    title: 'Contextual Manipulation Assessment',
    desc: 'Beyond pixel-level analysis, Gemini examines whether the stated or implied context of the media matches its actual content — detecting out-of-context media reuse, a common misinformation vector.',
    tags: ['Context integrity', 'Out-of-context detection', 'Semantic alignment'],
  },
];

const LIMITATIONS = [
  {
    icon: AlertTriangle, color: '#F59E0B',
    title: 'Not a forensic tool replacement',
    desc: 'Proofly\'s AI analysis cannot substitute for certified digital forensics performed by trained experts using specialized hardware tools. For legal proceedings or critical investigations, always engage professional forensic analysts.',
  },
  {
    icon: XCircle, color: '#EF4444',
    title: 'No live web verification',
    desc: 'Claim fact-checking is based on Gemini\'s training knowledge base, not live web searches. Claims about very recent events (within the past few weeks) may not be accurately verified.',
  },
  {
    icon: Info, color: '#4F8EFF',
    title: 'AI can be wrong',
    desc: 'Large language models can hallucinate plausible-sounding but incorrect information. A high Trust Score does not guarantee truth — always cross-verify critical claims with independent sources.',
  },
  {
    icon: AlertTriangle, color: '#7C3AED',
    title: 'Deepfake detection is probabilistic',
    desc: 'No AI system can detect all deepfakes with 100% accuracy. Sophisticated synthesis techniques continue to evolve faster than detection. Treat results as an informed signal, not a definitive verdict.',
  },
  {
    icon: Info, color: '#22D3EE',
    title: 'Cultural context limitations',
    desc: 'While Proofly is tuned for Indian languages and regional context, cultural nuances in deeply regional content may be missed. Community-based fact-checkers remain essential for local verification.',
  },
];

const FACT_CHECKERS = [
  { name: 'Alt News', url: 'https://www.altnews.in', desc: 'India\'s leading fact-checking organization', color: '#EF4444' },
  { name: 'BOOM Live', url: 'https://www.boomlive.in', desc: 'Award-winning fact-checking & media literacy', color: '#F59E0B' },
  { name: 'Snopes', url: 'https://www.snopes.com', desc: 'Global fact-checking reference since 1994', color: '#4F8EFF' },
  { name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check', desc: 'International news agency fact-check desk', color: '#22D3EE' },
  { name: 'WHO Mythbusters', url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters', desc: 'Health misinformation debunking', color: '#22C55E' },
  { name: 'Factly', url: 'https://factly.in', desc: 'India-focused data journalism & fact-checking', color: '#7C3AED' },
];

function MethodologyStep({ step, icon: Icon, color, title, desc, tags, index }: {
  step: string; icon: React.ElementType; color: string; title: string; desc: string; tags: string[]; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5 items-start group"
    >
      <div className="relative flex-shrink-0 z-10">
        <motion.div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}
          whileHover={{ boxShadow: `0 0 20px ${color}30` }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>
      <div className="flex-1 rounded-2xl p-5 transition-all duration-300"
        style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', border: '1px solid var(--glass-border)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}35`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md"
            style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
            {step}
          </span>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md border font-mono"
              style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ResearchPage() {
  return (
    <main className="min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D0D1F 0%, #0A0A0F 60%, #0A0D1A 100%)' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(79,142,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <motion.div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 9, repeat: Infinity }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 px-4 py-2 rounded-xl transition-all duration-200"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--bg-border)', background: 'var(--bg-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(79,142,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}>
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.15), rgba(239,68,68,0.10))', border: '1px solid rgba(79,142,255,0.3)', boxShadow: '0 0 24px rgba(79,142,255,0.10)' }}>
            <BookOpen className="w-3.5 h-3.5 text-[#4F8EFF]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#4F8EFF]">Methodology & Responsible AI</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="display-font font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', color: 'var(--text-primary)' }}>
            How Proofly{' '}
            <span className="gradient-text">reasons</span>
            <br />
            about truth.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A transparent account of how our AI pipeline works, what it can and cannot do,
            and how to interpret results responsibly.
          </motion.p>
        </div>
      </section>

      {/* ── MISINFORMATION METHODOLOGY ─────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(79,142,255,0.1)', border: '1px solid rgba(79,142,255,0.25)', color: '#4F8EFF' }}>
            <Shield className="w-3.5 h-3.5" /> Misinformation Detection
          </div>
          <h2 className="display-font text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            The 9-step <span className="gradient-text">fact-check pipeline</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            How Proofly processes text, URLs, and media content for misinformation signals.
          </p>
        </motion.div>
        <div className="relative space-y-4">
          <div className="absolute left-6 top-6 bottom-6 w-px hidden sm:block"
            style={{ background: 'linear-gradient(180deg, #4F8EFF 0%, #7C3AED 50%, #22D3EE 100%)', opacity: 0.2 }} />
          {METHODOLOGY_MISINFO.map((step, i) => (
            <MethodologyStep key={step.step} {...step} index={i} />
          ))}
        </div>
      </section>

      {/* ── DEEPFAKE METHODOLOGY ──────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
            <ScanLine className="w-3.5 h-3.5" /> Deepfake Detection
          </div>
          <h2 className="display-font text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            Multimodal{' '}
            <span style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>media forensics</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            How Proofly uses Gemini&apos;s multimodal reasoning to identify manipulation signals in media.
          </p>
        </motion.div>
        <div className="relative space-y-4">
          <div className="absolute left-6 top-6 bottom-6 w-px hidden sm:block"
            style={{ background: 'linear-gradient(180deg, #EF4444 0%, #7C3AED 100%)', opacity: 0.2 }} />
          {METHODOLOGY_DEEPFAKE.map((step, i) => (
            <MethodologyStep key={step.step} {...step} index={i} />
          ))}
        </div>
      </section>

      {/* ── AI LIMITATIONS ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B' }}>
            <AlertTriangle className="w-3.5 h-3.5" /> Responsible AI — Limitations
          </div>
          <h2 className="display-font text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            What Proofly <span style={{ color: '#F59E0B' }}>cannot</span> do
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Honest disclosure of AI limitations. Responsible use requires understanding these boundaries.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LIMITATIONS.map((lim, i) => {
            const Icon = lim.icon;
            return (
              <motion.div key={lim.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-5"
                style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', border: `1px solid ${lim.color}20` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${lim.color}15`, border: `1px solid ${lim.color}30`, color: lim.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{lim.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{lim.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── TRUSTED FACT-CHECKERS ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E' }}>
            <CheckCircle className="w-3.5 h-3.5" /> Verify With Experts
          </div>
          <h2 className="display-font text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            Always cross-verify with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22C55E, #22D3EE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>trusted sources</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI analysis should be a first-pass signal. For critical claims, these organizations provide human-expert verification.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACT_CHECKERS.map((fc, i) => (
            <motion.a
              key={fc.name}
              href={fc.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="flex items-start gap-4 rounded-2xl p-5 group cursor-pointer transition-all duration-300"
              style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', border: `1px solid ${fc.color}20` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${fc.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${fc.color}20`; }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
                style={{ background: `${fc.color}15`, border: `1px solid ${fc.color}30`, color: fc.color }}>
                {fc.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{fc.name}</h3>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{fc.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE LINK ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-10 text-center overflow-hidden"
          style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.05), rgba(124,58,237,0.05))' }} />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 8px 24px rgba(79,142,255,0.30)' }}>
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <h2 className="display-font text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              Interested in the technical architecture?
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Explore the infrastructure stack — Gemini 3.6 Flash, Neon Postgres, Netlify Edge, and the multimodal pipeline internals.
            </p>
            <Link href="/technology"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 4px 16px rgba(79,142,255,0.30)' }}>
              View Technology Deep Dive
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
