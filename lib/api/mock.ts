/**
 * Proofly Mock API Layer
 *
 * DEV-ONLY. Simulates realistic FastAPI responses without a running backend.
 * Activated when: NEXT_PUBLIC_API_URL=mock OR NEXT_PUBLIC_MOCK_API=true
 *
 * IMPORTANT:
 * - Mock responses match the exact FastAPI contract types in ./types.ts
 * - These are NOT real model results
 * - Components must not import from this file directly
 * - Always goes through lib/api/analysis.ts → getMockResult()
 *
 * When the real FastAPI backend is deployed, set:
 *   NEXT_PUBLIC_API_URL=https://proofly-api.onrender.com
 * and the mock layer is bypassed entirely.
 */

import {
  AnalysisResult,
  ApiResponse,
  EvidenceItem,
  InputType,
  VerdictLabel,
} from './types';

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreInput(input: string): number {
  const lower = input.toLowerCase();
  const highRisk = [
    'fake', 'hoax', 'conspiracy', 'lie', 'mislead', 'false', 'exposed',
    'forward this', 'share this', 'urgent', 'breaking', 'secret',
    'viral', 'shocking', 'they dont want you to know',
  ];
  const safe = [
    'according to', 'study shows', 'research', 'published', 'government',
    'official', 'reuters', 'verified', 'fact-check', 'peer-reviewed',
    'evidence', 'data shows',
  ];
  let score = 62;
  highRisk.forEach(kw => { if (lower.includes(kw)) score -= 14; });
  safe.forEach(kw => { if (lower.includes(kw)) score += 5; });
  return Math.round(Math.max(10, Math.min(95, score)));
}

function confidenceToVerdict(confidence: number): VerdictLabel {
  if (confidence >= 0.70) return 'likely_false';
  if (confidence >= 0.55) return 'misleading';
  if (confidence >= 0.45) return 'uncertain';
  return 'likely_true';
}

function toConfidence(trustScore: number): number {
  // trustScore = 0–100 credibility; invert for "false" confidence
  return parseFloat(((100 - trustScore) / 100).toFixed(2));
}

// ── Evidence generation ────────────────────────────────────────────────────────

function buildEvidence(input: string, trustScore: number, type: InputType): EvidenceItem[] {
  const sentences = input
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 4);

  const syntheticClaims = [
    'The content makes a strong causal claim without citing peer-reviewed sources.',
    'Statistical figures referenced could not be independently corroborated.',
    'The narrative implies suppression of information without substantiating evidence.',
    'The source of the original claim is anonymous or unattributed.',
  ];

  const textClaims = sentences.length >= 2 ? sentences : syntheticClaims.slice(0, 3);

  const evidence: EvidenceItem[] = textClaims.map((text, i) => {
    const rand = (trustScore + i * 13) % 100;
    let assessment: EvidenceItem['assessment'];
    let confidence: number;

    if (rand > 65)      { assessment = 'true';        confidence = 0.72 + Math.random() * 0.22; }
    else if (rand > 45) { assessment = 'opinion';     confidence = 0.50 + Math.random() * 0.20; }
    else if (rand > 25) { assessment = 'misleading';  confidence = 0.60 + Math.random() * 0.25; }
    else                { assessment = 'false';       confidence = 0.75 + Math.random() * 0.20; }

    return {
      id:         i + 1,
      type:       'claim',
      text,
      assessment,
      confidence: parseFloat(Math.min(0.99, confidence).toFixed(2)),
    };
  });

  // For media/visual types, add signal evidence
  if (type === 'media') {
    evidence.push({
      id:          evidence.length + 1,
      type:        'visual_signal',
      text:        'Visual consistency check across sampled frames.',
      assessment:  trustScore < 45 ? 'false' : 'true',
      confidence:  parseFloat((0.65 + Math.random() * 0.30).toFixed(2)),
      explanation: trustScore < 45
        ? 'Inconsistencies detected in pixel-level analysis. Potential GAN artifacts present.'
        : 'No significant manipulation artifacts detected in the visual channel.',
    });
    evidence.push({
      id:          evidence.length + 1,
      type:        'metadata',
      text:        'File metadata and compression artifact analysis.',
      assessment:  trustScore < 40 ? 'misleading' : 'true',
      confidence:  parseFloat((0.60 + Math.random() * 0.30).toFixed(2)),
    });
  }

  return evidence;
}

// ── Explanations ──────────────────────────────────────────────────────────────

const EXPLANATIONS = {
  low: {
    technical: 'This content exhibits multiple hallmarks of misinformation: absence of credible citations, emotionally charged language designed to provoke sharing behaviour, and an anonymous or unverifiable origin. Core claims contradict established evidence from peer-reviewed literature and verified public records.',
    simple:    'This message is trying to trick you. It uses alarming words to make you feel worried, but provides no real evidence. Trustworthy information always cites where it came from. This one does not.',
  },
  mid: {
    technical: 'This content contains a mixture of accurate and misleading elements. While some foundational facts are correct, critical context is absent, creating a distorted impression through selective omission — a common pattern in influence operations.',
    simple:    'This tells only half the story. Some parts are accurate, but important facts have been left out on purpose. Always look for what is missing, not just what is included.',
  },
  high: {
    technical: 'This content aligns with consensus positions from recognised scientific and governmental bodies. Cross-reference signals found corroborating evidence from multiple independent sources, significantly increasing confidence in its accuracy.',
    simple:    'This information checks out. Scientists and fact-checkers agree with what is being said. You can be reasonably confident it is accurate.',
  },
};

