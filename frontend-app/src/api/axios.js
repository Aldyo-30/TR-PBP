/**
 * ============================================
 * Axios Instance Configuration
 * ============================================
 * Centralized HTTP client for API communication.
 * - Base URL points to Laravel Herd local domain
 * - Request interceptor attaches Bearer token
 * - Response interceptor handles 401 (unauthorized)
 * ============================================
 */

import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://backend-app.test/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches the Bearer token from localStorage to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * On 401 Unauthorized: clear stored auth data.
 * The React components will handle redirect via AuthContext state.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't clear on login/register attempts (wrong password etc.)
      const url = error.config?.url || '';
      if (!url.includes('/login') && !url.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login via full page reload to reset all React state
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
