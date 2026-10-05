/**
 * Proofly Health Check
 *
 * Fetches the FastAPI health endpoint to show system status.
 * Only display a status indicator if it actually comes from the backend.
 * Do NOT show fake "AI ONLINE" badges.
 */

import { apiGet, isMockMode } from './client';
import { HealthResponse, ApiResponse } from './types';

export async function checkHealth(): Promise<ApiResponse<HealthResponse>> {
  if (isMockMode()) {
    // Mock: simulate healthy backend
    await new Promise(r => setTimeout(r, 200));
    return {
      ok:   true,
      data: { status: 'ok', version: '1.0.0-mock', models: ['proofly-misinfo-v1-mock'] },
    };
  }

  return apiGet<HealthResponse>('/health', { timeoutMs: 5_000 });
}
