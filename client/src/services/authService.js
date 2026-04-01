/**
 * authService.js – Authentication API integration
 */

import { api, setToken, removeToken } from './api';

export async function register(payload) {
  const response = await api.post('/auth/register', payload);
  if (response.success && response.data?.token) {
    setToken(response.data.token);
  }
  return response;
}

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  if (response.success && response.data?.token) {
    setToken(response.data.token);
  }
  return response;
}

export async function getProfile() {
  return api.get('/auth/profile');
}

export async function updateProfile(payload) {
  if (payload.profileImage) {
    const form = new FormData();
    if (payload.name) form.append('name', payload.name);
    if (payload.phone) form.append('phone', payload.phone);
    if (payload.flatNumber) form.append('flatNumber', payload.flatNumber);
    form.append('profileImage', payload.profileImage);
    return api.putForm('/auth/profile', form);
  }
  return api.put('/auth/profile', payload);
}

export async function changePassword(currentPassword, newPassword) {
  return api.put('/auth/change-password', { currentPassword, newPassword });
}

export function logout() {
  removeToken();
}
