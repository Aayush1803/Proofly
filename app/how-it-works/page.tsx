'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Zap, Shield, FileText, Globe,
  Search, Brain, BarChart3, MessageSquare, CheckCircle2,
  ChevronDown, Share2, Plus,
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const STEPS = [
  { number: '01', icon: FileText, title: 'Input Collection', subtitle: 'Text, URL, or Media', desc: 'Submit any content — a news article URL, social media post, or even a video/image. Proofly accepts all three input types and auto-detects your preferred language.', color: '#4F8EFF', tags: ['Text', 'URL', 'Media'] },
  { number: '02', icon: Globe, title: 'Language Detection', subtitle: 'All 23 Official Indian Languages', desc: 'Our NLP layer automatically identifies the language from all 23 official Indian languages — including Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, and more. Indian code-mixed content (Hinglish, Tanglish) is handled with specialized tokenizers.', color: '#22D3EE', tags: ['NLP', 'Multilingual', 'Code-mix'] },
  { number: '03', icon: Search, title: 'Claims Extraction', subtitle: 'Identifying checkable assertions', desc: 'Our model breaks down the content into individual, verifiable claims. Each sentence is analyzed for factual assertions vs. opinions, filtering out what can and cannot be fact-checked.', color: '#7C3AED', tags: ['Semantic NLP', 'Claim detection'] },
  { number: '04', icon: Brain, title: 'Fact Verification', subtitle: 'Cross-referencing trusted logic', desc: 'Each extracted claim is analyzed by our advanced Gemini 2.5 Flash engine. It cross-references internal knowledge and logical consistency to determine the veracity of each claim.', color: '#F59E0B', tags: ['Gemini 2.5', 'Verification', 'Logic Engine'] },
  { number: '05', icon: BarChart3, title: 'Trust Scoring', subtitle: '0–100 confidence index', desc: 'Every analysis produces a Trust Score from 0 to 100 based on source credibility, claim verifiability, and signs of manipulation. Scores below 35 indicate high misinformation risk.', color: '#22C55E', tags: ['AI Scoring', 'Confidence Index'] },
  { number: '06', icon: Share2, title: 'Virality Risk', subtitle: 'Predicting spread potential', desc: 'Our AI model analyzes emotional language, sensationalism level, and visual clickbait factors to predict how likely false content is to go viral across messaging platforms.', color: '#EF4444', tags: ['Spread analysis', 'Risk prediction'] },
  { number: '07', icon: Globe, title: 'Context Analysis', subtitle: 'Regional & cultural framing', desc: 'Content is analyzed for regional targeting, cultural amplification vectors, and communal sensitivity — especially important for India\'s diverse linguistic and cultural landscape.', color: '#818CF8', tags: ['Regional', 'Cultural', 'Sensitivity'] },
  { number: '08', icon: MessageSquare, title: 'Counter-Message', subtitle: 'AI-generated factual response', desc: 'Proofly generates a ready-to-share counter-message in your detected language that you can paste directly into any chat or social media to correct misinformation in your network.', color: '#22D3EE', tags: ['Multilingual', 'AI Generated'] },
  { number: '09', icon: CheckCircle2, title: 'Full Report', subtitle: 'Detailed analysis dashboard', desc: 'Every analysis generates a comprehensive report with claim-by-claim verdicts, manipulation indicators, ELI10 explanations for non-technical users, and an overall trustworthiness summary.', color: '#4F8EFF', tags: ['Dashboard', 'ELI10', 'Indicators'] },
];

const INPUT_TYPES = [
  { icon: '💬', title: 'Text', desc: 'Paste any text — social media posts, news excerpts, or any written content.', example: '"Drinking lemon water at midnight cures diabetes..."', color: '#4F8EFF', wide: true },
  { icon: '🔗', title: 'URL', desc: 'Share a link and Proofly will fetch, read, and analyze the article automatically. Even works on YouTube videos!', example: 'https://youtube.com/watch?v=viral-video', color: '#22D3EE', wide: false },
  { icon: '📸', title: 'Media', desc: 'Upload images, screenshots, audio clips, PDFs, or reference a video. Our multimodal AI reads and listens.', example: 'screenshot.jpg · viral_video.mp4', color: '#7C3AED', wide: false },
];

