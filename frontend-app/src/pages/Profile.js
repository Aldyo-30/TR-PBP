

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
  FiShield,
  FiTrash2,
  FiAlertTriangle,
} from 'react-icons/fi';
import '../styles/profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileErrors({});

    try {
      const response = await api.put('/profile', profileData);
      const updatedUser = response.data.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();

      toast.success('Profil berhasil diperbarui! ✅');
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setProfileErrors(error.response.data.errors);
        const first = Object.values(error.response.data.errors)[0];
        toast.error(Array.isArray(first) ? first[0] : first);
      } else {
        toast.error(error.response?.data?.message || 'Gagal memperbarui profil.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordErrors({});

    try {
      await api.put('/profile/password', passwordData);
      toast.success('Password berhasil diperbarui! 🔒');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
        const first = Object.values(error.response.data.errors)[0];
        toast.error(Array.isArray(first) ? first[0] : first);
      } else {
        toast.error(error.response?.data?.message || 'Gagal memperbarui password.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Password wajib diisi untuk konfirmasi.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await api.delete('/profile', {
        data: { password: deletePassword },
      });
      toast.success('Akun berhasil dihapus.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 422) {
        setDeleteError('Password salah. Silakan coba lagi.');
      } else {
        setDeleteError(error.response?.data?.message || 'Gagal menghapus akun.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const getError = (errors, field) => {
    const err = errors[field];
    if (!err) return null;
    return Array.isArray(err) ? err[0] : err;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Profil Saya</h1>
        <p className="page-description">
          Kelola informasi profil, password, dan pengaturan akun Anda.
        </p>
      </div>

      <div className="profile-sections">

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon profile-card-icon-blue">
              <FiUser size={22} />
            </div>
            <div>
              <h2 className="profile-card-title">Informasi Profil</h2>
              <p className="profile-card-desc">
                Perbarui nama dan alamat email akun Anda.
              </p>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <div className="profile-form-group">
              <label className="profile-label" htmlFor="profile-name">
                <FiUser size={15} />
                <span>Nama Lengkap</span>
              </label>
              <input
                id="profile-name"
                type="text"
                name="name"
                className={`profile-input ${profileErrors.name ? 'profile-input-error' : ''}`}
                value={profileData.name}
                onChange={handleProfileChange}
                required
                autoComplete="name"
              />
              {getError(profileErrors, 'name') && (
                <span className="profile-field-error">{getError(profileErrors, 'name')}</span>
              )}
            </div>

            <div className="profile-form-group">
              <label className="profile-label" htmlFor="profile-email">
                <FiMail size={15} />
                <span>Email</span>
              </label>
              <input
                id="profile-email"
                type="email"
                name="email"
                className={`profile-input ${profileErrors.email ? 'profile-input-error' : ''}`}
                value={profileData.email}
                onChange={handleProfileChange}
                required
                autoComplete="email"
              />
              {getError(profileErrors, 'email') && (
                <span className="profile-field-error">{getError(profileErrors, 'email')}</span>
              )}
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <><span className="btn-spinner" /><span>Menyimpan...</span></>
                ) : (
                  <><FiSave size={16} /><span>Simpan</span></>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon profile-card-icon-green">
              <FiShield size={22} />
            </div>
            <div>
              <h2 className="profile-card-title">Ubah Password</h2>
              <p className="profile-card-desc">
                Pastikan akun Anda menggunakan password yang kuat dan unik.
              </p>
            </div>
          </div>

          <form className="profile-form" onSubmit={handlePasswordSubmit}>

            <div className="profile-form-group">
              <label className="profile-label" htmlFor="current-password">
                <FiLock size={15} />
                <span>Password Saat Ini</span>
              </label>
              <div className="profile-input-wrapper">
                <input
                  id="current-password"
                  type={showCurrentPass ? 'text' : 'password'}
                  name="current_password"
                  className={`profile-input ${passwordErrors.current_password ? 'profile-input-error' : ''}`}
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  className="profile-pass-toggle"
                  onClick={() => setShowCurrentPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showCurrentPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {getError(passwordErrors, 'current_password') && (
                <span className="profile-field-error">{getError(passwordErrors, 'current_password')}</span>
              )}
            </div>

            <div className="profile-form-group">
              <label className="profile-label" htmlFor="new-password">
                <FiLock size={15} />
                <span>Password Baru</span>
              </label>
              <div className="profile-input-wrapper">
                <input
                  id="new-password"
                  type={showNewPass ? 'text' : 'password'}
                  name="password"
                  className={`profile-input ${passwordErrors.password ? 'profile-input-error' : ''}`}
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  className="profile-pass-toggle"
                  onClick={() => setShowNewPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showNewPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {getError(passwordErrors, 'password') && (
                <span className="profile-field-error">{getError(passwordErrors, 'password')}</span>
              )}
            </div>

            <div className="profile-form-group">
              <label className="profile-label" htmlFor="confirm-password">
                <FiLock size={15} />
                <span>Konfirmasi Password Baru</span>
              </label>
              <div className="profile-input-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  name="password_confirmation"
                  className={`profile-input ${passwordErrors.password_confirmation ? 'profile-input-error' : ''}`}
                  value={passwordData.password_confirmation}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="new-password"
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  className="profile-pass-toggle"
                  onClick={() => setShowConfirmPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {getError(passwordErrors, 'password_confirmation') && (
                <span className="profile-field-error">{getError(passwordErrors, 'password_confirmation')}</span>
              )}
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <><span className="btn-spinner" /><span>Menyimpan...</span></>
                ) : (
                  <><FiSave size={16} /><span>Ubah Password</span></>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="profile-card profile-card-danger">
          <div className="profile-card-header">
            <div className="profile-card-icon profile-card-icon-red">
              <FiAlertTriangle size={22} />
            </div>
            <div>
              <h2 className="profile-card-title">Hapus Akun</h2>
              <p className="profile-card-desc">
                Setelah akun dihapus, semua data dan resource akan dihapus secara permanen.
                Sebelum menghapus, pastikan Anda sudah menyimpan data penting.
              </p>
            </div>
          </div>

          <div className="profile-delete-section">
            <button
              className="btn btn-danger"
              onClick={() => setDeleteDialog(true)}
            >
              <FiTrash2 size={16} />
              <span>Hapus Akun Saya</span>
            </button>
          </div>
        </div>
      </div>

      {deleteDialog && (
        <div className="modal-overlay" onClick={() => { setDeleteDialog(false); setDeleteError(''); setDeletePassword(''); }}>
          <div className="modal profile-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: '#ef4444' }}>
                <FiAlertTriangle size={20} style={{ marginRight: '8px' }} />
                Hapus Akun
              </h2>
            </div>

            <div className="profile-delete-body">
              <p className="profile-delete-warning">
                Apakah Anda yakin ingin menghapus akun? Setelah dihapus, semua data
                dan resource akan dihapus secara <strong>permanen</strong>.
                Masukkan password untuk mengkonfirmasi.
              </p>

              <div className="profile-form-group">
                <label className="profile-label" htmlFor="delete-password">
                  <FiLock size={15} />
                  <span>Password</span>
                </label>
                <input
                  id="delete-password"
                  type="password"
                  className={`profile-input ${deleteError ? 'profile-input-error' : ''}`}
                  value={deletePassword}
                  onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
                  placeholder="Masukkan password Anda"
                  autoComplete="current-password"
                />
                {deleteError && (
                  <span className="profile-field-error">{deleteError}</span>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setDeleteDialog(false); setDeleteError(''); setDeletePassword(''); }}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <><span className="btn-spinner" /><span>Menghapus...</span></>
                ) : (
                  <><FiTrash2 size={16} /><span>Ya, Hapus Akun</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
