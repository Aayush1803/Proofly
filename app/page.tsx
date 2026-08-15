'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, AlertCircle, Check, Loader2, Zap, Sparkles,
} from 'lucide-react';

const FEATURES = [
  { icon: '🔍', title: '9-Step AI Pipeline', desc: 'Claims extraction, verification & trust scoring', color: '#4F8EFF' },
  { icon: '🌐', title: '23 Indian Languages', desc: 'All official Indian languages supported natively', color: '#22D3EE' },
  { icon: '⚡', title: 'Real-time Analysis', desc: 'Results in under 5 seconds, powered by Gemini', color: '#7C3AED' },
  { icon: '🛡️', title: 'India-First Context', desc: 'Tuned for regional misinformation patterns', color: '#22C55E' },
];

const STATS = [
  { value: '23', label: 'Languages' },
  { value: '9-Step', label: 'AI Pipeline' },
  { value: '<5s', label: 'Response' },
];

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    if (status === 'authenticated') router.push('/analyze');
  }, [status, router]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      mouseX.set((e.clientX / rect.width) * 30 - 15);
      mouseY.set((e.clientY / rect.height) * 30 - 15);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  const update = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const validateForm = () => {
    if (!form.email || !form.password) return 'Email and password are required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (mode === 'signup') {
      if (!form.name.trim()) return 'Please enter your name.';
      if (form.password !== form.confirm) return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    const result = await signIn('credentials', { redirect: false, name: form.name, email: form.email, password: form.password, mode });
    setLoading(false);
    if (result?.error) { setError(result.error); }
    else { setSuccess(mode === 'signup' ? 'Account created! Redirecting...' : 'Welcome back! Redirecting...'); setTimeout(() => router.push('/analyze'), 1000); }
  };

  const handleGoogle = async () => { setGoogleLoading(true); await signIn('google', { callbackUrl: '/analyze' }); };

  const passwordStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E'][strength];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)' }}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-[#4F8EFF] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>

      {/* ── LEFT PANEL — Branding ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-14 overflow-hidden">
        {/* Deep layered background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #090912 0%, #0D0D1F 40%, #0A0814 100%)' }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        {/* Animated aurora blobs */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: '15%', left: '20%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(79,142,255,0.14) 0%, transparent 70%)',
            filter: 'blur(60px)',
            x: springX,
            y: springY,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            bottom: '15%', right: '10%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '50%',
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* ── Logo ── */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)',
                boxShadow: '0 8px 32px rgba(79,142,255,0.35)',
              }}
              animate={{ boxShadow: ['0 8px 32px rgba(79,142,255,0.25)', '0 8px 48px rgba(79,142,255,0.5)', '0 8px 32px rgba(79,142,255,0.25)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-white font-black text-2xl tracking-tight display-font">
              Proofly <span style={{ color: '#4F8EFF' }}>AI</span>
            </span>
          </motion.div>
        </div>

        {/* ── Main Content ── */}
        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(79,142,255,0.1)',
                border: '1px solid rgba(79,142,255,0.25)',
                color: '#4F8EFF',
              }}
            >
              <Sparkles className="w-3 h-3" />
              India&apos;s AI Fact-Checker
            </div>

            <h1
              className="display-font font-black leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4rem)', color: 'var(--text-primary)' }}
            >
              Fight{' '}
              <span className="gradient-text">misinformation</span>
              <br />
              with AI.
            </h1>
            <p className="text-lg leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
              India&apos;s most advanced multimodal fact-checking platform.
              Analyze claims in under 5 seconds across 23 languages.
            </p>
          </motion.div>

          {/* Feature list */}
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 p-3.5 rounded-2xl group cursor-default transition-all duration-300"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${f.color}08`;
                  e.currentTarget.style.borderColor = `${f.color}25`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 flex items-center gap-8"
        >
          {STATS.map((s, i) => (
            <div key={s.label}>
              <div className="display-font font-black gradient-text text-2xl">{s.value}</div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              {i < STATS.length - 1 && (
                <div className="absolute right-0 top-1/2 w-px h-8 -translate-y-1/2" style={{ background: 'var(--bg-border)' }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — Auth Form ─────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D0D18 0%, #0A0A0F 100%)' }} />
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: '30%', left: '50%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(79,142,255,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:hidden flex items-center gap-2 mb-8 justify-center"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 4px 20px rgba(79,142,255,0.3)' }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-black text-xl display-font">Proofly <span className="text-[#4F8EFF]">AI</span></span>
          </motion.div>

          {/* Glass card */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Mode toggle */}
            <div
              className="flex p-1 mb-7 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}
            >
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                  className="relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 overflow-hidden"
                  style={mode === m ? { color: 'white' } : { color: 'var(--text-muted)' }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="auth-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #4F8EFF, #7C3AED)', boxShadow: '0 4px 16px rgba(79,142,255,0.3)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{m === 'login' ? 'Sign In' : 'Create Account'}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-black display-font" style={{ color: 'var(--text-primary)' }}>
                    {mode === 'login' ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {mode === 'login'
                      ? 'Sign in to access your analysis history and saved reports.'
                      : 'Start fact-checking misinformation across India — for free.'}
                  </p>
                </div>

                {/* Google button */}
                <motion.button
                  id="google-signin-btn"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-3 font-semibold py-3.5 rounded-xl transition-all duration-200 mb-5 disabled:opacity-70"
                  style={{
                    background: 'white',
                    color: '#1a1a1a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  }}
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with Google
                </motion.button>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ background: 'var(--bg-border)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>or continue with email</span>
                  <div className="flex-1 h-px" style={{ background: 'var(--bg-border)' }} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <InputField id="name-input" icon={<User className="w-4 h-4" />} type="text" placeholder="Full name" value={form.name} onChange={v => update('name', v)} autoComplete="name" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <InputField id="email-input" icon={<Mail className="w-4 h-4" />} type="email" placeholder="Email address" value={form.email} onChange={v => update('email', v)} autoComplete="email" />

                  <div className="space-y-1.5">
                    <InputField
                      id="password-input"
                      icon={<Lock className="w-4 h-4" />}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password (min. 8 characters)"
                      value={form.password}
                      onChange={v => update('password', v)}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      suffix={
                        <button type="button" onClick={() => setShowPass(!showPass)} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                    {mode === 'signup' && form.password && (
                      <div className="flex items-center gap-2 px-1">
                        <div className="flex gap-1 flex-1">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength ? strengthColor : 'var(--bg-border)' }} />
                          ))}
                        </div>
                        <span className="text-xs font-medium" style={{ color: strengthColor || 'var(--text-muted)' }}>{strengthLabel}</span>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <InputField
                          id="confirm-input"
                          icon={<Lock className="w-4 h-4" />}
                          type={showPass ? 'text' : 'password'}
                          placeholder="Confirm password"
                          value={form.confirm}
                          onChange={v => update('confirm', v)}
                          autoComplete="new-password"
                          suffix={form.confirm && form.password === form.confirm ? <Check className="w-4 h-4 text-green-400" /> : null}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {mode === 'login' && (
                    <div className="text-right">
                      <button type="button" className="text-xs transition-colors" style={{ color: '#4F8EFF' }}>Forgot password?</button>
                    </div>
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2.5 p-3.5 rounded-xl"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {success && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 p-3.5 rounded-xl"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                      >
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <p className="text-sm text-green-400">{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden relative"
                    style={{
                      background: 'linear-gradient(135deg, #4F8EFF 0%, #5B6EF7 50%, #7C3AED 100%)',
                      boxShadow: '0 4px 24px rgba(79,142,255,0.3)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)', backgroundSize: '200% 100%' }}
                      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <Zap className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4 relative z-10" />
                      </>
                    )}
                  </motion.button>
                </form>

                {mode === 'signup' && (
                  <p className="text-xs text-center mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    By creating an account you agree to our{' '}
                    <Link href="/about" className="text-[#4F8EFF] hover:underline">Terms of Service</Link> and{' '}
                    <Link href="/about" className="text-[#4F8EFF] hover:underline">Privacy Policy</Link>.
                  </p>
                )}

                <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                  <Link href="/how-it-works" className="text-[#4F8EFF] hover:underline">How it works</Link>
                  {' · '}
                  <Link href="/about" className="text-[#4F8EFF] hover:underline">About</Link>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({
  id, icon, type, placeholder, value, onChange, autoComplete, suffix,
}: {
  id: string; icon: React.ReactNode; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; autoComplete?: string; suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200"
      style={{
        background: 'var(--bg-primary)',
        border: `1px solid ${focused ? '#4F8EFF' : 'var(--bg-border)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(79,142,255,0.12)' : 'none',
      }}
    >
      <span style={{ color: focused ? '#4F8EFF' : 'var(--text-muted)' }} className="flex-shrink-0 transition-colors duration-200">{icon}</span>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} autoComplete={autoComplete}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent text-sm focus:outline-none"
        style={{ color: 'var(--text-primary)' }}
      />
      {suffix}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 className="w-8 h-8 text-[#4F8EFF] animate-spin" />
      </div>
    }>
      <HomeInner />
    </Suspense>
  );
}
