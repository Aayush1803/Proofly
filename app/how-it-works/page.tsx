'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Zap, Shield, FileText, Globe,
  Search, Brain, BarChart3, MessageSquare, CheckCircle2,
  Share2, ChevronDown, ArrowRight,
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const STEPS = [
  { number: '01', icon: FileText,      title: 'Input Collection',    subtitle: 'Text, URL, or Media',                      color: '#4F8EFF', tags: ['Text', 'URL', 'Media'],               desc: 'Paste a message, drop a link, or upload a screenshot or video. Proofly takes whatever you have — text from a family WhatsApp group, a YouTube link, or a photo of a poster — and figures out what to do with it.' },
  { number: '02', icon: Globe,         title: 'Language Detection',  subtitle: 'All 23 Official Indian Languages',          color: '#22D3EE', tags: ['NLP', 'Multilingual', 'Code-mix'],    desc: 'Your input is identified by language automatically. Hindi, Tamil, Marathi, Urdu, Hinglish — you don’t need to select anything. The analysis runs in English internally and the verdict comes back in your language.' },
  { number: '03', icon: Search,        title: 'Claims Extraction',   subtitle: 'Identifying checkable assertions',          color: '#7C3AED', tags: ['Semantic NLP', 'Claim detection'],    desc: 'Not everything in a message is a claim. “I heard from my uncle” is not a fact. “Orange juice cures dengue” is. Proofly separates opinion, context, and hearsay from the actual checkable assertions.' },
  { number: '04', icon: Brain,         title: 'Fact Verification',   subtitle: 'Cross-referencing trusted logic',           color: '#F59E0B', tags: ['Gemini 3', 'Verification'],           desc: 'Each claim is checked against established science, government data, and known facts. The model flags contradictions and inconsistencies without making stuff up — if it’s uncertain, it says so.' },
  { number: '05', icon: BarChart3,     title: 'Trust Scoring',       subtitle: '0–100 confidence index',                   color: '#22C55E', tags: ['AI Scoring', 'Confidence Index'],     desc: 'A number from 0 to 100 that captures overall credibility. Below 35 means high misinformation risk. Above 65 means the content checks out. The score is calculated from four independent dimensions, not just one.' },
  { number: '06', icon: Share2,        title: 'Virality Risk',       subtitle: 'Predicting spread potential',               color: '#EF4444', tags: ['Spread analysis', 'Risk prediction'],  desc: 'Some false claims go viral because they’re scary or emotionally charged. Proofly measures how likely a piece of content is to spread — based on its language, framing, and emotional manipulation signals.' },
  { number: '07', icon: Globe,         title: 'Context Analysis',    subtitle: 'Regional & cultural framing',               color: '#818CF8', tags: ['Regional', 'Cultural', 'Sensitivity'], desc: 'The same false claim can land very differently in Kerala vs Punjab. Proofly notes regional targeting, communal framing, and cultural sensitivity factors that affect how dangerous a claim actually is.' },
  { number: '08', icon: MessageSquare, title: 'Counter-Message',     subtitle: 'Ready-to-share factual reply',              color: '#22D3EE', tags: ['Multilingual', 'Copy-ready'],         desc: 'You get a factual, polite reply you can copy and paste directly back into the WhatsApp group — in the same language as the original message. No need to write anything yourself.' },
  { number: '09', icon: CheckCircle2,  title: 'Full Report',         subtitle: 'Detailed analysis dashboard',              color: '#4F8EFF', tags: ['Dashboard', 'ELI10', 'Indicators'],  desc: 'The final report breaks down every claim individually, shows the trust breakdown, gives an ELI10 explanation for non-technical readers, and lists the sources that informed the verdict.' },
];

const INPUT_TYPES = [
  { emoji: '💬', title: 'Text',  color: '#4F8EFF', desc: 'Paste any text — social media posts, news excerpts, or any written content.',                                            example: '"Drinking lemon water at midnight cures diabetes..."' },
  { emoji: '🔗', title: 'URL',   color: '#22D3EE', desc: 'Share a link and Proofly fetches and analyzes the page automatically. Even works on YouTube by extracting transcripts!', example: 'https://youtube.com/watch?v=viral-video' },
  { emoji: '📸', title: 'Media', color: '#7C3AED', desc: 'Upload images, screenshots, audio clips, or PDFs. Our multimodal AI reads and listens to the raw content.',              example: 'screenshot.jpg · viral_video.mp4 · audio.m4a' },
];