const FAQS = [
  { q: 'Is Proofly free to use?', a: 'Yes. The core fact-checking tool is completely free. We believe access to truth should not be paywalled.' },
  { q: 'How accurate is Proofly?', a: 'Proofly is powered by Google Gemini 2.5 Flash, an advanced multimodal reasoning engine. While highly sophisticated, AI can hallucinate. Always verify critical claims with real fact-checkers like Alt News, BOOM Live, or Reuters.' },
  { q: 'Does Proofly store my content?', a: 'We do not share your submitted content with third parties. Analysis history is stored securely in our Neon Serverless Database for your reference within your profile only.' },
  { q: 'Which languages does Proofly support?', a: 'Proofly supports all 23 official Indian languages listed in the 8th Schedule — including Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, and more. Code-mixed variants like Hinglish and Tanglish are also handled.' },
  { q: 'Can I use Proofly for journalism?', a: 'Absolutely. Proofly is designed to assist journalists and researchers. We offer API access for newsrooms — contact us for details.' },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${open ? 'rgba(79,142,255,0.3)' : 'var(--bg-border)'}`, background: open ? 'rgba(79,142,255,0.04)' : 'var(--glass-bg)', transition: 'border-color 0.3s, background 0.3s' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: open ? 'rgba(79,142,255,0.2)' : 'var(--bg-secondary)', border: `1px solid ${open ? 'rgba(79,142,255,0.4)' : 'var(--bg-border)'}` }}
          >
            <Shield className="w-3 h-3" style={{ color: open ? '#4F8EFF' : 'var(--text-muted)' }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{q}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: open ? '#4F8EFF' : 'var(--text-muted)' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-5 pl-14">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D0D1F 0%, #0A0A0F 60%, #0A0D1A 100%)' }} />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 px-4 py-2 rounded-xl transition-all duration-200 group" style={{ color: 'var(--text-muted)', border: '1px solid var(--bg-border)', background: 'var(--bg-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(79,142,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(79,142,255,0.3)', boxShadow: '0 0 24px rgba(79,142,255,0.12)' }}
          >
            <Zap className="w-3.5 h-3.5 text-[#4F8EFF]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#4F8EFF]">The Pipeline</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="display-font font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: 'var(--text-primary)' }}
          >
            <span className="gradient-text">9 steps</span> to the truth
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every piece of content goes through Proofly&apos;s full AI pipeline —
            from ingestion to a shareable counter-message — in under 5 seconds.
          </motion.p>
        </div>
      </section>

      {/* ── WHAT CAN YOU ANALYZE ─────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(79,142,255,0.1)', border: '1px solid rgba(79,142,255,0.25)', color: '#4F8EFF' }}
          >
            <Plus className="w-3 h-3" />
            Input Types
          </div>
          <h2 className="display-font text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            What can you <span className="gradient-text">analyze?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Three ways to submit content for fact-checking.</p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
          {INPUT_TYPES.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="relative p-6 rounded-2xl overflow-hidden"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(18px)',
                border: `1px solid ${t.color}22`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.color}60, transparent)` }} />
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none" style={{ background: `${t.color}12`, filter: 'blur(20px)' }} />

              <div className="text-4xl mb-5">{t.icon}</div>
              <h3 className="font-black text-xl mb-2" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
              <div className="rounded-xl px-3 py-2.5" style={{ background: 'var(--bg-primary)', border: '1px solid var(--bg-border)' }}>
                <p className="text-xs font-mono truncate" style={{ color: 'var(--text-muted)' }}>{t.example}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── PIPELINE STEPS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#7C3AED' }}
          >
            <Zap className="w-3 h-3" />
            The Pipeline
          </div>
          <h2 className="display-font text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            The <span className="gradient-text">9-step pipeline</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>How Proofly processes every piece of content.</p>
        </motion.div>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4, transition: { duration: 0.25 } }}
                className="group relative flex gap-5 items-start p-5 rounded-2xl transition-all duration-300"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(18px)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${step.color}35`; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${step.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)'; }}
              >
                {/* Step icon */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300" style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black font-mono" style={{ color: 'var(--text-muted)' }}>{step.number}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                    <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{step.subtitle}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg font-mono"
                        style={{ color: step.color, borderColor: `${step.color}30`, background: `${step.color}10`, border: `1px solid ${step.color}25` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right accent */}
                <div className="w-0.5 self-stretch rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                  style={{ background: `linear-gradient(180deg, ${step.color}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22D3EE' }}
          >
            <Shield className="w-3 h-3" />
            FAQs
          </div>
          <h2 className="display-font text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} index={i} />)}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-14 text-center overflow-hidden"
          style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.06) 0%, rgba(124,58,237,0.06) 50%, rgba(34,211,238,0.04) 100%)' }} />
          <motion.div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />

          <div className="relative z-10">
            <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 8px 32px rgba(79,142,255,0.35)' }}
              animate={{ boxShadow: ['0 8px 32px rgba(79,142,255,0.25)', '0 8px 48px rgba(79,142,255,0.5)', '0 8px 32px rgba(79,142,255,0.25)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="display-font text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Try it now — <span className="gradient-text">free</span>
            </h2>
            <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              No credit card needed. Analyze your first claim in under 30 seconds.
            </p>
            <Link href="/?mode=signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 4px 24px rgba(79,142,255,0.35)' }}
            >
              <Zap className="w-4 h-4" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
