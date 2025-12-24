import { apiClient } from './client';

/**
 * Demo deals payload sent to /api/insights.
 * Keep this lightweight + deterministic so the UI can be wired even without CRM data.
 */
export function getDemoDeals() {
  const now = new Date();
  const daysAgo = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };

  return [
    {
      id: 'deal_001',
      name: 'Acme Corp — Expansion',
      amount: 52000,
      stage: 'Negotiation',
      owner: 'Jordan',
      createdAt: daysAgo(38),
      lastActivityAt: daysAgo(11),
      expectedCloseAt: daysAgo(-14),
      probability: 0.55,
    },
    {
      id: 'deal_002',
      name: 'Beacon Dental — New Site',
      amount: 18000,
      stage: 'Proposal Sent',
      owner: 'Riley',
      createdAt: daysAgo(21),
      lastActivityAt: daysAgo(4),
      expectedCloseAt: daysAgo(-7),
      probability: 0.68,
    },
    {
      id: 'deal_003',
      name: 'Cedar Labs — Annual Renewal',
      amount: 74000,
      stage: 'Contract Review',
      owner: 'Morgan',
      createdAt: daysAgo(64),
      lastActivityAt: daysAgo(15),
      expectedCloseAt: daysAgo(-3),
      probability: 0.4,
    },
    {
      id: 'deal_004',
      name: 'Delta Fitness — Upsell',
      amount: 12000,
      stage: 'Discovery',
      owner: 'Sam',
      createdAt: daysAgo(10),
      lastActivityAt: daysAgo(1),
      expectedCloseAt: daysAgo(-28),
      probability: 0.25,
    },
  ];
}

export async function postInsights({ userId = 'dev', source = 'demo', query, deals } = {}) {
  const payload = {
    userId,
    source,
    query,
    deals: deals || getDemoDeals(),
  };

  return apiClient.post('/api/insights', payload);
}