// ── Sources ───────────────────────────────────────────────────────────────────

const ALL_SOURCES = [
  { name: 'Reuters Fact-Check', url: 'https://www.reuters.com/fact-check/', credibility: 'high' as const, logo: 'R' },
  { name: 'PTI Fact Check',     url: 'https://www.ptinews.com/category/pti-fact-check/', credibility: 'high' as const, logo: 'P' },
  { name: 'Alt News',           url: 'https://www.altnews.in/', credibility: 'high' as const, logo: 'A' },
  { name: 'WHO Infodemic',      url: 'https://www.who.int/emergencies/infodemic/', credibility: 'high' as const, logo: 'W' },
  { name: 'BOOM Live',          url: 'https://www.boomlive.in/', credibility: 'high' as const, logo: 'B' },
  { name: 'India Today FC',     url: 'https://www.indiatoday.in/fact-check', credibility: 'high' as const, logo: 'I' },
];

function pickSources(trustScore: number) {
  const indices = trustScore > 60 ? [0, 1, 2] : trustScore > 35 ? [0, 3, 4, 5] : [0, 2, 4, 5];
  return indices.map(i => ALL_SOURCES[i]).slice(0, 4);
}

// ── Context ────────────────────────────────────────────────────────────────────

const CONTEXTS = [
  {
    language_detected: 'en',
    regional_context: 'Content appears to target North Indian demographics, referencing cultural themes common in UP, Bihar, and Delhi NCR.',
    sensitivity: 'high' as const,
    sensitivity_note: 'Touches on religious identity — could contribute to communal tension if widely shared.',
  },
  {
    language_detected: 'en',
    regional_context: 'Content appears geographically neutral, optimised for pan-India mobile sharing.',
    sensitivity: 'medium' as const,
    sensitivity_note: 'Uses health or economic claims — common persuasion tactic in semi-urban communities.',
  },
  {
    language_detected: 'en',
    regional_context: 'Analysis suggests South Indian origin, with themes relevant to Tamil Nadu and Karnataka discourse.',
    sensitivity: 'low' as const,
    sensitivity_note: 'Primarily politically sensitive; limited immediate risk of communal harm.',
  },
];

// ── Main mock function ────────────────────────────────────────────────────────

export async function getMockResult(
  type: InputType,
  input: string,
  file?: File,
): Promise<ApiResponse<AnalysisResult>> {
  // Simulate realistic latency
  const delay = 2000 + Math.random() * 1500;
  await new Promise(r => setTimeout(r, delay));

  const trustScore  = scoreInput(input);
  const confidence  = toConfidence(trustScore);
  const label       = confidenceToVerdict(confidence);
  const expKey      = trustScore < 35 ? 'low' : trustScore < 65 ? 'mid' : 'high';
  const contextIdx  = Math.floor(Math.random() * CONTEXTS.length);
  const viralScore  = parseFloat(Math.min(0.98, Math.max(0.05, (100 - trustScore * 0.6) / 100)).toFixed(2));
  const viralLevel  = viralScore > 0.65 ? 'high' as const : viralScore > 0.35 ? 'medium' as const : 'low' as const;

  const verdictSummaries: Record<string, string> = {
    likely_false:      'This content contains significant factual inaccuracies and shows patterns consistent with misinformation.',
    misleading:        'This content is partially accurate but presents information in a misleading or decontextualised way.',
    uncertain:         'The available evidence is insufficient to make a definitive assessment.',
    likely_true:       'This content appears to be largely accurate based on available evidence.',
    likely_authentic:  'No significant manipulation signals detected in the media.',
    likely_manipulated:'Manipulation signals detected across multiple forensic channels.',
    opinion:           'This content represents opinion rather than verifiable fact.',
  };

  const result: AnalysisResult = {
    analysis_id:        `proofly-mock-${Date.now()}`,
    input_type:         type,
    timestamp:          new Date().toISOString(),
    processing_time_ms: Math.round(delay),

    verdict: {
      label,
      confidence,
      summary: verdictSummaries[label] ?? 'Analysis complete.',
    },

    evidence: buildEvidence(input, trustScore, type),
    sources:  pickSources(trustScore),

    explanation: EXPLANATIONS[expKey],

    risk: {
      virality_score: viralScore,
      level:          viralLevel,
      reasoning:      viralLevel === 'high'
        ? 'Emotionally charged language and lack of sources make this content highly shareable in echo chambers.'
        : viralLevel === 'medium'
        ? 'Some misleading elements could spread in specific communities, but partial verifiability limits mass virality.'
        : 'The factual, well-sourced nature of this content limits its sensationalist spread.',
    },

    context: CONTEXTS[contextIdx],

    model: {
      name:    'proofly-misinfo-v1-mock',
      version: '1.0.0-dev',
      type:    type === 'media' ? 'deepfake_detection' : 'misinfo_classification',
    },

    original_input: file ? file.name : input.slice(0, 200),
  };

  return { ok: true, data: result };
}
