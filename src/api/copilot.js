import { apiClient } from './client';

export const copilotAPI = {
  async init({ source, userId, mode }) {
    return apiClient.post('/api/copilot', {
      source,
      userId,
      mode,
    });
  },

  async ask({ source, userId, mode, query }) {
    return apiClient.post('/api/copilot', {
      source,
      userId,
      mode,
      query,
    });
  },
};
