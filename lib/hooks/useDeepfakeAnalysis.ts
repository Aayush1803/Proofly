'use client';

import { useState, useCallback, useRef } from 'react';
import { AnalysisResult } from '@/lib/types';

type AppState = 'idle' | 'processing' | 'results' | 'error';

const TOTAL_STEPS = 8;

const DEEPFAKE_STEPS = [
  'Ingesting media file...',
  'Extracting visual frames...',
  'Pixel-level anomaly scan...',
  'Audio waveform analysis...',
  'Temporal consistency check...',
  'Metadata & artifact forensics...',
  'Gemini multimodal reasoning...',
  'Generating forensic report...',
];

const STEP_DURATIONS = [300, 450, 550, 500, 600, 450, 1200, 400];

interface UseDeepfakeAnalysisReturn {
  appState: AppState;
  currentStep: number;
  stepLabel: string;
  result: AnalysisResult | null;
  error: string | null;
  handleSubmit: (file: File) => Promise<void>;
  handleReset: () => void;
}

// ── JSON parser (3-tier) ─────────────────────────────────────────────────────
function parseGeminiJSON(raw: string): Record<string, unknown> {
  let text = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  try { return JSON.parse(text) as Record<string, unknown>; } catch { /* continue */ }

  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s !== -1 && e > s) {
    try { return JSON.parse(text.slice(s, e + 1)) as Record<string, unknown>; } catch { /* continue */ }
  }

  const fixed = text.replace(/,\s*([}\]])/g, '$1');
  try { return JSON.parse(fixed) as Record<string, unknown>; } catch { /* continue */ }

  throw new Error(`Cannot parse JSON from Gemini: ${text.slice(0, 200)}`);
}

