/**
 * visitorService.js – Visitor Management API integration
 */

import { api } from './api';

function buildQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.date) params.set('date', filters.date);
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getVisitors(filters = {}) {
  return api.get(`/visitors${buildQueryString(filters)}`);
}

export async function createVisitor(payload) {
  return api.post('/visitors', payload);
}

export async function updateVisitor(id, payload) {
  return api.put(`/visitors/${id}`, payload);
}

export async function deleteVisitor(id) {
  return api.delete(`/visitors/${id}`);
}
