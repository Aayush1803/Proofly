'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Heart, Shield, Twitter, Linkedin, ExternalLink, Zap } from 'lucide-react';

const NAV_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Technology',   href: '/technology' },
      { label: 'Analyze',      href: '/analyze' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',        href: '/about' },
      { label: 'Open Source',  href: 'https://github.com/Aayush1803/Proofly', external: true },
    ],
  },
];

const SOCIAL = [
  { icon: Github,   href: 'https://github.com/Aayush1803/Proofly', label: 'GitHub' },
  { icon: Twitter,  href: 'https://x.com/', label: 'Twitter' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/aayushjoshi07/', label: 'LinkedIn' },
];

const TECH_BADGES = ['Gemini 2.5', 'Next.js 14', 'Neon DB', 'Netlify Edge', 'Prisma ORM'];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mt-auto"
      style={{ borderTop: '1px solid var(--bg-border)' }}
    >
      {/* Chromatic top separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #4F8EFF 25%, #7C3AED 50%, #22D3EE 75%, transparent 100%)' }}
      />

      <div className="max-w-5xl mx-auto px-4 pt-14 pb-8">

        {/* ── Main 3-col grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 0 16px rgba(79,142,255,0.3)' }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Proofly<span style={{ color: '#4F8EFF' }}>AI</span>
              </span>
              <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-mono"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Live
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-5 max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
              India&apos;s first multimodal AI misinformation detector — supporting all 23 official Indian languages.
            </p>

            {/* Made for India chip */}
            <div
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}
            >
              <span>🇮🇳</span> Made for India
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4F8EFF'; e.currentTarget.style.borderColor = 'rgba(79,142,255,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2 & 3 — Nav links */}
          {NAV_COLS.map(col => (
            <div key={col.heading}>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-muted)' }}
              >
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm transition-colors duration-200 group"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Tech badge strip ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-[10px] uppercase tracking-widest font-bold mr-1" style={{ color: 'var(--text-muted)' }}>
            Powered by
          </span>
          {TECH_BADGES.map(badge => (
            <span
              key={badge}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--bg-border)',
                color: 'var(--text-muted)',
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
          style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#4F8EFF]" />
            <span>Google Gemini 2.5 Flash · 9-step pipeline</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-400" />
            <span>by</span>
            <a
              href="https://www.linkedin.com/in/aayushjoshi07/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-white transition-colors"
            >
              Aayush Joshi
            </a>
          </div>

          <span>© {new Date().getFullYear()} Proofly AI</span>
        </div>
      </div>
    </motion.footer>
  );
}
