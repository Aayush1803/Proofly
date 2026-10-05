'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, User, Sun, Moon, Menu, X, Edit2, BarChart3 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Verify',      href: '/misinformation' },
  { label: 'Media',       href: '/deepfake' },
  { label: 'Research',    href: '/research' },
  { label: 'Technology',  href: '/technology' },
];

export default function NavBar() {
  const { data: session, status } = useSession();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef   = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current   && !menuRef.current.contains(e.target as Node))   setMenuOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const user     = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 proofly-nav">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* ── Logo / Wordmark ─────────────────────────────────────── */}
        <Link
          href={session ? '/misinformation' : '/'}
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <div className="relative w-7 h-7 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Proofly"
              width={28}
              height={28}
              className="rounded object-contain"
              priority
            />
          </div>
          <span className="brand-wordmark text-[15px]">Proofly</span>
        </Link>

        {/* ── Center Nav (desktop) ─────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm rounded-md transition-colors"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: isActive ? '600' : '400',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── Right Side ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Theme toggle — quiet */}
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
            style={{
              color: 'var(--text-muted)',
              background: 'transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90,  opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {theme === 'dark'
                  ? <Sun  className="w-3.5 h-3.5" />
                  : <Moon className="w-3.5 h-3.5" />
                }
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Auth */}
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'var(--bg-secondary)' }} />
          ) : session ? (
            /* ── Signed in ── */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md border transition-all"
                style={{
                  background: 'transparent',
                  borderColor: menuOpen ? 'var(--border-strong)' : 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? 'User'}
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                ) : (
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    {initials}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{   opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-lg overflow-hidden card"
                    style={{ boxShadow: 'var(--shadow-lg)' }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>

                    {[
                      { icon: <User      className="w-3.5 h-3.5" />, label: 'Profile',         href: '/profile' },
                      { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'My Verifications', href: '/profile#analyses' },
                      { icon: <Edit2     className="w-3.5 h-3.5" />, label: 'Edit Profile',    href: '/profile?edit=1' },
                    ].map(item => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <div style={{ borderTop: '1px solid var(--border)' }}>
                      <button
                        onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: 'var(--semantic-false)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--semantic-false-bg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Signed out ── */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/"
                className="text-sm px-3 py-1.5 rounded-md transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
              >
                Sign in
              </Link>
              <Link
                href="/?mode=signup"
                className="btn-primary text-sm px-4 py-1.5 rounded-md"
              >
                Get started
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden" ref={mobileRef}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 rounded-md flex items-center justify-center border transition-colors"
              style={{
                background: 'transparent',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90,  opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Mobile panel */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{   opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-4 top-[3.75rem] w-56 rounded-lg overflow-hidden card"
                  style={{ boxShadow: 'var(--shadow-lg)' }}
                >
                  {/* Nav links */}
                  {NAV_LINKS.map(link => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3 text-sm font-medium transition-colors"
                      style={{
                        color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: pathname === link.href ? 'var(--bg-hover)' : 'transparent',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Auth in mobile */}
                  {!session && (
                    <div className="p-3 flex flex-col gap-2">
                      <Link
                        href="/"
                        className="block text-center py-2 text-sm rounded-md transition-colors"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-hover)' }}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/?mode=signup"
                        className="btn-primary block text-center py-2 text-sm rounded-md"
                      >
                        Get started
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
}
