'use client';
// /analyze → redirects to /misinformation
// Preserves backward compatibility for existing links and bookmarks.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AnalyzeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/misinformation');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#4F8EFF] animate-spin" />
    </div>
  );
}
