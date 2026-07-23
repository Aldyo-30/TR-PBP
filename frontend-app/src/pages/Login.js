

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiUserPlus,
  FiUser,
} from 'react-icons/fi';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, user, token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, token, authLoading, navigate]);

  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError('');
    setErrors({});
    setFormData({ name: '', email: '', password: '', password_confirmation: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors({});

    try {
      if (isRegister) {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.password_confirmation
        );
        toast.success('Registrasi berhasil! Selamat datang 👋');
      } else {
        await login(formData.email, formData.password);
        toast.success('Login berhasil! Selamat datang 👋');
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        const firstError = Object.values(err.response.data.errors)[0];
        const message = Array.isArray(firstError) ? firstError[0] : firstError;
        setError(message);
        toast.error(message);
      } else {
        const message =
          err.response?.data?.message ||
          (isRegister
            ? 'Registrasi gagal. Silakan coba lagi.'
            : 'Login gagal. Periksa email dan password Anda.');
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-bg-shapes">
        <div className="login-shape login-shape-1" />
        <div className="login-shape login-shape-2" />
        <div className="login-shape login-shape-3" />
      </div>

      <div className={`login-card ${isRegister ? 'login-card-register' : ''}`}>

        <div className="login-header">
          <div className="login-icon-wrapper">
            <span className="login-icon">{isRegister ? '📝' : '📊'}</span>
          </div>
          <h1 className="login-title">Sistem Raport SD</h1>
          <p className="login-subtitle">
            {isRegister
              ? 'Buat akun baru untuk mulai menggunakan sistem'
              : 'Silakan login untuk melanjutkan'}
          </p>
        </div>

        {error && (
          <div className="login-error">
            <span className="login-error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>

          {isRegister && (
            <div className="login-field login-field-animate">
              <label className="login-label" htmlFor="name">Nama Lengkap</label>
              <div className="login-input-group">
                <span className="login-input-icon">
                  <FiUser size={18} />
                </span>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className={`login-input ${errors.name ? 'login-input-error' : ''}`}
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  autoFocus
                />
              </div>
              {errors.name && (
                <span className="login-field-error">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</span>
              )}
            </div>
          )}

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
                className={`login-input ${errors.email ? 'login-input-error' : ''}`}
                placeholder="Masukkan email Anda"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                autoFocus={!isRegister}
              />
            </div>
            {errors.email && (
              <span className="login-field-error">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</span>
            )}
          </div>

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
                className={`login-input ${errors.password ? 'login-input-error' : ''}`}
                placeholder={isRegister ? 'Minimal 8 karakter' : 'Masukkan password Anda'}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
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
            {errors.password && (
              <span className="login-field-error">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</span>
            )}
          </div>

          {isRegister && (
            <div className="login-field login-field-animate">
              <label className="login-label" htmlFor="password_confirmation">Konfirmasi Password</label>
              <div className="login-input-group">
                <span className="login-input-icon">
                  <FiLock size={18} />
                </span>
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  className="login-input"
                  placeholder="Ulangi password Anda"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          )}

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
            ) : isRegister ? (
              <>
                <FiUserPlus size={18} />
                <span>Daftar</span>
              </>
            ) : (
              <>
                <FiLogIn size={18} />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        <div className="login-toggle">
          <p>
            {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
            <button
              type="button"
              className="login-toggle-btn"
              onClick={toggleMode}
            >
              {isRegister ? 'Masuk di sini' : 'Daftar sekarang'}
            </button>
          </p>
        </div>

        <div className="login-footer">
          <p>© 2025 Sistem Raport SD — Kelompok PBP</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
