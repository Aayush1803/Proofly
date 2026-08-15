'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Cpu, Database, Lock, Globe, Server, Layers, Code, GitMerge, Fingerprint } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TECH_PILLARS = [
  {
    icon: Cpu,
    title: 'Native Multimodal AI Engine',
    color: '#4F8EFF',
    desc: 'At the heart of Proofly lies Google Gemini 2.5 Flash. We bypass fragmented OCR or transcription pipelines, streaming Base64-encoded media directly to the model for holistic, unified reasoning.',
    details: [
      'Zero-loss Base64 multimodal streaming',
      'Native handling of MP4, MP3, JPEG, PDF',
      'Simultaneous analysis of visual manipulation and spoken claims',
    ],
  },
  {
    icon: Globe,
    title: '23-Language NLP & Context',
    color: '#22D3EE',
    desc: 'Misinformation thrives in regional echo chambers. Proofly possesses deep linguistic intelligence to automatically detect, parse, and analyze all 23 official Indian languages and code-mixed colloquialisms.',
    details: [
      'Support for Hindi, Bengali, Tamil, Telugu, Marathi, etc.',
      'Handles complex scripts: Devanagari, Latin, regional graphemes',
      'Sentiment-aware detection of culturally sensitive keywords',
    ],
  },
  {
    icon: Server,
    title: 'Edge Serverless Execution',
    color: '#7C3AED',
    desc: 'Proofly operates on a highly optimized Next.js 14 App Router architecture deployed exclusively on Netlify. Transitioning to Edge Serverless Functions provided unparalleled horizontal scaling.',
    details: [
      'Optimized serverless deployment for global edge routing',
      'Extended serverless timeouts (60s) for heavy media',
      'Eliminated monolithic bottlenecks of container systems',
    ],
  },
  {
    icon: Database,
    title: 'Neon Serverless Postgres',
    color: '#F59E0B',
    desc: 'By decoupling storage and compute, Neon allows our database to instantly scale to zero and dynamically allocate resources based on traffic spikes, managed entirely through Prisma ORM.',
    details: [
      'Neon.tech Serverless PostgreSQL architecture',
      'Prisma ORM for strict end-to-end type safety',
      'Instant auto-scaling and connection pooling at the edge',
    ],
  },
  {
    icon: Layers,
    title: 'Intelligent Scraping',
    color: '#EF4444',
    desc: 'Proofly employs a custom-built, highly aggressive web scraper using Cheerio and the Node.js Fetch API. It strips away digital noise using 15+ semantic HTML fallback selectors.',
    details: [
      'Cheerio-powered semantic HTML noise removal',
      'YouTube TimedText XML caption metadata extraction',
      'Simulated User-Agent rotation to bypass bot screens',
    ],
  },
  {
    icon: Lock,
    title: 'Enterprise-Grade Security',
    color: '#22C55E',
    desc: 'Identity and session management are governed by NextAuth.js. We provide seamless Google SSO integration alongside a highly secure Credentials provider with bcrypt hashing (Cost Factor 12).',
    details: [
      'NextAuth.js stateful/stateless session management',
      'Google Cloud Console OAuth2 seamless SSO',
      'Strict environment variable protection across pipeline',
    ],
  },
];

const STACK = [
  { category: 'Frontend Layer', items: ['Next.js 14 (App Router)', 'React 18', 'TypeScript 5', 'Tailwind CSS v4', 'Framer Motion v10'] },
  { category: 'Backend Orchestration', items: ['Next.js Serverless APIs', 'NextAuth.js (Auth.js)', 'Cheerio Web Scraper', 'Node.js native Fetch'] },
  { category: 'Database & Data', items: ['Neon Serverless Postgres', 'Prisma ORM', 'Prisma Connection Pooling', 'bcryptjs Cryptography'] },
  { category: 'AI & Cloud Infra', items: ['Google Gemini API (2.5)', 'Netlify Edge Deployment', 'Railway (Prototyping)', 'YouTube Caption XML API'] },
];

