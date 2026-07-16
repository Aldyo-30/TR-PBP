/**
 * ============================================
 * Authentication Context
 * ============================================
 * Provides global auth state to the entire app.
 * - Manages user, token, and loading states
 * - Verifies token on mount via /me endpoint
 * - Provides login/logout functions
 * - Computes role-based access (isAdmin, isGuru)
 * ============================================
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state + actions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Verify token on mount
   * If a token exists in localStorage, validate it by calling /me
   */
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await api.get('/me');
          setUser(response.data.user || response.data);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid or expired — clear everything
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  /**
   * Login Function
   * Authenticates user with email & password, stores token + user data.
   */
  const login = useCallback(async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { token: newToken, user: userData } = response.data;

    // Persist auth data
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    // Update state
    setToken(newToken);
    setUser(userData);

    return response.data;
  }, []);

  /**
   * Logout Function
   * Calls logout API, clears state + localStorage, redirects to login.
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      // Even if API call fails, we still clear local data
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      navigate('/login');
    }
  }, [navigate]);

  // Computed role checks
  const isAdmin = user?.role === 'admin';
  const isGuru = user?.role === 'guru';

  // Context value — all auth state and actions
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isGuru,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Convenient way to access auth context from any component.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
