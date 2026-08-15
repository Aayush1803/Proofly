'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Cpu, Database, Lock, Globe, Server, Layers, Shield, CheckCircle } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TECH_PILLARS = [
  {
    icon: Cpu,
    title: 'Gemini 2.5 Flash AI Engine',
    color: '#4F8EFF',
    size: 'lg', // wider card
    desc: 'At the heart of Proofly lies Google Gemini 2.5 Flash, accessed via the GenerativeLanguage API. We stream Base64-encoded images, video, audio, and documents directly to Gemini — native multimodal capability that evaluates visual context, spoken tone, and on-screen text holistically.',
    details: ['Direct Base64 multimodal streaming', 'Native MP4, MP3, JPEG, PDF support', 'Simultaneous visual + audio analysis', 'Sub-5s reasoning for complex content'],
  },
  {
    icon: Globe,
    title: '23-Language NLP',
    color: '#22D3EE',
    size: 'sm',
    desc: 'Detects and parses all 23 official Indian languages including code-mixed Hinglish and Tanglish without losing factual fidelity.',
    details: ['Hindi, Bengali, Tamil, Telugu...', 'Devanagari & regional scripts', 'Sentiment-aware detection'],
  },
  {
    icon: Server,
    title: 'Netlify Edge Serverless',
    color: '#7C3AED',
    size: 'sm',
    desc: 'Optimized Next.js 14 App Router on Netlify Edge Serverless Functions — horizontal scaling with minimal cold-boot latency.',
    details: ['Global edge routing', 'Extended 60s timeouts for media', 'No monolithic bottlenecks'],
  },
  {
    icon: Database,
    title: 'Neon Postgres + Prisma ORM',
    color: '#F59E0B',
    size: 'sm',
    desc: 'Neon Serverless Postgres scales to zero and allocates resources dynamically. Prisma ORM enforces strict TypeScript safety.',
    details: ['Instant auto-scaling', 'End-to-end type safety', 'Secure connection pooling'],
  },
  {
    icon: Layers,
    title: 'Cheerio Web Scraper',
    color: '#EF4444',
    size: 'sm',
    desc: 'Custom Cheerio scraper strips digital noise using 15+ semantic HTML selectors. YouTube captions extracted via TimedText XML API.',
    details: ['Semantic HTML fallbacks', 'YouTube caption extraction', 'User-Agent rotation'],
  },
  {
    icon: Lock,
    title: 'NextAuth Security',
    color: '#22C55E',
    size: 'lg',
    desc: 'Identity governed by NextAuth.js — Google OAuth2 SSO and secure Credentials provider. Passwords hashed with bcrypt (Cost Factor 12) for complete brute-force protection.',
    details: ['Google OAuth2 SSO', 'bcrypt CF-12 hashing', 'Environment variable protection', 'Stateful session lifecycle'],
  },
];

const STACK_BADGES = [
  { label: 'Next.js 14', color: '#4F8EFF' },
  { label: 'React 18',   color: '#22D3EE' },
  { label: 'TypeScript 5', color: '#7C3AED' },
  { label: 'Tailwind CSS v4', color: '#F59E0B' },
  { label: 'Framer Motion', color: '#EF4444' },
  { label: 'Gemini 2.5 Flash', color: '#4F8EFF' },
  { label: 'Neon Postgres', color: '#22C55E' },
  { label: 'Prisma ORM', color: '#7C3AED' },
  { label: 'NextAuth.js', color: '#22D3EE' },
  { label: 'Cheerio', color: '#F59E0B' },
  { label: 'Netlify Edge', color: '#EF4444' },
  { label: 'bcryptjs', color: '#22C55E' },
];

const PERF = [
  { label: 'Avg. response', value: '<5s',  sub: 'Full 9-step pipeline',       color: '#4F8EFF' },
  { label: 'Languages',      value: '23',   sub: 'Official Indian languages',   color: '#22D3EE' },
  { label: 'Input types',    value: '5+',   sub: 'Text · URL · Image · Audio',  color: '#7C3AED' },
  { label: 'Uptime',         value: '99%',  sub: 'Netlify Edge SLA',            color: '#22C55E' },
];

const FLOW_NODES = [
  { label: 'Input\n(Text/URL/Media)',  color: '#4F8EFF' },
  { label: 'Netlify\nEdge API',        color: '#7C3AED' },
  { label: 'Cheerio\nScraper',         color: '#F59E0B' },
  { label: 'Gemini 2.5\nFlash',        color: '#22D3EE' },
  { label: 'Streamed\nReport',          color: '#22C55E' },
];

