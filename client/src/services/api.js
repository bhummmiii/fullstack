/**
 * api.js – Centralised HTTP client for Housing Society Hub
 * Handles auth, complaints, notices, maintenance, visitors, residents
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'society_auth_token';
const USER_KEY  = 'society_user';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken  = () => localStorage.getItem(TOKEN_KEY);
export const setToken  = (t) => localStorage.setItem(TOKEN_KEY, t);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser  = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
};
export const setStoredUser  = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

// ─── Custom error class ───────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}

// ─── Core request function ────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token   = getToken();
  const headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { ...options, headers };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch {
    throw new ApiError(
      'Network error – unable to reach the server. Please check your connection and try again.',
      0,
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(`Server returned non-JSON response (${response.status})`, response.status);
  }

  if (!response.ok) {
    // Auto-logout on 401
    if (response.status === 401) {
      removeToken();
      removeStoredUser();
    }
    throw new ApiError(
      payload.message || `Request failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  return payload;
}

// ─── Low-level methods ────────────────────────────────────────────────────────
export const api = {
  get:      (endpoint)        => request(endpoint, { method: 'GET' }),
  post:     (endpoint, body)  => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  postForm: (endpoint, body)  => request(endpoint, { method: 'POST', body }),
  put:      (endpoint, body)  => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  putForm:  (endpoint, body)  => request(endpoint, { method: 'PUT', body }),
  patch:    (endpoint, body)  => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete:   (endpoint)        => request(endpoint, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────────────────────────────────────

export const authApi = {
  /** Login with email + password. Returns { user, token } */
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setStoredUser(res.data.user);
    return res.data;
  },

  /** Register a new user (admin only after first user) */
  register: (userData) => api.post('/auth/register', userData),

  /** Get current logged-in user's profile */
  getProfile: () => api.get('/auth/profile'),

  /** Update profile (name, phone, flatNumber) */
  updateProfile: (data) => api.put('/auth/profile', data),

  /** Change password */
  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  /**
   * Forgot password – Step 1: verify identity via email + flat number.
   * Returns { resetToken, userName } on success.
   */
  verifyIdentityForReset: (email, flatNumber) =>
    api.post('/auth/forgot-password/verify', { email, flatNumber }),

  /**
   * Forgot password – Step 2: set a new password using the reset token
   * from step 1.
   */
  resetPasswordWithToken: (resetToken, newPassword) =>
    api.post('/auth/forgot-password/reset', { resetToken, newPassword }),

  /** Logout – just clears tokens */
  logout: () => {
    removeToken();
    removeStoredUser();
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  COMPLAINTS
// ─────────────────────────────────────────────────────────────────────────────

export const complaintsApi = {
  /**
   * Get complaints.
   * Admin → all; Resident → own.
   * @param {object} filters  { status, priority, category, search, page, limit }
   */
  getAll: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined),
    ).toString();
    return api.get(`/complaints${params ? `?${params}` : ''}`);
  },

  getById: (id) => api.get(`/complaints/${id}`),

  /** Create complaint (with optional file attachments via FormData) */
  create: (data) => {
    if (data instanceof FormData) return api.postForm('/complaints', data);
    return api.post('/complaints', data);
  },

  /** Update complaint (status, assignedTo for admin; title/desc for resident) */
  update: (id, data) => api.put(`/complaints/${id}`, data),

  delete: (id) => api.delete(`/complaints/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
//  NOTICES (Announcements)
// ─────────────────────────────────────────────────────────────────────────────

export const noticesApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined),
    ).toString();
    return api.get(`/notices${params ? `?${params}` : ''}`);
  },

  /** Admin only */
  create: (data) => {
    if (data instanceof FormData) return api.postForm('/notices', data);
    return api.post('/notices', data);
  },

  /** Admin only */
  update: (id, data) => api.put(`/notices/${id}`, data),

  /** Admin only */
  delete: (id) => api.delete(`/notices/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
//  MAINTENANCE
// ─────────────────────────────────────────────────────────────────────────────

export const maintenanceApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined),
    ).toString();
    return api.get(`/maintenance${params ? `?${params}` : ''}`);
  },

  /** Get maintenance bills for a specific resident */
  getByResident: (residentId) => api.get(`/maintenance/${residentId}`),

  /** Admin creates a bill for a resident */
  create: (data) => api.post('/maintenance', data),

  /** Admin updates payment status, method, etc. */
  update: (id, data) => api.put(`/maintenance/${id}`, data),

  /** Admin deletes a record */
  delete: (id) => api.delete(`/maintenance/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
//  RESIDENTS
// ─────────────────────────────────────────────────────────────────────────────

export const residentsApi = {
  /** Admin only: list all residents */
  getAll: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined),
    ).toString();
    return api.get(`/residents${params ? `?${params}` : ''}`);
  },

  getById: (id) => api.get(`/residents/${id}`),

  update: (id, data) => {
    if (data instanceof FormData) return api.putForm(`/residents/${id}`, data);
    return api.put(`/residents/${id}`, data);
  },

  delete: (id) => api.delete(`/residents/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
//  VISITORS
// ─────────────────────────────────────────────────────────────────────────────

export const visitorsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined),
    ).toString();
    return api.get(`/visitors${params ? `?${params}` : ''}`);
  },

  create: (data) => api.post('/visitors', data),

  update: (id, data) => api.put(`/visitors/${id}`, data),

  delete: (id) => api.delete(`/visitors/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
//  HEALTH CHECK
// ─────────────────────────────────────────────────────────────────────────────

export const healthCheck = () => api.get('/health');
