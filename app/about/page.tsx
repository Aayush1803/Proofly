'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowLeft, Heart, Globe, Target, Award, Zap, Lock, Scale, Users } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const STATS = [
  { value: '23',     label: 'Languages Supported', icon: Globe,  color: '#4F8EFF' },
  { value: '9-Step', label: 'Analysis Pipeline',   icon: Award,  color: '#7C3AED' },
  { value: 'Free',   label: 'Always Free',          icon: Target, color: '#22D3EE' },
  { value: 'Open',   label: 'Open Source',          icon: Heart,  color: '#22C55E' },
];

const VALUES = [
  {
    icon: Globe,
    emoji: '🇮🇳',
    title: 'India First',
    desc: 'Built specifically for the Indian information ecosystem — regional languages, cultural context, and local fact-checkers.',
    color: '#4F8EFF',
    gradient: 'from-[#4F8EFF]/20 to-[#4F8EFF]/5',
  },
  {
    icon: Lock,
    emoji: '🔓',
    title: 'Transparency',
    desc: 'Every analysis shows exactly which sources were checked and why a claim was flagged. No black boxes.',
    color: '#22D3EE',
    gradient: 'from-[#22D3EE]/20 to-[#22D3EE]/5',
  },
  {
    icon: Scale,
    emoji: '⚖️',
    title: 'Non-Partisan',
    desc: 'We fact-check across the political spectrum. Our only bias is towards evidence and verified sources.',
    color: '#7C3AED',
    gradient: 'from-[#7C3AED]/20 to-[#7C3AED]/5',
  },
  {
    icon: Users,
    emoji: '🤝',
    title: 'Community',
    desc: 'We partner with grassroots journalists and local fact-checkers to stay accurate on ground realities.',
    color: '#22C55E',
    gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
  },
];

const FEATURES = [
  { icon: '🧠', label: 'Gemini 2.5 Flash AI' },
  { icon: '🗺️', label: '23 Indian Languages' },
  { icon: '⚡', label: 'Under 30 Seconds' },
  { icon: '📊', label: '9-Step Pipeline' },
  { icon: '🌐', label: 'URL & Media Analysis' },
  { icon: '🔒', label: 'Privacy First' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-28 px-4 overflow-hidden">
        {/* Deep layered background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D0D1F 0%, #0A0A0F 50%, #0D0A1A 100%)' }} />

        {/* Aurora blobs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-10 px-4 py-2 rounded-xl transition-all duration-200 group"
              style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--bg-border)',
                background: 'var(--bg-secondary)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(79,142,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to home
            </Link>
          </motion.div>

          {/* Mission badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(79,142,255,0.15), rgba(124,58,237,0.15))',
              border: '1px solid rgba(79,142,255,0.3)',
              boxShadow: '0 0 24px rgba(79,142,255,0.12)',
            }}
          >
            <Heart className="w-3.5 h-3.5 text-[#4F8EFF]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#4F8EFF]">Our Mission</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="display-font font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: 'var(--text-primary)' }}
          >
            Fighting{' '}
            <span className="gradient-text">misinformation</span>
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>in India, at scale.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            Proofly was built to give every Indian — regardless of language or tech literacy —
            a powerful tool to verify claims before sharing them. Because truth matters.
          </motion.p>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {FEATURES.map((f, i) => (
              <motion.span
                key={f.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full font-medium"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>{f.icon}</span> {f.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS GRID ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(18px)',
                  border: `1px solid ${stat.color}22`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
                }}
              >
                {/* Glow blob */}
                <div
                  className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
                  style={{ background: `${stat.color}15`, filter: 'blur(20px)' }}
                />

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`,
                    boxShadow: `0 0 16px ${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Value */}
                <div
                  className="display-font font-black text-3xl mb-1 leading-none"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div
                  className="text-[11px] font-medium tracking-wide mt-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── WHAT WE STAND FOR ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div
            className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(79,142,255,0.1)',
              border: '1px solid rgba(79,142,255,0.25)',
              color: '#4F8EFF',
            }}
          >
            <Zap className="w-3 h-3" />
            Core Principles
          </div>
          <h2
            className="display-font text-4xl font-black mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            What we{' '}
            <span className="gradient-text">stand for</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            The principles that guide every decision we make.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="group relative p-6 rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(18px)',
                  border: `1px solid ${v.color}20`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                  willChange: 'transform',
                }}
              >
                {/* Top gradient accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${v.color}60, transparent)` }}
                />

                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top left, ${v.color}08 0%, transparent 60%)` }}
                />

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{
                      background: `${v.color}15`,
                      border: `1px solid ${v.color}30`,
                    }}
                  >
                    {v.emoji}
                  </div>

                  <div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {v.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Gradient layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(79,142,255,0.06) 0%, rgba(124,58,237,0.06) 50%, rgba(34,211,238,0.04) 100%)' }}
          />

          {/* Animated glow blobs */}
          <motion.div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(79,142,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)',
                boxShadow: '0 8px 32px rgba(79,142,255,0.35)',
              }}
              animate={{ boxShadow: ['0 8px 32px rgba(79,142,255,0.25)', '0 8px 48px rgba(79,142,255,0.5)', '0 8px 32px rgba(79,142,255,0.25)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>

            <h2
              className="display-font text-4xl font-black mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Ready to fight{' '}
              <span className="gradient-text">misinformation?</span>
            </h2>
            <p
              className="text-base mb-10 max-w-md mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join the mission to fight misinformation across India. Free, fast, and open.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)',
                  boxShadow: '0 4px 24px rgba(79,142,255,0.35)',
                }}
              >
                <Zap className="w-4 h-4" />
                Get Started Free
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                style={{
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--bg-border)',
                  background: 'var(--bg-secondary)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(79,142,255,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
              >
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
