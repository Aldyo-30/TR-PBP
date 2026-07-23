/**
 * ============================================
 * Guru List Page (Manajemen Data Guru)
 * ============================================
 * Full CRUD for teacher management with:
 * - Reusable DataTable with built-in search
 * - Add/Edit modal using GuruForm
 * - Delete confirmation dialog
 * - Connected account statuses
 * - Badges for subjects taught
 * ============================================
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import GuruForm from '../../components/forms/GuruForm';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone, FiBookOpen } from 'react-icons/fi';

const GuruList = () => {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
    jenis_kelamin: 'L',
    alamat: '',
    no_telepon: '',
    user_id: '',
    mata_pelajaran_ids: [],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [editingGuru, setEditingGuru] = useState(null);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    guruId: null,
    guruNama: '',
  });

  const fetchGuru = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/guru');
      const result = response.data.data;
      setGuru(Array.isArray(result) ? result : (result.data || []));
    } catch (error) {
      console.error('Failed to fetch guru list:', error);
      toast.error('Gagal memuat data guru.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuru();
  }, [fetchGuru]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingGuru(null);
    setFormData({
      nip: '',
      nama: '',
      jenis_kelamin: 'L',
      alamat: '',
      no_telepon: '',
      user_id: '',
      mata_pelajaran_ids: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingGuru(item);
    setFormData({
      nip: item.nip,
      nama: item.nama,
      jenis_kelamin: item.jenis_kelamin,
      alamat: item.alamat || '',
      no_telepon: item.no_telepon || '',
      user_id: item.user_id || '',
      mata_pelajaran_ids: (item.mata_pelajaran || []).map((sub) => sub.id),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingGuru(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    // Transform empty user_id string to null
    const submitData = {
      ...formData,
      user_id: formData.user_id === '' ? null : parseInt(formData.user_id, 10),
    };

    try {
      if (modalMode === 'create') {
        await api.post('/guru', submitData);
        toast.success('Data guru berhasil ditambahkan! 🎉');
      } else {
        await api.put(`/guru/${editingGuru.id}`, submitData);
        toast.success('Data guru berhasil diperbarui! ✏️');
      }
      closeModal();
      fetchGuru();
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteDialog = (item) => {
    setDeleteDialog({
      isOpen: true,
      guruId: item.id,
      guruNama: item.nama,
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/guru/${deleteDialog.guruId}`);
      toast.success('Data guru berhasil dihapus! 🗑️');
      fetchGuru();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus data guru.';
      toast.error(message);
    } finally {
      setDeleteDialog({ isOpen: false, guruId: null, guruNama: '' });
    }
  };

  // DataTable column configuration
  const columns = [
    {
      header: 'NIP',
      accessor: 'nip',
      style: { fontWeight: '600', width: '150px' },
    },
    {
      header: 'Nama',
      accessor: 'nama',
      style: { fontWeight: '500' },
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.nama}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
            {row.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
          </div>
        </div>
      ),
    },
    {
      header: 'Kontak & Alamat',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          {row.no_telepon && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
              <FiPhone size={12} style={{ color: 'var(--accent-primary)' }} />
              <span>{row.no_telepon}</span>
            </div>
          )}
          {row.alamat && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FiMapPin size={12} style={{ color: 'var(--text-light)' }} />
              <span className="text-truncate" style={{ maxWidth: '200px' }}>{row.alamat}</span>
            </div>
          )}
          {!row.no_telepon && !row.alamat && <span style={{ color: 'var(--text-muted)' }}>-</span>}
        </div>
      ),
    },
    {
      header: 'Akun Sistem',
      accessor: 'user.email',
      render: (row) => (
        row.user ? (
          <div>
            <div className="badge badge-success" style={{ fontSize: '0.75rem' }}>Terhubung</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{row.user.email}</div>
          </div>
        ) : (
          <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>Belum Terhubung</span>
        )
      ),
    },
    {
      header: 'Mapel Diampu',
      render: (row) => {
        const subjects = row.mata_pelajaran || [];
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '220px' }}>
            {subjects.length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Belum ada</span>
            ) : (
              subjects.map((sub) => (
                <span
                  key={sub.id}
                  className="badge badge-info"
                  style={{
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.15rem',
                    padding: '0.2rem 0.4rem',
                  }}
                  title={sub.nama}
                >
                  <FiBookOpen size={10} />
                  {sub.nama.length > 15 ? sub.nama.substring(0, 15) + '...' : sub.nama}
                </span>
              ))
            )}
          </div>
        );
      },
    },
  ];

  // Render edit/delete action buttons
  const renderActions = (item) => (
    <>
      <button
        className="btn btn-outline-info btn-sm"
        onClick={() => openEditModal(item)}
        title="Edit Guru"
        style={{ padding: '0.35rem' }}
      >
        <FiEdit2 size={14} />
      </button>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => openDeleteDialog(item)}
        title="Hapus Guru"
        style={{ padding: '0.35rem' }}
      >
        <FiTrash2 size={14} />
      </button>
    </>
  );

  if (loading) {
    return <LoadingSpinner message="Memuat data guru..." />;
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Data Guru</h1>
          <p className="page-description">
            Kelola data guru dan wali kelas ({guru.length} guru)
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <FiPlus size={18} />
          <span>Tambah Guru</span>
        </button>
      </div>

      {/* Main Data Table Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <DataTable
          columns={columns}
          data={guru}
          searchPlaceholder="Cari guru berdasarkan nama atau NIP..."
          searchKeys={['nip', 'nama', 'no_telepon', 'alamat']}
          renderActions={renderActions}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Tambah Data Guru' : 'Edit Data Guru'}
        maxWidth="550px"
      >
        <GuruForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Hapus Data Guru"
        message={`Apakah Anda yakin ingin menghapus data guru "${deleteDialog.guruNama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, guruId: null, guruNama: '' })}
        type="danger"
      />
    </div>
  );
};

export default GuruList;
