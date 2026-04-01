/**
 * residentService.js – Resident Directory API integration
 */

import { api } from './api';

function buildQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.block) params.set('block', filters.block);
  if (filters.role) params.set('role', filters.role);
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getResidents(filters = {}) {
  return api.get(`/residents${buildQueryString(filters)}`);
}

export async function getResidentById(id) {
  return api.get(`/residents/${id}`);
}

export async function updateResident(id, payload) {
  if (payload.profileImage) {
    const form = new FormData();
    if (payload.name) form.append('name', payload.name);
    if (payload.phone) form.append('phone', payload.phone);
    if (payload.flatNumber) form.append('flatNumber', payload.flatNumber);
    if (payload.role) form.append('role', payload.role);
    if (payload.isActive !== undefined) form.append('isActive', String(payload.isActive));
    form.append('profileImage', payload.profileImage);
    return api.putForm(`/residents/${id}`, form);
  }
  return api.put(`/residents/${id}`, payload);
}

export async function deleteResident(id) {
  return api.delete(`/residents/${id}`);
}
