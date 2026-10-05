/**
 * Proofly Analysis API Functions
 *
 * These are the only functions UI components and hooks should call
 * for analysis operations. No component should construct raw fetch calls.
 *
 * When NEXT_PUBLIC_API_URL=mock or NEXT_PUBLIC_MOCK_API=true,
 * requests are intercepted by the mock layer.
 */

import { apiPost, apiUpload, isMockMode } from './client';
import { AnalysisResult, ApiResponse } from './types';
import { getMockResult } from './mock';

// ── Text analysis ─────────────────────────────────────────────────────────────

export async function analyzeText(
  text: string,
  language = 'auto',
): Promise<ApiResponse<AnalysisResult>> {
  if (isMockMode()) return getMockResult('text', text);

  return apiPost<AnalysisResult>('/analyze/text', {
    input:      text,
    input_type: 'text',
    language,
  });
}

// ── URL analysis ──────────────────────────────────────────────────────────────

export async function analyzeUrl(
  url: string,
  language = 'auto',
): Promise<ApiResponse<AnalysisResult>> {
  if (isMockMode()) return getMockResult('url', url);

  return apiPost<AnalysisResult>('/analyze/url', {
    input:      url,
    input_type: 'url',
    language,
  });
}

// ── Media analysis ────────────────────────────────────────────────────────────

export async function analyzeMedia(
  file: File,
  language = 'auto',
): Promise<ApiResponse<AnalysisResult>> {
  if (isMockMode()) return getMockResult('media', file.name, file);

  // Validate file size client-side before upload
  const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
  if (file.size > MAX_BYTES) {
    return {
      ok:      false,
      status:  413,
      message: 'File too large — maximum upload size is 20 MB.',
    };
  }

  const SUPPORTED = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'image/heic', 'image/heif', 'image/avif',
    'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
    'video/x-matroska', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg',
    'audio/flac', 'audio/aac', 'audio/opus',
    'application/pdf', 'text/plain',
  ];

  if (file.type && !SUPPORTED.includes(file.type)) {
    return {
      ok:      false,
      status:  415,
      message: `Unsupported format: ${file.type}. Supported: images, video, audio, PDF.`,
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);

  return apiUpload<AnalysisResult>('/analyze/media', formData);
}
