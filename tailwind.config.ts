/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutral-first palette
        bg: {
          primary:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card:      'var(--bg-card)',
          border:    'var(--bg-border)',
          hover:     'var(--bg-hover)',
          subtle:    'var(--bg-subtle)',
        },
        // Restrained accent
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          muted:   'var(--accent-muted)',
        },
        // Semantic — used only where they communicate meaning
        status: {
          true:      '#15803D',
          false:     '#B91C1C',
          misleading:'#B45309',
          opinion:   '#5B21B6',
        },
        // Text hierarchy
        proofly: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          muted:     'var(--text-muted)',
        },
      },
      fontFamily: {
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        // Monospace ONLY for technical data
        mono:  ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        'xs':  ['0.75rem',  { lineHeight: '1.25rem' }],
      },
      letterSpacing: {
        editorial: '0.08em',
        label:     '0.12em',
        widest:    '0.16em',
      },
      animation: {
        'fade-in':   'fadeIn 0.35s ease-out',
        'fade-up':   'fadeUp 0.4s ease-out both',
        'reveal-up': 'reveal-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'step-pulse': 'step-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'step-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.5' },
        },
      },
      boxShadow: {
        'sm':  'var(--shadow-sm)',
        'md':  'var(--shadow-md)',
        'lg':  'var(--shadow-lg)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
