'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Heart, Shield, Cpu, Zap, Globe, Layers } from 'lucide-react';

const LINKS = {
  Product: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Technology', href: '/technology' },
    { label: 'Analyze Claim', href: '/analyze' },
  ],
  Company: [
    { label: 'About Proofly', href: '/about' },
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms of Service', href: '/about' },
  ],
};

const TECH = [
  { icon: Cpu, label: 'Gemini 2.5', color: '#4F8EFF' },
  { icon: Globe, label: '23 Languages', color: '#22D3EE' },
  { icon: Layers, label: 'Serverless Edge', color: '#7C3AED' },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative mt-auto pt-16 pb-8 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(79,142,255,0.4), rgba(124,58,237,0.4), rgba(34,211,238,0.4), transparent)' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(79,142,255,0.5) 0%, transparent 70%)', filter: 'blur(30px)' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-12">
          
          {/* ── Brand Column ── */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 4px 16px rgba(79,142,255,0.3)' }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl display-font tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Proofly<span style={{ color: '#4F8EFF' }}> AI</span>
              </span>
              <motion.div
                className="w-2 h-2 rounded-full ml-2"
                style={{ background: '#22C55E', boxShadow: '0 0 10px #22C55E' }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                title="Systems Online"
              />
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              India&apos;s most advanced multimodal fact-checking platform. Combat misinformation natively across 23 languages using serverless edge AI.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {TECH.map((t) => (
                <div key={t.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border"
                  style={{ color: t.color, background: `${t.color}10`, borderColor: `${t.color}25` }}
                >
                  <t.icon className="w-3 h-3" />
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Links Columns ── */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-primary)' }}>Product</h4>
              <ul className="space-y-3">
                {LINKS.Product.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm transition-colors hover:text-[#4F8EFF]" style={{ color: 'var(--text-muted)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-primary)' }}>Company</h4>
              <ul className="space-y-3">
                {LINKS.Company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm transition-colors hover:text-[#4F8EFF]" style={{ color: 'var(--text-muted)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--bg-border)' }}>
          <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>© {new Date().getFullYear()} Proofly AI. Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-400" />
            <span>by Aayush Joshi.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Aayush1803/Proofly"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors hover:text-white px-3 py-1.5 rounded-lg"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}
            >
              <Github className="w-3.5 h-3.5" />
              Open Source
            </a>
            
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <Zap className="w-3.5 h-3.5" />
              Sub-5s Processing
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