export default function TechnologyPage() {
  return (
    <main className="min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D0D1F 0%, #0A0A0F 50%, #0D0A1A 100%)' }} />

        {/* Circuit-grid overlay */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Glow blobs */}
        <motion.div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 10, repeat: Infinity }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 px-4 py-2 rounded-xl transition-all duration-200"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--bg-border)', background: 'var(--bg-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}>
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,142,255,0.15))', border: '1px solid rgba(124,58,237,0.35)', boxShadow: '0 0 24px rgba(124,58,237,0.12)' }}>
            <Cpu className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#7C3AED]">Architecture Deep Dive</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="display-font font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: 'var(--text-primary)' }}>
            Engineered for{' '}
            <span className="gradient-text">extreme scale</span>
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>and precision.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}>
            Proofly combines serverless primitives across Netlify and Neon with the bleeding-edge reasoning of Google Gemini 2.5 — infrastructure built to fight misinformation in real-time.
          </motion.p>
        </div>
      </section>

      {/* ── PERF STATS ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PERF.map((p, i) => (
            <motion.div key={p.label}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl overflow-hidden"
              style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', border: `1px solid ${p.color}22`, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
                style={{ background: `${p.color}12`, filter: 'blur(20px)' }} />
              <div className="display-font font-black leading-none mb-2" style={{ color: p.color, fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>{p.value}</div>
              <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{p.label}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{p.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BENTO TECH PILLARS ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(79,142,255,0.1)', border: '1px solid rgba(79,142,255,0.25)', color: '#4F8EFF' }}>
            Infrastructure
          </div>
          <h2 className="display-font text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            Core <span className="gradient-text">Infrastructure Pillars</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>The foundational systems enabling rapid, accurate multimodal analysis.</p>
        </motion.div>

        {/* Bento grid: lg cards span 2 cols, sm cards span 1 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_PILLARS.map((p, i) => {
            const Icon = p.icon;
            const isLg = p.size === 'lg';
            return (
              <motion.div key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl p-6 overflow-hidden group ${isLg ? 'md:col-span-2 lg:col-span-1' : ''}`}
                style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', border: `1px solid ${p.color}22`, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', willChange: 'transform' }}>

                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${p.color}80, transparent)` }} />

                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top left, ${p.color}08 0%, transparent 60%)` }} />

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color, boxShadow: `0 0 16px ${p.color}10` }}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-bold text-base mb-3" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>

                {/* Detail chips */}
                <ul className="space-y-1.5">
                  {p.details.map(d => (
                    <li key={d} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: p.color }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── TECH STACK BADGES ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22D3EE' }}>
            Tech Stack
          </div>
          <h2 className="display-font text-3xl font-black" style={{ color: 'var(--text-primary)' }}>The Complete Stack</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex flex-wrap gap-3">
          {STACK_BADGES.map((b, i) => (
            <motion.span key={b.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2, scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-mono cursor-default"
              style={{ background: `${b.color}12`, border: `1px solid ${b.color}30`, color: b.color }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: b.color }} />
              {b.label}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* ── DATA FLOW DIAGRAM ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl p-10 overflow-hidden"
          style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>

          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.04), rgba(124,58,237,0.04))' }} />

          <h2 className="display-font text-2xl font-black text-center mb-10" style={{ color: 'var(--text-primary)' }}>
            Data Flow Pipeline
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {FLOW_NODES.map((node, i) => (
              <div key={i} className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ scale: 1.06 }}
                  className="px-5 py-3 rounded-xl text-center text-xs font-bold font-mono leading-relaxed whitespace-pre"
                  style={{ background: `${node.color}12`, border: `1px solid ${node.color}40`, color: node.color, boxShadow: `0 4px 16px ${node.color}12` }}>
                  {node.label}
                </motion.div>
                {i < FLOW_NODES.length - 1 && (
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.06 }}>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] font-mono mt-8" style={{ color: 'var(--text-muted)' }}>
            Full execution completes via stateless Netlify Edge Functions · &lt;5s end-to-end
          </p>
        </motion.div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl p-14 text-center overflow-hidden"
          style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,142,255,0.08))' }} />
          <motion.div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity }} />

          <div className="relative z-10">
            <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #4F8EFF)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}
              animate={{ boxShadow: ['0 8px 32px rgba(124,58,237,0.25)', '0 8px 48px rgba(124,58,237,0.5)', '0 8px 32px rgba(124,58,237,0.25)'] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <Shield className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="display-font text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Experience the technology <span className="gradient-text">natively</span>
            </h2>
            <p className="text-base mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Submit any claim, paste a complex URL, or upload raw media. Watch the serverless Gemini-powered pipeline dissect and analyze it in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/?mode=signup"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F8EFF)', boxShadow: '0 4px 24px rgba(124,58,237,0.35)' }}>
                <Zap className="w-4 h-4" /> Initialize Proofly Engine <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--bg-border)', background: 'var(--bg-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}>
                How It Works
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
