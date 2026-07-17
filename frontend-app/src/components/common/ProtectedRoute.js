/**
 * ============================================
 * Protected Route Component
 * ============================================
 * Guards routes that require authentication.
 * - Shows loading spinner while auth is being verified
 * - Redirects to /login if not authenticated
 * - Redirects to /dashboard if role is not allowed
 * ============================================
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();

  // Still checking auth status — show loader
  if (loading) {
    return <LoadingSpinner message="Memverifikasi autentikasi..." />;
  }

  // Not authenticated — redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed — render the protected content
  return children;
};

export default ProtectedRoute;