export default function TechnologyPage() {
  return (
    <main className="min-h-screen pb-0" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0A0A0F 0%, #0D0D1F 50%, #0A0D1A 100%)' }} />
        
        {/* Animated grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-50%)',
            transformOrigin: 'top center',
          }}
        />

        <motion.div
          className="absolute top-0 right-1/4 w-[600px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 px-4 py-2 rounded-xl transition-all duration-200 group" style={{ color: 'var(--text-muted)', border: '1px solid var(--bg-border)', background: 'var(--bg-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,142,255,0.15))', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 0 24px rgba(124,58,237,0.12)' }}
          >
            <Cpu className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#7C3AED]">Architectural Deep Dive</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="display-font font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: 'var(--text-primary)' }}
          >
            Engineered for <span className="gradient-text">scale</span><br />and precision.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            By combining serverless primitives across Netlify and Neon with the bleeding-edge reasoning capabilities of Google Gemini 2.5, we have constructed an infrastructure capable of combating misinformation in real-time.
          </motion.p>
        </div>
      </section>

      {/* ── STATS TICKER ───────────────────────────────────────── */}
      <div className="w-full border-y overflow-hidden flex whitespace-nowrap bg-black/40 py-4" style={{ borderColor: 'var(--bg-border)' }}>
        <motion.div
          className="flex items-center gap-16"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
        >
          {Array(4).fill(null).flatMap((_, i) => [
            <span key={`t1-${i}`} className="text-[#8A8AA0] font-mono text-sm tracking-widest uppercase"><span className="text-[#4F8EFF] mr-2">AVG RES:</span> {'<5s'} E2E</span>,
            <span key={`t2-${i}`} className="text-[#8A8AA0] font-mono text-sm tracking-widest uppercase"><span className="text-[#22D3EE] mr-2">LANGUAGES:</span> 23 NATIVE</span>,
            <span key={`t3-${i}`} className="text-[#8A8AA0] font-mono text-sm tracking-widest uppercase"><span className="text-[#7C3AED] mr-2">DB:</span> SERVERLESS POSTGRES</span>,
            <span key={`t4-${i}`} className="text-[#8A8AA0] font-mono text-sm tracking-widest uppercase"><span className="text-[#F59E0B] mr-2">INPUT:</span> MULTIMODAL</span>,
          ])}
        </motion.div>
      </div>

      {/* ── TECH PILLARS ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <h2 className="display-font text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Core Infrastructure <span className="gradient-text">Pillars</span></h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>The foundational systems that enable rapid, highly accurate multimodal analysis without infrastructure bottlenecks.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {TECH_PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative p-8 rounded-3xl overflow-hidden transition-all duration-300"
                style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${pillar.color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              >
                {/* Glow Halo */}
                <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${pillar.color}15 0%, transparent 70%)`, filter: 'blur(20px)' }} />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110" style={{ background: `${pillar.color}15`, color: pillar.color, border: `1px solid ${pillar.color}30` }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-2xl mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>{pillar.title}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{pillar.desc}</p>
                  
                  <ul className="space-y-3">
                    {pillar.details.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: pillar.color, boxShadow: `0 0 8px ${pillar.color}` }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── ARCHITECTURE FLOW ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] p-12 relative overflow-hidden"
          style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.05) 0%, rgba(124,58,237,0.05) 100%)' }} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-10">
              <GitMerge className="w-6 h-6 text-[#4F8EFF]" />
              <h2 className="display-font text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Data Flow & Processing Pipeline</h2>
            </div>
            
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4">
              {[
                { label: 'Multimodal Input', bg: '#4F8EFF', icon: Fingerprint },
                { label: '→', bg: 'none', icon: null },
                { label: 'Netlify Edge API', bg: '#7C3AED', icon: Server },
                { label: '→', bg: 'none', icon: null },
                { label: 'Cheerio / Base64', bg: '#F59E0B', icon: Code },
                { label: '→', bg: 'none', icon: null },
                { label: 'Gemini 2.5 Flash', bg: '#22D3EE', icon: Cpu },
                { label: '→', bg: 'none', icon: null },
                { label: 'Client-Side Stream', bg: '#22C55E', icon: Zap },
              ].map((node, i) => (
                node.bg === 'none' ? (
                  <span key={i} className="text-2xl font-black opacity-30 md:rotate-0 rotate-90" style={{ color: 'var(--text-muted)' }}>→</span>
                ) : (
                  <div key={i} className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-xl"
                    style={{ background: `${node.bg}12`, border: `1px solid ${node.bg}40`, color: node.bg, boxShadow: `0 8px 24px ${node.bg}20` }}
                  >
                    {node.icon && <node.icon className="w-4 h-4" />}
                    {node.label}
                  </div>
                )
              ))}
            </div>
            
            <p className="text-center text-xs mt-10 font-mono px-6 py-3 rounded-full mx-auto inline-block border"
              style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--text-muted)', borderColor: 'var(--bg-border)' }}
            >
              Full architectural execution completes securely via stateless Netlify Edge Functions.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── THE COMPLETE STACK ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <h2 className="display-font text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>The Complete <span className="gradient-text">Stack</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STACK.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}
            >
              <div className="absolute top-0 left-0 w-full h-1 opacity-60" style={{ background: 'linear-gradient(90deg, #4F8EFF, #7C3AED)' }} />
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 font-mono" style={{ color: '#4F8EFF' }}>
                {group.category}
              </h3>
              <ul className="space-y-4">
                {group.items.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#7C3AED', boxShadow: '0 0 6px #7C3AED' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