const FAQS = [
  { q: 'Is Proofly free?',                      a: 'Yes, completely free. The core fact-checking tool will stay free. We think access to accurate information shouldn’t cost money.' },
  { q: 'How accurate is it?',                   a: 'Proofly uses Gemini 3 Flash, one of the most capable reasoning models available. It’s accurate on established facts but can be wrong on recent events or ambiguous claims. Always treat it as a starting point, not a final verdict.' },
  { q: 'Does Proofly store my messages?',       a: 'Your analysis history is stored securely so you can revisit it in your profile. We do not sell, share, or use your content to train models.' },
  { q: 'Which languages are supported?',        a: 'All 23 official Indian languages: Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Maithili, Sanskrit, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, and Santali. Hinglish and Tanglish too.' },
  { q: 'Can journalists use Proofly?',          a: 'Yes. It’s designed to be useful to journalists, researchers, and educators. If you need API access for a newsroom or publication, reach out to us.' },
];

function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#4F8EFF' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{q}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-5 pt-1 pl-12">
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
    <main className="min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D0D1F 0%, #0A0A0F 60%, #0A0D1A 100%)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(79,142,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Glow blobs */}
        <motion.div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
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
            style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(79,142,255,0.3)', boxShadow: '0 0 24px rgba(79,142,255,0.12)' }}>
            <Zap className="w-3.5 h-3.5 text-[#4F8EFF]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#4F8EFF]">The Pipeline</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="display-font font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: 'var(--text-primary)' }}>
            9 steps to the{' '}
            <span className="gradient-text">truth</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}>
            Every piece of content goes through Proofly&apos;s full AI pipeline — from ingestion to a shareable counter-message — in under 5 seconds.
          </motion.p>
        </div>
      </section>

      {/* ── INPUT TYPES ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(79,142,255,0.1)', border: '1px solid rgba(79,142,255,0.25)', color: '#4F8EFF' }}>
            Input Modes
          </div>
          <h2 className="display-font text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>What can you analyze?</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Three ways to submit content for fact-checking.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {INPUT_TYPES.map((t, i) => (
            <motion.div key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', border: `1px solid ${t.color}22`, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', willChange: 'transform' }}>
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.color}80, transparent)` }} />

              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
                {t.emoji}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
              <div className="rounded-xl px-3 py-2.5 font-mono text-xs truncate"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--bg-border)', color: t.color }}>
                {t.example}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PIPELINE TIMELINE ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#7C3AED' }}>
            AI Pipeline
          </div>
          <h2 className="display-font text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>The 9-step pipeline</h2>
          <p style={{ color: 'var(--text-secondary)' }}>How Proofly processes every piece of content, step by step.</p>
        </motion.div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-6 bottom-6 w-px hidden sm:block"
            style={{ background: 'linear-gradient(180deg, #4F8EFF 0%, #7C3AED 50%, #22D3EE 100%)', opacity: 0.25 }} />

          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4 }}
                  className="relative flex gap-5 items-start group"
                >
                  {/* Step icon (also acts as timeline dot) */}
                  <div className="relative flex-shrink-0 z-10">
                    <motion.div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${step.color}18`, border: `1px solid ${step.color}35`, color: step.color, boxShadow: `0 0 0 0 ${step.color}00` }}
                      whileHover={{ boxShadow: `0 0 20px ${step.color}30` }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-2xl p-5 transition-all duration-300"
                    style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', border: '1px solid var(--glass-border)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${step.color}35`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md"
                        style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}>
                        {step.number}
                      </span>
                      <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{step.subtitle}</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md border font-mono"
                          style={{ color: step.color, borderColor: `${step.color}30`, background: `${step.color}10` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22D3EE' }}>
            FAQ
          </div>
          <h2 className="display-font text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Frequently asked questions</h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.06), rgba(124,58,237,0.06))' }} />
          <motion.div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity }} />
          <div className="relative z-10">
            <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 8px 32px rgba(79,142,255,0.35)' }}
              animate={{ boxShadow: ['0 8px 32px rgba(79,142,255,0.25)', '0 8px 48px rgba(79,142,255,0.5)', '0 8px 32px rgba(79,142,255,0.25)'] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="display-font text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Try it now — <span className="gradient-text">free</span>
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              No credit card needed. Analyze your first claim in under 30 seconds.
            </p>
            <Link href="/?mode=signup"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 4px 24px rgba(79,142,255,0.35)' }}>
              <Zap className="w-4 h-4" /> Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
