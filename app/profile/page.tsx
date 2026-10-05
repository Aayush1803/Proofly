'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  LogOut, BarChart3, Calendar, Mail,
  CheckCircle2, XCircle, AlertTriangle, Zap, User,
  ArrowLeft, Edit2, Save, X, Clock, Activity,
  Camera, Lock, TrendingUp, FileText, Wifi, Shield,
} from 'lucide-react';
import NavBar from '@/components/NavBar';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Analysis {
  id:           string;
  inputSnippet: string;
  inputType:    string;
  trustScore:   number;
  language:     string;
  claimsCount:  number;
  createdAt:    string;
}

interface LoginEvent {
  id:        string;
  provider:  string;
  createdAt: string;
}

interface ProfileData {
  user: {
    id:            string;
    name:          string;
    email:         string;
    image:         string | null;
    avatarUrl:     string | null;
    bio:           string | null;
    emailVerified: boolean;
    createdAt:     string;
  };
  stats: {
    totalAnalyses:   number;
    totalClaims:     number;
    trustedCount:    number;
    misleadingCount: number;
    falseCount:      number;
  };
  analyses:    Analysis[];
  loginEvents: LoginEvent[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getVerdict(score: number) {
  if (score >= 65) return { label: 'Accurate',    color: 'var(--semantic-credible)',      bg: 'var(--semantic-credible-bg)',      border: 'var(--semantic-credible-border)',      Icon: CheckCircle2 };
  if (score >= 35) return { label: 'Misleading',  color: 'var(--semantic-questionable)', bg: 'var(--semantic-questionable-bg)', border: 'var(--semantic-questionable-border)', Icon: AlertTriangle };
  return              { label: 'Inaccurate',  color: 'var(--semantic-false)',         bg: 'var(--semantic-false-bg)',         border: 'var(--semantic-false-border)',         Icon: XCircle };
}

const fmt  = (iso: string) => new Date(iso).toLocaleDateString('en-GB',  { day: 'numeric', month: 'short', year: 'numeric' });
const fmtT = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

type Tab = 'analyses' | 'logins' | 'account';

// ─── Main component ───────────────────────────────────────────────────────────
function ProfilePageInner() {
  const { data: session, status } = useSession();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [data,          setData]          = useState<ProfileData | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [tab,           setTab]           = useState<Tab>('analyses');
  const [editOpen,      setEditOpen]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [saveMsg,       setSaveMsg]       = useState('');
  const [editName,      setEditName]      = useState('');
  const [editBio,       setEditBio]       = useState('');
  const [editAvatar,    setEditAvatar]    = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (status === 'unauthenticated') router.push('/'); }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/profile')
      .then(r => r.json())
      .then((d: ProfileData) => {
        setData(d);
        setLoading(false);
        if (searchParams.get('edit') === '1') setEditOpen(true);
      })
      .catch(() => setLoading(false));
  }, [status, searchParams]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (!session || !data) return null;

