/**
 * Proofly FastAPI Contract Types
 *
 * These types represent the response shape expected from the FastAPI/PyTorch backend.
 * The frontend must never depend on the internal model architecture — only these shapes.
 *
 * Backend: FastAPI + PyTorch → https://<proofly-api>.onrender.com
 * Env var: NEXT_PUBLIC_API_URL
 */

// ── Input ───────────────────────────────────────────────────────────────────

export type InputType = 'text' | 'url' | 'media';
export type Language  = 'en' | 'hi' | 'ta' | 'auto' | string;

export interface AnalyzeRequest {
  input:      string;
  input_type: InputType;
  language?:  Language;
}

// ── Verdict ─────────────────────────────────────────────────────────────────

export type VerdictLabel =
  | 'likely_true'
  | 'likely_false'
  | 'misleading'
  | 'uncertain'
  | 'opinion'
  | 'likely_authentic'
  | 'likely_manipulated';

export interface Verdict {
  label:      VerdictLabel;
  confidence: number;   // 0.0 – 1.0
  summary:    string;   // One-line human-readable verdict
}

// ── Evidence ─────────────────────────────────────────────────────────────────

export type EvidenceAssessment = 'true' | 'false' | 'misleading' | 'opinion' | 'unverifiable';

export interface EvidenceItem {
  id:          number;
  type:        'claim' | 'visual_signal' | 'audio_signal' | 'metadata' | 'source_check';
  text:        string;
  assessment:  EvidenceAssessment;
  confidence:  number;    // 0.0 – 1.0
  explanation?: string;
}

// ── Sources ──────────────────────────────────────────────────────────────────

export type SourceCredibility = 'high' | 'medium' | 'low' | 'unknown';

export interface Source {
  name:        string;
  url:         string;
  credibility: SourceCredibility;
  logo?:       string;   // First letter / short code for avatar
}

// ── Explanation ───────────────────────────────────────────────────────────────

export interface Explanation {
  technical:  string;
  simple?:    string;
}

// ── Risk ─────────────────────────────────────────────────────────────────────

export type RiskLevel = 'high' | 'medium' | 'low';

export interface Risk {
  virality_score: number;   // 0.0 – 1.0
  level:          RiskLevel;
  reasoning:      string;
}

// ── Context ───────────────────────────────────────────────────────────────────

export type SensitivityLevel = 'high' | 'medium' | 'low';

export interface ContextInfo {
  language_detected:  string;
  regional_context?:  string;
  sensitivity:        SensitivityLevel;
  sensitivity_note?:  string;
}

// ── Model metadata ────────────────────────────────────────────────────────────

export interface ModelInfo {
  name:    string;   // e.g. "proofly-misinfo-v1"
  version: string;   // e.g. "1.0.0"
  type?:   string;   // e.g. "classification", "deepfake_detection"
}

// ── Explainability (future Grad-CAM / heatmap support) ───────────────────────

export interface SuspiciousRegion {
  x: number; y: number; width: number; height: number;
  label:      string;
  confidence: number;
}

export interface FrameAnalysis {
  timestamp_ms: number;
  label:        string;
  confidence:   number;
}

export interface ExplainabilityData {
  type:          'gradcam' | 'attention' | 'saliency' | 'frame_analysis';
  heatmap_url?:  string;
  regions?:      SuspiciousRegion[];
  frames?:       FrameAnalysis[];
}

// ── Main result type ──────────────────────────────────────────────────────────

export interface AnalysisResult {
  analysis_id:        string;
  input_type:         InputType;
  timestamp:          string;         // ISO 8601
  processing_time_ms: number;

  verdict:        Verdict;
  evidence:       EvidenceItem[];
  sources:        Source[];
  explanation:    Explanation;
  risk:           Risk;
  context:        ContextInfo;
  model:          ModelInfo;

  explainability?: ExplainabilityData;  // Only when backend provides it
  original_input:  string;
}

// ── API-level response wrappers ───────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  data: T;
  ok:   true;
}

export interface ApiErrorResponse {
  ok:      false;
  status:  number;
  message: string;   // Normalized human-readable message
  detail?: string;   // Raw detail from FastAPI
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ── Health check ─────────────────────────────────────────────────────────────

export type HealthStatus = 'ok' | 'degraded' | 'unavailable';

export interface HealthResponse {
  status:   HealthStatus;
  version?: string;
  models?:  string[];
}

// ── Processing state (UI only) ─────────────────────────────────────────────────

export interface ProcessingStage {
  id:       string;
  label:    string;
  sublabel: string;
}

export type AppState = 'idle' | 'processing' | 'results' | 'error';
