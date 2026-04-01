/**
 * complaintService.js – Complaints / Issues API integration
 */

import { api } from './api';

function buildQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.category) params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getComplaints(filters = {}) {
  return api.get(`/complaints${buildQueryString(filters)}`);
}

export async function getComplaintById(id) {
  return api.get(`/complaints/${id}`);
}

export async function createComplaint(payload) {
  if (payload.attachments && payload.attachments.length > 0) {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('description', payload.description);
    form.append('category', payload.category);
    if (payload.priority) form.append('priority', payload.priority);
    payload.attachments.forEach((file) => form.append('attachments', file));
    return api.postForm('/complaints', form);
  }
  return api.post('/complaints', payload);
}

export async function updateComplaint(id, payload) {
  return api.put(`/complaints/${id}`, payload);
}

export async function deleteComplaint(id) {
  return api.delete(`/complaints/${id}`);
}
