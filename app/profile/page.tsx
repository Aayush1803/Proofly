'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  LogOut, Shield, BarChart3, Calendar, Mail,
  CheckCircle2, XCircle, AlertTriangle, Zap, User,
  ArrowLeft, Edit2, Save, X, Clock, Activity,
  Camera, Lock, TrendingUp, FileText, Wifi,
} from 'lucide-react';
import NavBar from '@/components/NavBar';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Analysis {
  id: string;
  inputSnippet: string;
  inputType: string;
  trustScore: number;
  language: string;
  claimsCount: number;
  createdAt: string;
}

interface LoginEvent {
  id: string;
  provider: string;
  createdAt: string;
}

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    avatarUrl: string | null;
    bio: string | null;
    emailVerified: boolean;
    createdAt: string;
  };
  stats: {
    totalAnalyses: number;
    totalClaims: number;
    trustedCount: number;
    misleadingCount: number;
    falseCount: number;
  };
  analyses: Analysis[];
  loginEvents: LoginEvent[];
}

// ─── Verdict config ───────────────────────────────────────────────────────────
const getVerdict = (score: number) => {
  if (score >= 65) return { label: 'TRUE',       color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
  if (score >= 35) return { label: 'MISLEADING', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  icon: <AlertTriangle className="w-3.5 h-3.5" /> };
  return              { label: 'FALSE',      color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   icon: <XCircle className="w-3.5 h-3.5" /> };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

type Tab = 'analyses' | 'logins' | 'account';

// ─── Main component ───────────────────────────────────────────────────────────
function ProfilePageInner() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData]           = useState<ProfileData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<Tab>('analyses');
  const [editOpen, setEditOpen]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');

  // Edit form state
  const [editName, setEditName]   = useState('');
  const [editBio,  setEditBio]    = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/profile')
      .then(r => r.json())
      .then((d: ProfileData) => {
        setData(d);
        setLoading(false);
        // Auto-open edit modal if ?edit=1 is in URL
        if (searchParams.get('edit') === '1') setEditOpen(true);
      })
      .catch(() => setLoading(false));
  }, [status, searchParams]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#4F8EFF]/30 border-t-[#4F8EFF] animate-spin" />
          <p className="text-sm text-[#4A4A60]">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!session || !data) return null;

  const { user, stats, analyses, loginEvents } = data;

  const displayAvatar = avatarPreview || user.avatarUrl || user.image || null;
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? '?').toUpperCase();

  // ── Open edit modal ────────────────────────────────────────────────────────
  function openEdit() {
    setEditName(user.name);
    setEditBio(user.bio ?? '');
    setEditAvatar(user.avatarUrl ?? '');
    setAvatarPreview('');
    setSaveMsg('');
    setEditOpen(true);
  }

  // ── Handle avatar file pick ────────────────────────────────────────────────
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setSaveMsg('Image must be under 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setAvatarPreview(dataUrl);
      setEditAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  // ── Save profile ───────────────────────────────────────────────────────────
  async function handleSave() {
    if (!editName.trim()) { setSaveMsg('Name cannot be empty.'); return; }
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, bio: editBio, avatarUrl: editAvatar }),
      });
      const json = await res.json();
      if (!res.ok) { setSaveMsg(json.error ?? 'Save failed.'); return; }

      // Refresh local data
      setData(prev => prev ? {
        ...prev,
        user: { ...prev.user, name: json.user.name, bio: json.user.bio, avatarUrl: json.user.avatarUrl },
      } : prev);
      setAvatarPreview('');
      setSaveMsg('✓ Profile updated!');
      setTimeout(() => setEditOpen(false), 900);
    } catch {
      setSaveMsg('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  }

  // ─── Stats cards ────────────────────────────────────────────────────────────
  const statCards = [
    { label: 'Analyses Run',     value: stats.totalAnalyses.toString(), icon: <BarChart3 className="w-4 h-4" />,     color: '#4F8EFF' },
    { label: 'Claims Extracted', value: stats.totalClaims.toString(),   icon: <FileText className="w-4 h-4" />,      color: '#818CF8' },
    { label: 'Verified True',    value: stats.trustedCount.toString(),  icon: <CheckCircle2 className="w-4 h-4" />,  color: '#22C55E' },
    { label: 'Member Since',     value: formatDate(user.createdAt),     icon: <Calendar className="w-4 h-4" />,      color: '#F59E0B' },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pb-24">
      <NavBar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] to-[#0A0A0F]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full bg-gradient-to-r from-[#4F8EFF]/10 to-[#7C3AED]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <Link href="/misinformation" className="inline-flex items-center gap-1.5 text-sm text-[#8A8AA0] hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to analyzer
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] blur-md opacity-50 scale-110" />
              {displayAvatar ? (
                <Image
                  src={displayAvatar}
                  alt={user.name}
                  width={96} height={96}
                  className="relative w-24 h-24 rounded-full ring-4 ring-[#4F8EFF]/30 object-cover"
                />
              ) : (
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center text-3xl font-black text-white ring-4 ring-[#4F8EFF]/30">
                  {initials}
                </div>
              )}
              {/* Edit avatar button */}
              <button
                onClick={openEdit}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-[#0A0A0F] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </motion.div>

            {/* Name + meta */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-white">{user.name}</h1>
                {(() => {
                  const isGoogleUser = loginEvents.some(e => e.provider === 'google');
                  if (isGoogleUser) return (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(79,142,255,0.12)', border: '1px solid rgba(79,142,255,0.25)', color: '#4F8EFF' }}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Verified via Google
                    </span>
                  );
                  if (user.emailVerified) return (
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/25 px-2.5 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Email Verified
                    </span>
                  );
                  return (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Unverified
                    </span>
                  );
                })()}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#8A8AA0] mb-2">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user.email}</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#4F8EFF]" />Proofly Member</span>
              </div>
              {user.bio && <p className="text-sm text-[#6A6A80] italic max-w-md">{user.bio}</p>}
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
              <button
                onClick={openEdit}
                className="flex items-center gap-2 text-sm text-[#8A8AA0] hover:text-white border border-[#1E1E2E] hover:border-[#4F8EFF]/40 px-4 py-2.5 rounded-xl transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-sm text-[#8A8AA0] hover:text-red-400 border border-[#1E1E2E] hover:border-red-500/30 px-4 py-2.5 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Stats ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 mt-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl border border-white/[0.06] p-5 card-hover"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}22`, color: stat.color }}>
                {stat.icon}
              </div>
              <p className="text-xl font-black text-white leading-tight">{stat.value}</p>
              <p className="text-xs text-[#4A4A60] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Distribution bar ─────────────────────────────────────── */}
        {stats.totalAnalyses > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass rounded-2xl border border-white/[0.06] p-5 mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#4F8EFF]" />Verdict Distribution</p>
              <p className="text-xs text-[#4A4A60]">{stats.totalAnalyses} total</p>
            </div>
            <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
              {stats.trustedCount > 0    && <div style={{ flex: stats.trustedCount,    background: '#22C55E' }} title={`True: ${stats.trustedCount}`} />}
              {stats.misleadingCount > 0 && <div style={{ flex: stats.misleadingCount, background: '#F59E0B' }} title={`Misleading: ${stats.misleadingCount}`} />}
              {stats.falseCount > 0      && <div style={{ flex: stats.falseCount,      background: '#EF4444' }} title={`False: ${stats.falseCount}`} />}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#4A4A60]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />{stats.trustedCount} True</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />{stats.misleadingCount} Misleading</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />{stats.falseCount} False</span>
            </div>
          </motion.div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-1 mb-6 w-fit">
          {([
            { id: 'analyses' as Tab, label: 'Recent Analyses',  icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'logins'   as Tab, label: 'Login History',    icon: <Clock     className="w-3.5 h-3.5" /> },
            { id: 'account'  as Tab, label: 'Account Details',  icon: <User      className="w-3.5 h-3.5" /> },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t.id
                  ? 'bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white shadow-lg'
                  : 'text-[#8A8AA0] hover:text-white'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Recent Analyses ────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === 'analyses' && (
            <motion.div key="analyses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white" id="analyses">Recent Analyses</h2>
                <Link href="/misinformation" className="flex items-center gap-1.5 text-sm text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors">
                  <Zap className="w-3.5 h-3.5" /> New Analysis
                </Link>
              </div>

              {analyses.length === 0 ? (
                <div className="glass rounded-2xl border border-white/[0.06] p-12 text-center">
                  <BarChart3 className="w-10 h-10 text-[#1E1E2E] mx-auto mb-3" />
                  <p className="text-[#4A4A60] text-sm">No analyses yet.</p>
                  <Link href="/misinformation" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors">
                    <Zap className="w-4 h-4" /> Run your first fact-check
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {analyses.map((item, i) => {
                    const v = getVerdict(item.trustScore);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass rounded-2xl border border-white/[0.06] p-5 card-hover flex flex-col sm:flex-row sm:items-center gap-4"
                      >
                        {/* Score */}
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center" style={{ background: v.bg, border: `1px solid ${v.border}` }}>
                            <span className="text-xl font-black" style={{ color: v.color }}>{item.trustScore}</span>
                            <span className="text-[8px] text-[#4A4A60] font-mono">/100</span>
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ color: v.color, background: v.bg, border: `1px solid ${v.border}` }}>
                              {v.icon}{v.label}
                            </span>
                            <span className="text-[10px] text-[#4A4A60] uppercase font-mono bg-[#111118] border border-[#1E1E2E] px-2 py-0.5 rounded">{item.inputType}</span>
                            <span className="text-[10px] text-[#4A4A60] font-mono">{item.language}</span>
                            <span className="text-[10px] text-[#4A4A60]">{item.claimsCount} claim{item.claimsCount !== 1 ? 's' : ''}</span>
                          </div>
                          <p className="text-sm text-[#8A8AA0] truncate">{item.inputSnippet}</p>
                        </div>
                        {/* Date */}
                        <div className="flex-shrink-0 text-xs text-[#4A4A60] font-mono whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Tab: Login History ─────────────────────────────────── */}
          {tab === 'logins' && (
            <motion.div key="logins" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="text-lg font-bold text-white mb-4">Login History</h2>
              {loginEvents.length === 0 ? (
                <div className="glass rounded-2xl border border-white/[0.06] p-12 text-center">
                  <Clock className="w-10 h-10 text-[#1E1E2E] mx-auto mb-3" />
                  <p className="text-[#4A4A60] text-sm">No login events recorded yet.</p>
                </div>
              ) : (
                <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
                  {loginEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${event.provider === 'google' ? 'bg-blue-500/15' : 'bg-purple-500/15'}`}>
                        {event.provider === 'google'
                          ? <Wifi className="w-4 h-4 text-blue-400" />
                          : <Lock className="w-4 h-4 text-purple-400" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white capitalize">{event.provider === 'google' ? 'Google Sign-In' : 'Email & Password'}</p>
                        <p className="text-xs text-[#4A4A60]">Successful login</p>
                      </div>
                      <div className="text-xs text-[#4A4A60] font-mono whitespace-nowrap">
                        {formatDateTime(event.createdAt)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Tab: Account Details ──────────────────────────────── */}
          {tab === 'account' && (
            <motion.div key="account" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Account Details</h2>
                <button onClick={openEdit} className="flex items-center gap-1.5 text-sm text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
                {[
                  { label: 'Full Name',      value: user.name, icon: <User className="w-4 h-4" /> },
                  { label: 'Email Address',  value: user.email, icon: <Mail className="w-4 h-4" /> },
                  { label: 'Bio',            value: user.bio || '—', icon: <FileText className="w-4 h-4" /> },
                  { label: 'Account Type',   value: user.image ? 'Google Account' : 'Email & Password', icon: <Shield className="w-4 h-4" /> },
                  { label: 'Email Verified', value: user.emailVerified ? 'Verified ✓' : 'Not verified', icon: <CheckCircle2 className="w-4 h-4" /> },
                  { label: 'Member Since',   value: formatDate(user.createdAt), icon: <Calendar className="w-4 h-4" /> },
                  { label: 'Account Plan',   value: 'Free — Beta', icon: <Zap className="w-4 h-4" /> },
                ].map((field, i) => (
                  <div key={field.label} className="flex items-start gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0">
                    <div className="w-8 h-8 rounded-xl bg-[#1E1E2E]/60 flex items-center justify-center flex-shrink-0 text-[#4A4A60] mt-0.5">
                      {field.icon}
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A60] uppercase tracking-wide font-semibold mb-0.5">{field.label}</p>
                      <p className="text-sm text-white font-medium">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Edit Profile Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setEditOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md bg-[#111118] border border-[#1E1E2E] rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E1E2E]">
                <h3 className="text-lg font-bold text-white">Edit Profile</h3>
                <button onClick={() => setEditOpen(false)} className="w-8 h-8 rounded-xl bg-[#1E1E2E] flex items-center justify-center text-[#4A4A60] hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Avatar picker */}
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                    {(avatarPreview || user.avatarUrl || user.image) ? (
                      <Image
                        src={avatarPreview || user.avatarUrl || user.image!}
                        alt="avatar" width={72} height={72}
                        className="w-18 h-18 w-[72px] h-[72px] rounded-2xl object-cover ring-2 ring-[#4F8EFF]/30"
                      />
                    ) : (
                      <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center text-2xl font-black text-white">
                        {initials}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="text-sm font-semibold text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors block mb-1"
                    >
                      Change photo
                    </button>
                    <p className="text-xs text-[#4A4A60]">JPG, PNG, WebP — max 2 MB</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs text-[#4A4A60] uppercase tracking-wide font-semibold block mb-1.5">Full Name</label>
                  <input
                    value={editName}
                    onChange={e => { setEditName(e.target.value); setSaveMsg(''); }}
                    placeholder="Your name"
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#4F8EFF] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4A4A60] outline-none transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs text-[#4A4A60] uppercase tracking-wide font-semibold block mb-1.5">Bio <span className="text-[#2A2A40] normal-case tracking-normal font-normal">(optional)</span></label>
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="A short bio about yourself…"
                    rows={3}
                    maxLength={160}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#4F8EFF] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4A4A60] outline-none transition-colors resize-none"
                  />
                  <p className="text-right text-xs text-[#2A2A40] mt-1">{editBio.length}/160</p>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {saveMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`text-sm font-medium ${saveMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {saveMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setEditOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-[#1E1E2E] text-sm text-[#8A8AA0] hover:text-white hover:border-[#2E2E3E] transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Save Changes</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Wrap in Suspense — required because ProfilePageInner calls useSearchParams()
export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}