  const { user, stats, analyses, loginEvents } = data;
  const displayAvatar = avatarPreview || user.avatarUrl || user.image || null;
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? '?').toUpperCase();

  function openEdit() {
    setEditName(user.name); setEditBio(user.bio ?? '');
    setEditAvatar(user.avatarUrl ?? ''); setAvatarPreview(''); setSaveMsg('');
    setEditOpen(true);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setSaveMsg('Image must be under 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => { const d = ev.target?.result as string; setAvatarPreview(d); setEditAvatar(d); };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!editName.trim()) { setSaveMsg('Name cannot be empty.'); return; }
    setSaving(true); setSaveMsg('');
    try {
      const res  = await fetch('/api/profile/update', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName, bio: editBio, avatarUrl: editAvatar }) });
      const json = await res.json();
      if (!res.ok) { setSaveMsg(json.error ?? 'Save failed.'); return; }
      setData(prev => prev ? { ...prev, user: { ...prev.user, name: json.user.name, bio: json.user.bio, avatarUrl: json.user.avatarUrl } } : prev);
      setAvatarPreview(''); setSaveMsg('Profile updated.');
      setTimeout(() => setEditOpen(false), 900);
    } catch { setSaveMsg('Network error. Try again.'); }
    finally   { setSaving(false); }
  }

  const isGoogleUser = loginEvents.some(e => e.provider === 'google');

  return (
    <main className="min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
      <NavBar />

      {/* ── Profile header ─────────────────────────────────────────── */}
      <div className="pt-20" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/misinformation" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to workspace
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative group cursor-pointer" onClick={openEdit}>
              {displayAvatar ? (
                <Image src={displayAvatar} alt={user.name} width={80} height={80}
                  className="w-20 h-20 rounded-lg object-cover"
                  style={{ border: '2px solid var(--border)' }} />
              ) : (
                <div className="w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold"
                  style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.45)' }}>
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-serif text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</h1>
                {isGoogleUser && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    Google account
                  </span>
                )}
                {user.emailVerified && !isGoogleUser && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--semantic-credible-bg)', border: '1px solid var(--semantic-credible-border)', color: 'var(--semantic-credible)' }}>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-muted)' }}>
                <Mail className="w-3.5 h-3.5 flex-shrink-0" /> {user.email}
              </p>
              {user.bio && <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{user.bio}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={openEdit} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--semantic-false)'; e.currentTarget.style.borderColor = 'var(--semantic-false-border)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Analyses',      value: stats.totalAnalyses,   icon: BarChart3 },
              { label: 'Claims found',  value: stats.totalClaims,     icon: FileText },
              { label: 'Verified true', value: stats.trustedCount,    icon: CheckCircle2 },
              { label: 'Member since',  value: fmt(user.createdAt),   icon: Calendar },
            ].map(s => (
              <div key={s.label} className="rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="score-display text-2xl mb-0.5" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Verdict distribution */}
          {stats.totalAnalyses > 0 && (
            <div className="mt-4 rounded-lg p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Verdict distribution
                </p>
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{stats.totalAnalyses} total</p>
              </div>
              <div className="flex rounded-full overflow-hidden h-2 gap-px">
                {stats.trustedCount    > 0 && <div style={{ flex: stats.trustedCount,    background: 'var(--semantic-credible)' }} title={`Accurate: ${stats.trustedCount}`} />}
                {stats.misleadingCount > 0 && <div style={{ flex: stats.misleadingCount, background: 'var(--semantic-questionable)' }} title={`Misleading: ${stats.misleadingCount}`} />}
                {stats.falseCount      > 0 && <div style={{ flex: stats.falseCount,      background: 'var(--semantic-false)' }} title={`Inaccurate: ${stats.falseCount}`} />}
              </div>
              <div className="flex items-center gap-4 mt-2">
                {[
                  { label: `${stats.trustedCount} accurate`,    color: 'var(--semantic-credible)' },
                  { label: `${stats.misleadingCount} misleading`, color: 'var(--semantic-questionable)' },
                  { label: `${stats.falseCount} inaccurate`,    color: 'var(--semantic-false)' },
                ].map(s => (
                  <span key={s.label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs + content ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Tab bar */}
        <div className="flex items-center gap-6 mb-8" style={{ borderBottom: '1px solid var(--border)' }}>
          {([
            { id: 'analyses' as Tab, label: 'Verification archive' },
            { id: 'logins'   as Tab, label: 'Login history' },
            { id: 'account'  as Tab, label: 'Account' },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="input-tab pb-3"
              style={{ borderBottomColor: tab === t.id ? 'var(--accent)' : 'transparent', color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Analyses */}
          {tab === 'analyses' && (
            <motion.div key="analyses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Verification archive</h2>
                <Link href="/misinformation" className="flex items-center gap-1.5 text-sm btn-primary px-3 py-1.5 rounded-md">
                  <Zap className="w-3.5 h-3.5" /> New analysis
                </Link>
              </div>

              {analyses.length === 0 ? (
                <div className="rounded-lg p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <BarChart3 className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--border-strong)' }} />
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No analyses yet.</p>
                  <Link href="/misinformation" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                    Run your first analysis →
                  </Link>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {analyses.map((item, i) => {
                    const v = getVerdict(item.trustScore);
                    const VIcon = v.Icon;
                    return (
                      <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-4 px-5 py-4"
                        style={i > 0 ? { borderTop: '1px solid var(--border)' } : {}}>
                        {/* Score badge */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-md flex flex-col items-center justify-center"
                          style={{ background: v.bg, border: `1px solid ${v.border}` }}>
                          <span className="text-lg font-bold font-mono leading-none" style={{ color: v.color }}>{item.trustScore}</span>
                          <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>/100</span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ color: v.color, background: v.bg, border: `1px solid ${v.border}` }}>
                              <VIcon className="w-3 h-3" /> {v.label}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                              {item.inputType}
                            </span>
                          </div>
                          <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{item.inputSnippet}</p>
                        </div>
                        {/* Date */}
                        <div className="flex-shrink-0 text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                          {fmt(item.createdAt)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Logins */}
          {tab === 'logins' && (
            <motion.div key="logins" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="font-serif text-xl font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Login history</h2>
              {loginEvents.length === 0 ? (
                <div className="rounded-lg p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--border-strong)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No login events recorded yet.</p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {loginEvents.map((event, i) => (
                    <div key={event.id} className="flex items-center gap-4 px-5 py-4" style={i > 0 ? { borderTop: '1px solid var(--border)' } : {}}>
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                        {event.provider === 'google'
                          ? <Wifi className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          : <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                          {event.provider === 'google' ? 'Google sign-in' : 'Email & password'}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Successful login</p>
                      </div>
                      <p className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{fmtT(event.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Account */}
          {tab === 'account' && (
            <motion.div key="account" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Account details</h2>
                <button onClick={openEdit} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--accent)' }}>
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {[
                  { label: 'Full name',      value: user.name,                                             Icon: User },
                  { label: 'Email',          value: user.email,                                            Icon: Mail },
                  { label: 'Bio',            value: user.bio || '—',                                       Icon: FileText },
                  { label: 'Account type',   value: user.image ? 'Google account' : 'Email & password',   Icon: Shield },
                  { label: 'Email verified', value: user.emailVerified ? 'Verified' : 'Not verified',      Icon: CheckCircle2 },
                  { label: 'Member since',   value: fmt(user.createdAt),                                   Icon: Calendar },
                  { label: 'Plan',           value: 'Free — Beta',                                         Icon: Zap },
                ].map((field, i) => (
                  <div key={field.label} className="flex items-start gap-4 px-5 py-4" style={i > 0 ? { borderTop: '1px solid var(--border)' } : {}}>
                    <field.Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{field.label}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Edit Profile Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) setEditOpen(false); }}>
            <motion.div initial={{ scale: 0.94, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 16, opacity: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-lg overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Edit profile</h3>
                <button onClick={() => setEditOpen(false)} className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                    {(avatarPreview || user.avatarUrl || user.image) ? (
                      <Image src={avatarPreview || user.avatarUrl || user.image!} alt="avatar" width={64} height={64}
                        className="w-16 h-16 rounded-lg object-cover" style={{ border: '2px solid var(--border)' }} />
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold"
                        style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                        {initials}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <button onClick={() => fileRef.current?.click()} className="text-sm font-semibold block mb-1" style={{ color: 'var(--accent)' }}>
                      Change photo
                    </button>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP — max 2 MB</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>

                {/* Name */}
                <div>
                  <label className="label-caps block mb-1.5">Full name</label>
                  <input value={editName} onChange={e => { setEditName(e.target.value); setSaveMsg(''); }}
                    placeholder="Your name" className="workspace-input w-full rounded-md px-3 py-2.5 text-sm" />
                </div>

                {/* Bio */}
                <div>
                  <label className="label-caps block mb-1.5">Bio <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)}
                    placeholder="A short bio…" rows={3} maxLength={160}
                    className="workspace-input w-full rounded-md px-3 py-2.5 text-sm resize-none" />
                  <p className="text-right text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{editBio.length}/160</p>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {saveMsg && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm" style={{ color: saveMsg.startsWith('Profile') ? 'var(--semantic-credible)' : 'var(--semantic-false)' }}>
                      {saveMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button onClick={() => setEditOpen(false)} className="flex-1 py-2.5 rounded-md text-sm btn-secondary">Cancel</button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 rounded-md text-sm font-semibold btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                    {saving
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Save className="w-3.5 h-3.5" /> Save changes</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}
