import { api } from './client';

/**
 * Copilot ask endpoint contract:
 * - POST /api/copilot
 * - JSON body: { query }
 * - Returns: { answer, structured }
 */
export async function ask(query) {
  const q = (query ?? '').toString().trim();
  if (!q) {
    throw new Error('Query is required');
  }

  const res = await api.post('/api/copilot', { query: q });
  const data = res?.data;

  return {
    answer: data?.answer ?? data?.response ?? data?.message ?? '',
    structured: data?.structured ?? data?.data ?? data?.result ?? null,
  };
}

// Backwards-compatible exports (legacy)
export const copilotAPI = {
  async ask({ query }) {
    return ask(query);
  },
};

export async function askCopilot(query) {
  return ask(query);
}
