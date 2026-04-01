/**
 * noticeService.js – Notices / Announcements API integration
 */

import { api } from './api';

function buildQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.search) params.set('search', filters.search);
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getNotices(filters = {}) {
  return api.get(`/notices${buildQueryString(filters)}`);
}

export async function createNotice(payload) {
  if (payload.attachment) {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('description', payload.description);
    if (payload.type) form.append('type', payload.type);
    if (payload.priority) form.append('priority', payload.priority);
    if (payload.isPinned !== undefined) form.append('isPinned', String(payload.isPinned));
    form.append('attachment', payload.attachment);
    return api.postForm('/notices', form);
  }
  return api.post('/notices', payload);
}

export async function updateNotice(id, payload) {
  if (payload.attachment) {
    const form = new FormData();
    if (payload.title) form.append('title', payload.title);
    if (payload.description) form.append('description', payload.description);
    if (payload.type) form.append('type', payload.type);
    if (payload.priority) form.append('priority', payload.priority);
    if (payload.isPinned !== undefined) form.append('isPinned', String(payload.isPinned));
    form.append('attachment', payload.attachment);
    return api.putForm(`/notices/${id}`, form);
  }
  return api.put(`/notices/${id}`, payload);
}

export async function deleteNotice(id) {
  return api.delete(`/notices/${id}`);
}
