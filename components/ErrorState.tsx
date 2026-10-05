'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message:   string;
  onRetry?:  () => void;
  title?:    string;
}

export default function ErrorState({
  message,
  onRetry,
  title = 'Analysis unavailable',
}: ErrorStateProps) {
  return (
    <div
      className="rounded-lg p-8 max-w-md w-full text-center"
      style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--semantic-false-border)',
        boxShadow:    'var(--shadow-md)',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: 'var(--semantic-false-bg)', border: '1px solid var(--semantic-false-border)' }}
      >
        <AlertTriangle className="w-4 h-4" style={{ color: 'var(--semantic-false)' }} />
      </div>

      <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary w-full py-2.5 rounded-md font-semibold text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}