export function useDeepfakeAnalysis(): UseDeepfakeAnalysisReturn {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stepTimer = useRef<NodeJS.Timeout | null>(null);

  const stepLabel = DEEPFAKE_STEPS[Math.min(currentStep, DEEPFAKE_STEPS.length - 1)];

  const startStepAnimation = useCallback(() => {
    setCurrentStep(0);
    let step = 0;
    const tick = () => {
      step += 1;
      setCurrentStep(step);
      if (step < TOTAL_STEPS - 1) {
        stepTimer.current = setTimeout(tick, STEP_DURATIONS[step] ?? 400);
      }
    };
    stepTimer.current = setTimeout(tick, STEP_DURATIONS[0]);
  }, []);

  const stopStepAnimation = useCallback(() => {
    if (stepTimer.current) clearTimeout(stepTimer.current);
  }, []);

  const handleSubmit = useCallback(async (file: File) => {
    setAppState('processing');
    setError(null);
    setResult(null);
    startStepAnimation();
    window.scrollTo({ top: window.innerHeight * 0.3, behavior: 'smooth' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const mediaRes = await fetch('/api/analyze-media', {
        method: 'POST',
        body: formData,
      });
      const mediaData = await mediaRes.json() as {
        text?: string;
        error?: string;
        isDirectAnalysis?: boolean;
      };

      if (!mediaRes.ok || mediaData.error) {
        throw new Error(mediaData.error || 'Deepfake analysis failed');
      }

      const analysisText = mediaData.text || '';
      const isDirectJSON = mediaData.isDirectAnalysis === true;

      if (isDirectJSON && analysisText) {
        let parsed: Record<string, unknown>;
        try {
          parsed = parseGeminiJSON(analysisText);
        } catch {
          throw new Error('Failed to parse AI response. Please try again.');
        }

        const g = parsed;
        const trustScore = Math.max(0, Math.min(100, Number(g.trust_score ?? 50)));
        const VALID_STATUS = ['True', 'False', 'Misleading', 'Opinion'] as const;
        const rawClaims = (g.claims as Array<Record<string, unknown>>) ?? [];
        const viralityData = (g.virality_risk as Record<string, unknown>) ?? {};
        const factData = (g.fact_verification as Record<string, unknown>) ?? {};
        const expData = (g.explanation as Record<string, unknown>) ?? {};
        const ctxData = (g.context_analysis as Record<string, unknown>) ?? {};
        const tb = (g.trust_breakdown as Record<string, unknown>) ?? {};
        const viralLevel = (['Low', 'Medium', 'High'].includes(String(viralityData.level))
          ? String(viralityData.level) : 'Medium') as 'Low' | 'Medium' | 'High';
        const clamp = (v: unknown, fallback: number) =>
          Math.round(Math.max(0, Math.min(100, Number(v ?? fallback))));

        const deepfakeResult: AnalysisResult = {
          id: `proofly-deepfake-${Date.now()}`,
          timestamp: new Date().toISOString(),
          inputType: 'media',
          language: 'en',
          originalInput: file.name,
          claims: rawClaims.slice(0, 5).map((c, i) => ({
            id: i + 1,
            text: String(c.text ?? ''),
            status: (VALID_STATUS.includes(String(c.classification) as typeof VALID_STATUS[number])
              ? String(c.classification) : 'Opinion') as typeof VALID_STATUS[number],
            confidence: Math.max(0, Math.min(100, Number(c.confidence ?? 70))),
          })),
          trustScore,
          trustBreakdown: {
            sourceReliability: clamp(tb.source_reliability, trustScore < 50 ? trustScore * 0.9 : 50 + (trustScore - 50) * 1.1),
            factualAccuracy:   clamp(tb.factual_accuracy,   trustScore * 0.95 + 3),
            contextIntegrity:  clamp(tb.context_integrity,  trustScore * 0.85 + 8),
            emotionalLanguage: clamp(tb.emotional_language, 100 - trustScore * 0.88 - 3),
          },
          factVerification: {
            correctedFact: String(factData.correct_info ?? ''),
            sources: ((factData.sources as Array<Record<string, unknown>>) ?? []).slice(0, 4).map(s => ({
              name: String(s.name ?? ''), url: String(s.url ?? '#'), logo: (String(s.name ?? 'X')[0] ?? 'X').toUpperCase(),
            })),
          },
          explanation: {
            detailed: String(expData.detailed ?? ''),
            eli10: String(expData.eli10 ?? ''),
          },
          viralityRisk: {
            score: Math.max(0, Math.min(100, Number(viralityData.score ?? 50))),
            level: viralLevel,
            reason: String(viralityData.reason ?? ''),
          },
          contextAnalysis: {
            regional: String(ctxData.regional ?? ''),
            cultural: String(ctxData.cultural ?? ''),
            sensitivity: String(ctxData.sensitivity ?? 'MEDIUM'),
          },
          counterMessage: {
            text: String(g.counter_message ?? ''),
            whatsappText: `*🔍 PROOFLY DEEPFAKE ANALYSIS*\n\nVerdict: *${trustScore < 35 ? 'LIKELY MANIPULATED' : trustScore < 65 ? 'REQUIRES SCRUTINY' : 'APPEARS AUTHENTIC'}*\n\n${String(g.counter_message ?? '')}\n\n🔗 Verified by PROOFLY\n\n_#DeepfakeDetection #MediaLiteracy #Proofly_`,
          },
          processingTime: 0,
          modelVersion: 'gemini-3.6-flash-multimodal',
        };

        stopStepAnimation();
        setCurrentStep(TOTAL_STEPS);
        setTimeout(() => {
          setResult(deepfakeResult);
          setAppState('results');
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
        }, 600);
        return;
      }

      // Fallback: route extracted text through standard analysis
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: analysisText, type: 'text', language: 'en' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `Analysis failed (${res.status})`);
      }

      stopStepAnimation();
      setCurrentStep(TOTAL_STEPS);
      setTimeout(() => {
        setResult(data as AnalysisResult);
        setAppState('results');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
      }, 600);

    } catch (err) {
      stopStepAnimation();
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setAppState('error');
    }
  }, [startStepAnimation, stopStepAnimation]);

  const handleReset = useCallback(() => {
    stopStepAnimation();
    setAppState('idle');
    setResult(null);
    setError(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stopStepAnimation]);

  return { appState, currentStep, stepLabel, result, error, handleSubmit, handleReset };
}
