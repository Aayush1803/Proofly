import type { Metadata, Viewport } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import ThemeProvider from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/Toast';
import ScrollToTop from '@/components/ScrollToTop';

// ─── Phase 1: @nextjs-best-practices + @seo-audit ────────────────────────────
// Full metadata object with: title template, description, OG, Twitter card,
// robots, canonical URL, and keywords — per Next.js App Router best practices.
export const metadata: Metadata = {
  metadataBase: new URL('https://proofly.netlify.app'),
  title: {
    default: 'Proofly — AI Deepfake & Misinformation Detection for India',
    template: '%s | Proofly',
  },
  description:
    'Proofly is India’s dual AI detection platform — Deepfake Detection powered by Gemini multimodal forensics, and Misinformation Detection with a 9-step fact-check pipeline across all 23 official Indian languages.',
  keywords: [
    'deepfake detection',
    'misinformation detection',
    'fact checking AI',
    'AI media forensics',
    'India fact check',
    'Hindi fact check',
    'Bengali fact check',
    'Tamil fact check',
    'Marathi fact check',
    'Telugu fact check',
    'Urdu fact check',
    'viral content fact checker',
    'Proofly',
    'Indian language AI',
    'all 23 Indian languages',
    'GAN artifact detection',
    'synthetic media detection',
  ],
  authors: [{ name: 'Proofly Team' }],
  creator: 'Proofly',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://proofly.netlify.app',
    siteName: 'Proofly',
    title: 'Proofly — AI Deepfake & Misinformation Detection for India',
    description:
      'Dual AI detection platform — Deepfake Detection + 9-step Misinformation fact-check in all 23 official Indian languages.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proofly — AI Deepfake & Misinformation Detector',
    description: 'Detect deepfakes and fact-check claims in seconds with India’s most advanced multimodal AI.',
    creator: '@proofly',
  },
};

// Viewport is now a separate export per Next.js 14+ best practice
export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('proofly-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="mesh-bg min-h-screen antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <ScrollToTop />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
