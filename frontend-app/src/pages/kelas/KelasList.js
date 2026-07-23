/**
 * ============================================
 * Kelas List Page (Manajemen Data Kelas)
 * ============================================
 * Full CRUD for class management with:
 * - Reusable DataTable with built-in search
 * - Add/Edit modal using KelasForm
 * - Delete confirmation dialog
 * - Link status for Wali Kelas
 * - Display for Student Counts & Academic Year
 * ============================================
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import KelasForm from '../../components/forms/KelasForm';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUser, FiUsers } from 'react-icons/fi';

const KelasList = () => {
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearFilter, setSelectedYearFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({
    nama_kelas: '',
    guru_id: '',
    tahun_ajaran_id: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [editingKelas, setEditingKelas] = useState(null);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    kelasId: null,
    kelasNama: '',
  });

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedYearFilter) {
        params.tahun_ajaran_id = selectedYearFilter;
      }
      const response = await api.get('/kelas', { params });
      const result = response.data.data;
      setClasses(Array.isArray(result) ? result : (result.data || []));
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error('Gagal memuat data kelas.');
    } finally {
      setLoading(false);
    }
  }, [selectedYearFilter]);

  const fetchAcademicYears = useCallback(async () => {
    try {
      const response = await api.get('/tahun-ajaran');
      const result = response.data.data;
      setAcademicYears(Array.isArray(result) ? result : (result.data || []));
    } catch (error) {
      console.error('Failed to fetch academic years for filter:', error);
      // Fallback academic years
      setAcademicYears([
        { id: 1, tahun: '2024/2025', semester: 'Ganjil', is_active: true },
        { id: 2, tahun: '2024/2025', semester: 'Genap', is_active: false },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchAcademicYears();
  }, [fetchAcademicYears]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingKelas(null);
    // Find active year for initial selection
    const activeYear = academicYears.find(y => y.is_active);
    setFormData({
      nama_kelas: '',
      guru_id: '',
      tahun_ajaran_id: activeYear ? activeYear.id : '',
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingKelas(item);
    setFormData({
      nama_kelas: item.nama_kelas,
      guru_id: item.guru_id || '',
      tahun_ajaran_id: item.tahun_ajaran_id,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingKelas(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const submitData = {
      ...formData,
      guru_id: formData.guru_id === '' ? null : parseInt(formData.guru_id, 10),
      tahun_ajaran_id: parseInt(formData.tahun_ajaran_id, 10),
    };

    try {
      if (modalMode === 'create') {
        await api.post('/kelas', submitData);
        toast.success('Data kelas berhasil ditambahkan! 🎉');
      } else {
        await api.put(`/kelas/${editingKelas.id}`, submitData);
        toast.success('Data kelas berhasil diperbarui! ✏️');
      }
      closeModal();
      fetchClasses();
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
      kelasId: item.id,
      kelasNama: item.nama_kelas,
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/kelas/${deleteDialog.kelasId}`);
      toast.success('Data kelas berhasil dihapus! 🗑️');
      fetchClasses();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus data kelas.';
      toast.error(message);
    } finally {
      setDeleteDialog({ isOpen: false, kelasId: null, kelasNama: '' });
    }
  };

  // DataTable column configuration
  const columns = [
    {
      header: 'Nama Kelas',
      accessor: 'nama_kelas',
      style: { fontWeight: '600', width: '150px' },
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🏫</span>
          <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: '700' }}>
            Kelas {row.nama_kelas}
          </span>
        </div>
      ),
    },
    {
      header: 'Wali Kelas',
      accessor: 'guru.nama',
      render: (row) => (
        row.guru ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiUser style={{ color: 'var(--text-light)' }} />
            <div>
              <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{row.guru.nama}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIP: {row.guru.nip}</div>
            </div>
          </div>
        ) : (
          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Belum ditentukan</span>
        )
      ),
    },
    {
      header: 'Tahun Ajaran',
      accessor: 'tahun_ajaran.tahun',
      render: (row) => (
        row.tahun_ajaran ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCalendar style={{ color: 'var(--text-light)' }} />
            <div>
              <div style={{ fontWeight: '500' }}>Tahun {row.tahun_ajaran.tahun}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Semester {row.tahun_ajaran.semester}</div>
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>-</span>
        )
      ),
    },
    {
      header: 'Jumlah Siswa',
      accessor: 'siswa_count',
      style: { textAlign: 'center', width: '150px' },
      render: (row) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(59, 130, 246, 0.08)', padding: '0.3rem 0.6rem', borderRadius: '20px', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
          <FiUsers size={14} />
          <span>{row.siswa_count ?? 0} Siswa</span>
        </div>
      ),
    },
  ];

  const renderActions = (item) => (
    <>
      <button
        className="btn btn-outline-info btn-sm"
        onClick={() => openEditModal(item)}
        title="Edit Kelas"
        style={{ padding: '0.35rem' }}
      >
        <FiEdit2 size={14} />
      </button>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => openDeleteDialog(item)}
        title="Hapus Kelas"
        style={{ padding: '0.35rem' }}
      >
        <FiTrash2 size={14} />
      </button>
    </>
  );

  if (loading && classes.length === 0) {
    return <LoadingSpinner message="Memuat data kelas..." />;
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Data Kelas</h1>
          <p className="page-description">
            Kelola data kelas, wali kelas, dan hubungannya dengan tahun ajaran
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <FiPlus size={18} />
          <span>Tambah Kelas</span>
        </button>
      </div>

      {/* Filter and Table Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {/* Custom Filters */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Filter Tahun Ajaran:
          </label>
          <select
            className="form-select form-input"
            value={selectedYearFilter}
            onChange={(e) => setSelectedYearFilter(e.target.value)}
            style={{ width: '220px', margin: 0 }}
          >
            <option value="">-- Semua Tahun Ajaran --</option>
            {academicYears.map((y) => (
              <option key={y.id} value={y.id}>
                {y.tahun} - Semester {y.semester} {y.is_active ? '(Aktif)' : ''}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          columns={columns}
          data={classes}
          searchPlaceholder="Cari kelas berdasarkan nama..."
          searchKeys={['nama_kelas', 'guru.nama', 'tahun_ajaran.tahun']}
          renderActions={renderActions}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Tambah Data Kelas' : 'Edit Data Kelas'}
        maxWidth="500px"
      >
        <KelasForm
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
        title="Hapus Data Kelas"
        message={`Apakah Anda yakin ingin menghapus data kelas "${deleteDialog.kelasNama}"? Seluruh siswa dalam kelas ini akan kehilangan asosiasi kelas mereka.`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, kelasId: null, kelasNama: '' })}
        type="danger"
      />
    </div>
  );
};

export default KelasList;
