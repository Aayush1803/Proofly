'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail, Lock, User, Eye, EyeOff,
  AlertCircle, Check, Loader2,
} from 'lucide-react';

// ─── Auth inner component (needs useSearchParams) ────────────────────────────
function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [otpSent, setOtpSent]         = useState(false);
  const [otpCode, setOtpCode]          = useState('');
  const [otpLoading, setOtpLoading]    = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (status === 'authenticated') router.push('/misinformation');
  }, [status, router]);

  const update = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setError('');
  };

  const switchMode = (m: 'login' | 'signup') => {
    setMode(m);
    setError('');
    setSuccess('');
    setOtpSent(false);
    setOtpCode('');
    setResendCooldown(0);
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSendOtp = async (isResend = false) => {
    if (!isResend) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { setError('Please enter a valid email address.'); return; }
      if (!form.name.trim()) { setError('Please enter your name.'); return; }
      if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    }
    setOtpLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to send code.'); return; }
      setOtpSent(true);
      setOtpCode('');
      setResendCooldown(30);
      if (isResend) setSuccess('New code sent! Check your inbox.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

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
    if (mode === 'signup') {
      if (!otpSent) { handleSendOtp(); return; }
      if (!otpCode || otpCode.length < 6) { setError('Please enter the 6-digit code from your email.'); return; }
      setLoading(true);
      setError('');
      const result = await signIn('credentials', {
        redirect: false, name: form.name, email: form.email,
        password: form.password, mode: 'signup', otpCode,
      });
      setLoading(false);
      if (result?.error) { setError(result.error); }
      else { setSuccess('Account created! Redirecting…'); setTimeout(() => router.push('/misinformation'), 1000); }
      return;
    }
    const err = validateForm();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      redirect: false, email: form.email, password: form.password, mode: 'login',
    });
    setLoading(false);
    if (result?.error) { setError(result.error); }
    else { setSuccess('Welcome back! Redirecting…'); setTimeout(() => router.push('/misinformation'), 1000); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/misinformation' });
  };

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
  const strengthColor = ['', '#B91C1C', '#B45309', '#1D4ED8', '#15803D'][strength];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>

      {/* ── LEFT PANEL — editorial brand statement ──────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
      >
        {/* Top: wordmark */}
        <div>
          <span className="brand-wordmark text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Proofly
          </span>
        </div>

        {/* Middle: hero statement */}
        <div className="max-w-sm">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[2.75rem] leading-[1.1] font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Proof before belief.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Proofly analyzes claims, articles, and media for credibility.
            Our verification pipeline examines sources, context, and evidence
            across India&apos;s information landscape.
          </motion.p>

          {/* Capabilities — understated list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 space-y-3"
          >
            {[
              'Text, URL, and media analysis',
              '23 Indian language support',
              'Source-backed fact verification',
              'Media forensics and deepfake detection',
            ].map((cap, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: 'var(--accent)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cap}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom: navigation links */}
        <div className="flex gap-6">
          {[
            ['How it works', '/how-it-works'],
            ['Research', '/research'],
            ['About', '/about'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-xs link-underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Auth form ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          {/* Mobile wordmark */}
          <div className="lg:hidden mb-10 text-center">
            <span className="brand-wordmark text-xl" style={{ color: 'var(--text-primary)' }}>
              Proofly
            </span>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Proof before belief.
            </p>
          </div>

          {/* Mode tabs */}
          <div
            className="flex gap-0 mb-8 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="input-tab flex-1 text-center"
                style={{
                  color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: mode === m ? '600' : '400',
                  borderBottom: mode === m ? '2px solid var(--accent)' : '2px solid transparent',
                  paddingBottom: '0.625rem',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {mode === 'login'
                    ? 'Welcome back'
                    : otpSent
                    ? 'Check your email'
                    : 'Get started'}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {mode === 'login'
                    ? 'Sign in to access your verification history.'
                    : otpSent
                    ? `We sent a 6-digit code to ${form.email}.`
                    : 'Create an account — it\'s free.'}
                </p>
              </div>

              {/* Google */}
              <button
                id="google-signin-btn"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 font-medium py-2.5 rounded-md border transition-all mb-4 text-sm"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 divider" />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
                <div className="flex-1 divider" />
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <AnimatePresence mode="wait">
                  {mode === 'signup' && otpSent ? (
                    /* OTP entry step */
                    <motion.div
                      key="otp-step"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <AuthInput
                        id="otp-input"
                        type="text"
                        placeholder="6-digit verification code"
                        value={otpCode}
                        onChange={v => { setOtpCode(v.replace(/\D/g, '')); setError(''); }}
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        className="font-mono tracking-[0.3em] text-center text-base"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); setSuccess(''); setResendCooldown(0); }}
                          className="text-xs transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          ← Change email
                        </button>
                        <button
                          type="button"
                          disabled={resendCooldown > 0 || otpLoading}
                          onClick={() => handleSendOtp(true)}
                          className="text-xs font-medium transition-colors disabled:cursor-not-allowed"
                          style={{ color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--accent)' }}
                        >
                          {otpLoading ? 'Sending…' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Main form step */
                    <motion.div
                      key="form-step"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <AnimatePresence>
                        {mode === 'signup' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <AuthInput
                              id="name-input"
                              icon={<User className="w-4 h-4" />}
                              type="text"
                              placeholder="Full name"
                              value={form.name}
                              onChange={v => update('name', v)}
                              autoComplete="name"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AuthInput
                        id="email-input"
                        icon={<Mail className="w-4 h-4" />}
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={v => update('email', v)}
                        autoComplete="email"
                      />

                      <div className="space-y-1.5">
                        <AuthInput
                          id="password-input"
                          icon={<Lock className="w-4 h-4" />}
                          type={showPass ? 'text' : 'password'}
                          placeholder="Password (min. 8 characters)"
                          value={form.password}
                          onChange={v => update('password', v)}
                          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                          suffix={
                            <button
                              type="button"
                              onClick={() => setShowPass(!showPass)}
                              className="transition-colors"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                        {mode === 'signup' && form.password && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1 flex-1">
                              {[1,2,3,4].map(i => (
                                <div
                                  key={i}
                                  className="h-0.5 flex-1 rounded-full transition-all duration-300"
                                  style={{ background: i <= strength ? strengthColor : 'var(--border)' }}
                                />
                              ))}
                            </div>
                            <span className="text-xs" style={{ color: strengthColor || 'var(--text-muted)' }}>
                              {strengthLabel}
                            </span>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {mode === 'signup' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <AuthInput
                              id="confirm-input"
                              icon={<Lock className="w-4 h-4" />}
                              type={showPass ? 'text' : 'password'}
                              placeholder="Confirm password"
                              value={form.confirm}
                              onChange={v => update('confirm', v)}
                              autoComplete="new-password"
                              suffix={
                                form.confirm && form.password === form.confirm
                                  ? <Check className="w-4 h-4" style={{ color: 'var(--semantic-credible)' }} />
                                  : null
                              }
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-md text-sm"
                      style={{
                        background: 'var(--semantic-false-bg)',
                        border: '1px solid var(--semantic-false-border)',
                        color: 'var(--semantic-false)',
                      }}
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-md text-sm"
                      style={{
                        background: 'var(--semantic-credible-bg)',
                        border: '1px solid var(--semantic-credible-border)',
                        color: 'var(--semantic-credible)',
                      }}
                    >
                      <Check className="w-4 h-4 flex-shrink-0" />
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={loading || otpLoading}
                  className="w-full py-2.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                  onMouseEnter={e => { if (!loading && !otpLoading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  {(loading || otpLoading)
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : mode === 'login'
                    ? 'Sign in'
                    : otpSent
                    ? 'Verify & create account'
                    : 'Send verification code'}
                </button>
              </form>

              {mode === 'signup' && (
                <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                  By continuing you agree to our{' '}
                  <Link href="/about" style={{ color: 'var(--text-secondary)' }}>Terms</Link>
                  {' '}and{' '}
                  <Link href="/about" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Auth input field ────────────────────────────────────────────────────────
function AuthInput({
  id, icon, type, placeholder, value, onChange, autoComplete, suffix,
  inputMode, maxLength, autoFocus, className = '',
}: {
  id: string;
  icon?: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  suffix?: React.ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  autoFocus?: boolean;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md border transition-all"
      style={{
        background: 'var(--bg-card)',
        borderColor: focused ? 'var(--accent)' : 'var(--border)',
      }}
    >
      {icon && (
        <span
          className="flex-shrink-0 transition-colors"
          style={{ color: focused ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {icon}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`flex-1 bg-transparent text-sm focus:outline-none ${className}`}
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
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    }>
      <HomeInner />
    </Suspense>
  );
}
