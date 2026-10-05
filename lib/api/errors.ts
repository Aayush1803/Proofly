/**
 * Proofly API Error Handling
 *
 * Normalizes all API errors into a consistent ApiErrorResponse shape.
 * Components never deal with raw fetch errors or FastAPI detail strings.
 */

import { ApiErrorResponse } from './types';

/**
 * FastAPI returns errors as:
 * { "detail": "Human-readable message" }
 * or for validation errors:
 * { "detail": [{ "msg": "...", "loc": [...] }] }
 */
interface FastApiErrorBody {
  detail?: string | Array<{ msg: string; loc?: unknown[] }>;
}

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request — please check your input.',
  401: 'Authentication required.',
  403: 'Access denied.',
  404: 'Resource not found.',
  413: 'File too large — maximum upload size is 20 MB.',
  415: 'Unsupported file format.',
  422: 'Invalid input format.',
  429: 'Too many requests — please wait a moment.',
  500: 'Analysis service error — please try again.',
  502: 'Analysis service is temporarily unavailable.',
  503: 'Analysis service is starting up — please try again shortly.',
  504: 'Analysis timed out — the file may be too large or complex.',
};

const NETWORK_MESSAGES: Record<string, string> = {
  'Failed to fetch': 'Cannot reach the analysis service. Check your connection or try again later.',
  'NetworkError':    'Network error — the analysis service may be offline.',
  'ECONNREFUSED':    'Analysis service is not running.',
  'Load failed':     'Cannot reach the analysis service.',
};

export function normalizeError(
  error: unknown,
  status?: number,
): ApiErrorResponse {
  // Network-level error (no response)
  if (error instanceof TypeError) {
    const msg = error.message;
    for (const [key, friendly] of Object.entries(NETWORK_MESSAGES)) {
      if (msg.includes(key)) {
        return { ok: false, status: 0, message: friendly, detail: msg };
      }
    }
    return {
      ok:      false,
      status:  0,
      message: 'Cannot reach the analysis service. Please check your connection.',
      detail:  msg,
    };
  }

  // Already normalized
  if (
    typeof error === 'object' &&
    error !== null &&
    'ok' in error &&
    (error as ApiErrorResponse).ok === false
  ) {
    return error as ApiErrorResponse;
  }

  // Generic Error instance
  if (error instanceof Error) {
    return {
      ok:      false,
      status:  status ?? 0,
      message: error.message || 'An unexpected error occurred.',
      detail:  error.stack,
    };
  }

  // String
  if (typeof error === 'string') {
    return { ok: false, status: status ?? 0, message: error };
  }

  return {
    ok:      false,
    status:  status ?? 0,
    message: 'An unexpected error occurred. Please try again.',
  };
}

/**
 * Parse a FastAPI response body and extract a friendly error message.
 */
export async function parseApiError(response: Response): Promise<ApiErrorResponse> {
  const status = response.status;
  let detail: string | undefined;

  try {
    const body = (await response.json()) as FastApiErrorBody;
    if (typeof body.detail === 'string') {
      detail = body.detail;
    } else if (Array.isArray(body.detail) && body.detail.length > 0) {
      detail = body.detail.map((d) => d.msg).join('; ');
    }
  } catch {
    // Body is not JSON — ignore
  }

  const message =
    detail ||
    ERROR_MESSAGES[status] ||
    `Analysis failed (HTTP ${status})`;

  return { ok: false, status, message, detail };
}

/**
 * Type guard: check if a response is an error.
 */
export function isApiError(r: { ok: boolean }): r is ApiErrorResponse {
  return r.ok === false;
}
