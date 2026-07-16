/**
 * ============================================
 * Login Page
 * ============================================
 * Full-screen login with glassmorphism card,
 * gradient background, animated entrance, and
 * smooth interactions.
 * ============================================
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
} from 'react-icons/fi';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle input changes with spread operator pattern
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      toast.success('Login berhasil! Selamat datang 👋');
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login gagal. Periksa email dan password Anda.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg-shapes">
        <div className="login-shape login-shape-1" />
        <div className="login-shape login-shape-2" />
        <div className="login-shape login-shape-3" />
      </div>

      {/* Login Card */}
      <div className="login-card">
        {/* Header / Branding */}
        <div className="login-header">
          <div className="login-icon-wrapper">
            <span className="login-icon">📊</span>
          </div>
          <h1 className="login-title">Sistem Raport SD</h1>
          <p className="login-subtitle">Silakan login untuk melanjutkan</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            <span className="login-error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="login-field">
            <label className="login-label" htmlFor="email">Email</label>
            <div className="login-input-group">
              <span className="login-input-icon">
                <FiMail size={18} />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                className="login-input"
                placeholder="Masukkan email Anda"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="login-field">
            <label className="login-label" htmlFor="password">Password</label>
            <div className="login-input-group">
              <span className="login-input-icon">
                <FiLock size={18} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="login-input"
                placeholder="Masukkan password Anda"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`login-btn ${loading ? 'login-btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-btn-spinner" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <FiLogIn size={18} />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 Sistem Raport SD — Kelompok PBP</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
