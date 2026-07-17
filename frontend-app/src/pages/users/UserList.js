/**
 * ============================================
 * User List Page (Manajemen User)
 * ============================================
 * Full CRUD for user management with:
 * - Data table with search and pagination
 * - Add/Edit modal form
 * - Delete confirmation dialog
 * - Role badges (Admin/Guru)
 * - Toast notifications for all actions
 * ============================================
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiUser,
  FiMail,
  FiLock,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
} from 'react-icons/fi';

const UserList = () => {
  // ---- State ----
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guru',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: null,
    userName: '',
  });

  /**
   * Fetch all users from API
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      const result = response.data.data;
      // Handle paginated response (result.data) or plain array
      setUsers(Array.isArray(result) ? result : (result.data || []));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Gagal memuat data user.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Filter users by search query (name or email)
   */
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  /**
   * Pagination logic
   */
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Open modal for creating a new user
   */
  const openCreateModal = () => {
    setModalMode('create');
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'guru' });
    setModalOpen(true);
  };

  /**
   * Open modal for editing an existing user
   */
  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Optional for edit
      role: user.role,
    });
    setModalOpen(true);
  };

  /**
   * Close modal and reset form
   */
  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'guru' });
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submit (create or update)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (modalMode === 'create') {
        await api.post('/users', formData);
        toast.success('User berhasil ditambahkan! 🎉');
      } else {
        // For edit: only include password if it was filled
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.put(`/users/${editingUser.id}`, updateData);
        toast.success('User berhasil diperbarui! ✏️');
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan.';
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Open delete confirmation dialog
   */
  const openDeleteDialog = (user) => {
    setDeleteDialog({
      isOpen: true,
      userId: user.id,
      userName: user.name,
    });
  };

  /**
   * Confirm delete user
   */
  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteDialog.userId}`);
      toast.success('User berhasil dihapus! 🗑️');
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus user.';
      toast.error(message);
    } finally {
      setDeleteDialog({ isOpen: false, userId: null, userName: '' });
    }
  };

  // ---- Loading State ----
  if (loading) {
    return <LoadingSpinner message="Memuat data user..." />;
  }

  return (
    <div className="page-container">
      {/* ---- Page Header ---- */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Manajemen User</h1>
          <p className="page-description">
            Kelola akun pengguna sistem raport ({filteredUsers.length} user)
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <FiPlus size={18} />
          <span>Tambah User</span>
        </button>
      </div>

      {/* ---- Search Bar ---- */}
      <div className="search-bar">
        <div className="search-input-group">
          <FiSearch size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ---- Data Table ---- */}
      <div className="card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <FiUsers size={48} />
            <h3>Tidak ada data</h3>
            <p>
              {searchQuery
                ? 'Tidak ditemukan user yang cocok dengan pencarian.'
                : 'Belum ada user terdaftar. Tambahkan user baru.'}
            </p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td className="td-number">
                        {startIndex + index + 1}
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className="user-cell-avatar">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="user-cell-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="td-email">{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === 'admin' ? 'badge-admin' : 'badge-guru'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Guru'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-icon-edit"
                            onClick={() => openEditModal(user)}
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-icon-delete"
                            onClick={() => openDeleteDialog(user)}
                            title="Hapus"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`pagination-page ${
                          page === currentPage ? 'pagination-page-active' : ''
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---- Add/Edit Modal ---- */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === 'create' ? 'Tambah User Baru' : 'Edit User'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  <FiUser size={16} />
                  <span>Nama Lengkap</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="modal-email">
                  <FiMail size={16} />
                  <span>Email</span>
                </label>
                <input
                  id="modal-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Masukkan alamat email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="modal-password">
                  <FiLock size={16} />
                  <span>
                    Password{' '}
                    {modalMode === 'edit' && (
                      <small className="form-label-hint">(kosongkan jika tidak diubah)</small>
                    )}
                  </span>
                </label>
                <input
                  id="modal-password"
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder={
                    modalMode === 'edit'
                      ? 'Kosongkan jika tidak ingin mengubah'
                      : 'Masukkan password'
                  }
                  value={formData.password}
                  onChange={handleChange}
                  required={modalMode === 'create'}
                  minLength={modalMode === 'create' ? 6 : undefined}
                />
              </div>

              {/* Role */}
              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  <FiUsers size={16} />
                  <span>Role</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-input form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="guru">Guru</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{modalMode === 'create' ? 'Tambah User' : 'Simpan Perubahan'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Delete Confirmation ---- */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${deleteDialog.userName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteDialog({ isOpen: false, userId: null, userName: '' })
        }
        variant="danger"
      />
    </div>
  );
};

export default UserList;
