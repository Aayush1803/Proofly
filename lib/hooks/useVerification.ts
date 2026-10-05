'use client';

/**
 * useVerification — Unified verification hook
 *
 * Replaces the old Gemini-coupled useAnalysis and useDeepfakeAnalysis hooks.
 * Delegates all API calls to lib/api/analysis.ts — never constructs fetch directly.
 *
 * Used by:
 *   app/misinformation/page.tsx → mode: 'misinfo'
 *   app/deepfake/page.tsx       → mode: 'media'
 */

import { useState, useCallback, useRef } from 'react';
import { analyzeText, analyzeUrl, analyzeMedia } from '@/lib/api/analysis';
import { AnalysisResult, AppState, InputType, ProcessingStage } from '@/lib/api/types';
import { isApiError } from '@/lib/api/errors';

// ── Processing stages ─────────────────────────────────────────────────────────

export const MISINFO_STAGES: ProcessingStage[] = [
  { id: 'ingest',       label: 'Input received',           sublabel: 'Preparing content for analysis' },
  { id: 'extract',      label: 'Content extracted',        sublabel: 'Parsing text and structure' },
  { id: 'signals',      label: 'Signals evaluated',        sublabel: 'Scanning for manipulation patterns' },
  { id: 'claims',       label: 'Claims identified',        sublabel: 'Isolating verifiable assertions' },
  { id: 'inference',    label: 'Model inference',          sublabel: 'Classification running' },
  { id: 'sources',      label: 'Sources cross-referenced', sublabel: 'Checking against known fact databases' },
  { id: 'evidence',     label: 'Evidence assembled',       sublabel: 'Building structured evidence report' },
  { id: 'report',       label: 'Report generated',         sublabel: 'Finalising verification report' },
];

export const MEDIA_STAGES: ProcessingStage[] = [
  { id: 'ingest',       label: 'Media received',           sublabel: 'Reading file and metadata' },
  { id: 'frames',       label: 'Frames extracted',         sublabel: 'Sampling frames for pixel analysis' },
  { id: 'pixel',        label: 'Pixel anomaly scan',       sublabel: 'Detecting GAN artifacts and blending seams' },
  { id: 'audio',        label: 'Audio channel analyzed',   sublabel: 'Examining voice synthesis markers' },
  { id: 'temporal',     label: 'Temporal consistency',     sublabel: 'Frame-to-frame motion coherence check' },
  { id: 'metadata',     label: 'Metadata forensics',       sublabel: 'EXIF and compression artifact analysis' },
  { id: 'inference',    label: 'Model inference',          sublabel: 'Deepfake detection running' },
  { id: 'report',       label: 'Forensic report generated',sublabel: 'Compiling manipulation signals' },
];

// ── Hook ──────────────────────────────────────────────────────────────────────

export type VerificationMode = 'misinfo' | 'media';

interface UseVerificationReturn {
  appState:    AppState;
  currentStep: number;
  stages:      ProcessingStage[];
  result:      AnalysisResult | null;
  error:       string | null;
  submit:      (input: string, type: InputType, file?: File) => Promise<void>;
  reset:       () => void;
}

const STEP_INTERVAL_MS = 350;

export function useVerification(mode: VerificationMode): UseVerificationReturn {
  const stages = mode === 'media' ? MEDIA_STAGES : MISINFO_STAGES;

  const [appState,    setAppState]    = useState<AppState>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [result,      setResult]      = useState<AnalysisResult | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  const stepTimer = useRef<NodeJS.Timeout | null>(null);

  // ── Step animation (cosmetic progress — stages don't map 1:1 to model steps) ──
  const startSteps = useCallback(() => {
    setCurrentStep(0);
    let step = 0;

    const tick = () => {
      step += 1;
      setCurrentStep(step);
      // Slow down the last two steps to "wait" for the real API response
      const isNearEnd = step >= stages.length - 2;
      if (step < stages.length - 1) {
        stepTimer.current = setTimeout(tick, isNearEnd ? 1400 : STEP_INTERVAL_MS);
      }
    };

    stepTimer.current = setTimeout(tick, STEP_INTERVAL_MS);
  }, [stages.length]);

  const stopSteps = useCallback(() => {
    if (stepTimer.current) clearTimeout(stepTimer.current);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────────

  const submit = useCallback(async (
    input: string,
    type: InputType,
    file?: File,
  ) => {
    setAppState('processing');
    setError(null);
    setResult(null);
    startSteps();

    try {
      let response;

      if (type === 'media' && file) {
        response = await analyzeMedia(file);
      } else if (type === 'url') {
        response = await analyzeUrl(input);
      } else {
        response = await analyzeText(input);
      }

      stopSteps();
      setCurrentStep(stages.length);

      if (isApiError(response)) {
        setError(response.message);
        setAppState('error');
        return;
      }

      // Small delay so the final step visually completes
      await new Promise(r => setTimeout(r, 500));
      setResult(response.data);
      setAppState('results');

    } catch (err) {
      stopSteps();
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.',
      );
      setAppState('error');
    }
  }, [startSteps, stopSteps, stages.length]);

  // ── Reset ─────────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    stopSteps();
    setAppState('idle');
    setResult(null);
    setError(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stopSteps]);

  return { appState, currentStep, stages, result, error, submit, reset };
}
