/**
 * Proofly Central API Client
 *
 * All HTTP communication with the FastAPI backend goes through this module.
 * Never import fetch() directly in UI components.
 *
 * Configure the backend URL via:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000      (local development)
 *   NEXT_PUBLIC_API_URL=https://proofly-api.onrender.com  (production)
 */

import { ApiErrorResponse, ApiResponse } from './types';
import { parseApiError, normalizeError } from './errors';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const API_VERSION = '/api/v1';

export const BASE_URL = `${API_BASE}${API_VERSION}`;

// Default request timeout (ms)
const DEFAULT_TIMEOUT = 60_000;

// ── Internal fetch wrapper ────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { timeoutMs = DEFAULT_TIMEOUT, ...init } = options;

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return await parseApiError(response);
    }

    const data = (await response.json()) as T;
    return { ok: true, data };

  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === 'AbortError') {
      const apiErr: ApiErrorResponse = {
        ok:      false,
        status:  504,
        message: 'Analysis timed out. The file may be too large or complex — please try again.',
      };
      return apiErr;
    }

    return normalizeError(err) as ApiErrorResponse;
  }
}

// ── Public client methods ─────────────────────────────────────────────────────

/**
 * POST JSON body to the API.
 */
export async function apiPost<T>(
  path: string,
  body: unknown,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
    ...options,
  });
}

/**
 * POST multipart form data (file uploads).
 */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method:    'POST',
    body:      formData,
    timeoutMs: 120_000,  // Give file uploads more time
    ...options,
  });
}

/**
 * GET request.
 */
export async function apiGet<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, { method: 'GET', ...options });
}

// ── Dev utilities ─────────────────────────────────────────────────────────────

/**
 * Returns true if running in mock/dev mode.
 * Components should never check this directly — use the mock layer instead.
 */
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_API_URL === 'mock' ||
    process.env.NEXT_PUBLIC_MOCK_API === 'true';
}
