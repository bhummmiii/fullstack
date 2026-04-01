/**
 * maintenanceService.js – Maintenance Payments API integration
 */

import { api } from './api';

function buildQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.month) params.set('month', filters.month);
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getMaintenanceRecords(filters = {}) {
  return api.get(`/maintenance${buildQueryString(filters)}`);
}

export async function getResidentMaintenance(residentId) {
  return api.get(`/maintenance/${residentId}`);
}

export async function createMaintenance(payload) {
  return api.post('/maintenance', payload);
}

export async function updateMaintenance(id, payload) {
  return api.put(`/maintenance/${id}`, payload);
}

export async function deleteMaintenance(id) {
  return api.delete(`/maintenance/${id}`);
}
