/**
 * ============================================
 * Siswa List Page (Manajemen Data Siswa)
 * ============================================
 * Full CRUD for student management with:
 * - Reusable DataTable with search by name, NIS, NISN
 * - Dropdown filter by Class (Kelas)
 * - Add/Edit modal using SiswaForm
 * - Delete confirmation dialog
 * - Formatting for Birth Details (TTL) and Wali info
 * ============================================
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SiswaForm from '../../components/forms/SiswaForm';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiHome, FiInfo } from 'react-icons/fi';

const SiswaList = () => {
  const [siswa, setSiswa] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    nama: '',
    jenis_kelamin: 'L',
    tempat_lahir: '',
    tanggal_lahir: '',
    tanggal_reveal: '',
    alamat: '',
    nama_ortu_wali: '',
    kelas_id: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    siswaId: null,
    siswaNama: '',
  });

  const fetchSiswa = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedClassFilter) {
        params.kelas_id = selectedClassFilter;
      }
      const response = await api.get('/siswa', { params });
      const result = response.data.data;
      setSiswa(Array.isArray(result) ? result : (result.data || []));
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Gagal memuat data siswa.');
    } finally {
      setLoading(false);
    }
  }, [selectedClassFilter]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get('/kelas');
      const result = response.data.data;
      setClasses(Array.isArray(result) ? result : (result.data || []));
    } catch (error) {
      console.error('Failed to fetch classes for filter:', error);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchSiswa();
  }, [fetchSiswa]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingSiswa(null);
    setFormData({
      nis: '',
      nisn: '',
      nama: '',
      jenis_kelamin: 'L',
      tempat_lahir: '',
      tanggal_lahir: '',
      tanggal_reveal: '',
      alamat: '',
      nama_ortu_wali: '',
      kelas_id: selectedClassFilter || '', // pre-select filter class if chosen
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    // Format date value (YYYY-MM-DD) from date object or string
    let formattedDate = '';
    if (item.tanggal_lahir) {
      const dateObj = new Date(item.tanggal_lahir);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0];
      } else {
        formattedDate = String(item.tanggal_lahir).split(' ')[0];
      }
    }

    setModalMode('edit');
    setEditingSiswa(item);
    setFormData({
      nis: item.nis,
      nisn: item.nisn,
      nama: item.nama,
      jenis_kelamin: item.jenis_kelamin,
      tempat_lahir: item.tempat_lahir,
      tanggal_lahir: formattedDate,
      tanggal_reveal: formattedDate,
      alamat: item.alamat || '',
      nama_ortu_wali: item.nama_ortu_wali,
      kelas_id: item.kelas_id || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSiswa(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const submitData = {
      ...formData,
      kelas_id: formData.kelas_id === '' ? null : parseInt(formData.kelas_id, 10),
    };
    // Clean temporary UI bindings
    delete submitData.tanggal_reveal;

    try {
      if (modalMode === 'create') {
        await api.post('/siswa', submitData);
        toast.success('Data siswa berhasil ditambahkan! 🎉');
      } else {
        await api.put(`/siswa/${editingSiswa.id}`, submitData);
        toast.success('Data siswa berhasil diperbarui! ✏️');
      }
      closeModal();
      fetchSiswa();
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
      siswaId: item.id,
      siswaNama: item.nama,
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/siswa/${deleteDialog.siswaId}`);
      toast.success('Data siswa berhasil dihapus! 🗑️');
      fetchSiswa();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus data siswa.';
      toast.error(message);
    } finally {
      setDeleteDialog({ isOpen: false, siswaId: null, siswaNama: '' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // DataTable column configuration
  const columns = [
    {
      header: 'Identitas',
      accessor: 'nis',
      style: { width: '180px' },
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>NIS: {row.nis}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NISN: {row.nisn}</div>
        </div>
      ),
    },
    {
      header: 'Nama Siswa',
      accessor: 'nama',
      style: { fontWeight: '500' },
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.nama}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', marginTop: '0.15rem' }}>
            <span>{row.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
            <span>•</span>
            <span style={{ fontStyle: 'italic' }}>
              TTL: {row.tempat_lahir}, {formatDate(row.tanggal_lahir)}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Orang Tua / Wali',
      accessor: 'nama_ortu_wali',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem' }}>
          <FiUser style={{ color: 'var(--text-light)' }} />
          <span>{row.nama_ortu_wali}</span>
        </div>
      ),
    },
    {
      header: 'Kelas',
      accessor: 'kelas.nama_kelas',
      style: { width: '140px' },
      render: (row) => (
        row.kelas ? (
          <div>
            <div className="badge badge-info" style={{ fontWeight: '600', fontSize: '0.8rem' }}>
              Kelas {row.kelas.nama_kelas}
            </div>
            {row.kelas.tahun_ajaran && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                TA: {row.kelas.tahun_ajaran.tahun}
              </div>
            )}
          </div>
        ) : (
          <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>Belum masuk kelas</span>
        )
      ),
    },
    {
      header: 'Alamat',
      accessor: 'alamat',
      render: (row) => (
        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.25rem', maxWidth: '200px' }}>
          <FiHome size={12} style={{ color: 'var(--text-light)', marginTop: '0.2rem', flexShrink: 0 }} />
          <span className="text-truncate" style={{ maxWidth: '180px' }} title={row.alamat}>
            {row.alamat || '-'}
          </span>
        </div>
      ),
    },
  ];

  const renderActions = (item) => (
    <>
      <button
        className="btn btn-outline-info btn-sm"
        onClick={() => openEditModal(item)}
        title="Edit Siswa"
        style={{ padding: '0.35rem' }}
      >
        <FiEdit2 size={14} />
      </button>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => openDeleteDialog(item)}
        title="Hapus Siswa"
        style={{ padding: '0.35rem' }}
      >
        <FiTrash2 size={14} />
      </button>
    </>
  );

  if (loading && siswa.length === 0) {
    return <LoadingSpinner message="Memuat data siswa..." />;
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Data Siswa</h1>
          <p className="page-description">
            Kelola data siswa, informasi wali, dan kelas masing-masing
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <FiPlus size={18} />
          <span>Tambah Siswa</span>
        </button>
      </div>

      {/* Filter and Table Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {/* Custom Filters */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Filter Kelas:
          </label>
          <select
            className="form-select form-input"
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            style={{ width: '220px', margin: 0 }}
          >
            <option value="">-- Semua Kelas --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Kelas {c.nama_kelas} ({c.tahun_ajaran?.tahun || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <DataTable
          columns={columns}
          data={siswa}
          searchPlaceholder="Cari siswa berdasarkan nama, NIS, atau NISN..."
          searchKeys={['nis', 'nisn', 'nama', 'nama_ortu_wali', 'alamat']}
          renderActions={renderActions}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Tambah Data Siswa' : 'Edit Data Siswa'}
        maxWidth="600px"
      >
        <SiswaForm
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
        title="Hapus Data Siswa"
        message={`Apakah Anda yakin ingin menghapus data siswa "${deleteDialog.siswaNama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, siswaId: null, siswaNama: '' })}
        type="danger"
      />
    </div>
  );
};

export default SiswaList;
