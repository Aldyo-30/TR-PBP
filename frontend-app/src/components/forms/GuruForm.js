/**
 * ============================================
 * GuruForm Component
 * ============================================
 * Form component for creating or editing Guru.
 * Handles inputs for NIP, Nama, Jenis Kelamin,
 * Alamat, No Telepon, User Account linking,
 * and Mata Pelajaran assignments.
 * ============================================
 */

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';

const GuruForm = ({ formData, setFormData, onSubmit, onCancel, loading }) => {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    const loadFormDependencies = async () => {
      setFetchingData(true);
      try {
        // Fetch users with role 'guru'
        const usersResponse = await api.get('/users?role=guru');
        const usersData = usersResponse.data.data;
        setUsers(Array.isArray(usersData) ? usersData : (usersData.data || []));
      } catch (error) {
        console.error('Failed to load users for guru link:', error);
      }

      try {
        // Fetch subjects (mata-pelajaran)
        const subjectsResponse = await api.get('/mata-pelajaran');
        const subjectsData = subjectsResponse.data.data;
        setSubjects(Array.isArray(subjectsData) ? subjectsData : (subjectsData.data || []));
      } catch (error) {
        console.error('Failed to load subjects for guru mapping:', error);
        // Fallback mock subjects in case Josan's part is not seeded/migrated yet
        setSubjects([
          { id: 1, kode: 'MAPEL-AGM', nama: 'Pendidikan Agama', kkm: 75 },
          { id: 2, kode: 'MAPEL-PKN', 'nama': 'Pendidikan Pancasila dan Kewarganegaraan (PKn)', kkm: 70 },
          { id: 3, kode: 'MAPEL-IND', nama: 'Bahasa Indonesia', kkm: 70 },
          { id: 4, kode: 'MAPEL-MTK', nama: 'Matematika', kkm: 70 },
          { id: 5, kode: 'MAPEL-IPA', nama: 'Ilmu Pengetahuan Alam (IPA)', kkm: 70 },
          { id: 6, kode: 'MAPEL-IPS', nama: 'Ilmu Pengetahuan Sosial (IPS)', kkm: 70 },
        ]);
      } finally {
        setFetchingData(false);
      }
    };

    loadFormDependencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subjectId) => {
    const currentSubjectIds = formData.mata_pelajaran_ids || [];
    let updatedSubjectIds;
    if (currentSubjectIds.includes(subjectId)) {
      updatedSubjectIds = currentSubjectIds.filter((id) => id !== subjectId);
    } else {
      updatedSubjectIds = [...currentSubjectIds, subjectId];
    }
    setFormData((prev) => ({ ...prev, mata_pelajaran_ids: updatedSubjectIds }));
  };

  if (fetchingData) {
    return <LoadingSpinner message="Memuat pilihan form..." />;
  }

  return (
    <form onSubmit={onSubmit} className="modal-form">
      {/* NIP */}
      <div className="form-group">
        <label htmlFor="nip" className="form-label">
          NIP <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="nip"
          name="nip"
          className="form-input"
          placeholder="Masukkan NIP (e.g. 19800101...)"
          value={formData.nip}
          onChange={handleChange}
          required
        />
      </div>

      {/* Nama */}
      <div className="form-group">
        <label htmlFor="nama" className="form-label">
          Nama Lengkap <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          className="form-input"
          placeholder="Masukkan Nama Lengkap beserta gelar"
          value={formData.nama}
          onChange={handleChange}
          required
        />
      </div>

      {/* Jenis Kelamin */}
      <div className="form-group">
        <label className="form-label">
          Jenis Kelamin <span className="text-danger">*</span>
        </label>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="jenis_kelamin"
              value="L"
              checked={formData.jenis_kelamin === 'L'}
              onChange={handleChange}
              required
            />
            <span>Laki-laki</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="jenis_kelamin"
              value="P"
              checked={formData.jenis_kelamin === 'P'}
              onChange={handleChange}
              required
            />
            <span>Perempuan</span>
          </label>
        </div>
      </div>

      {/* No Telepon */}
      <div className="form-group">
        <label htmlFor="no_telepon" className="form-label">
          No. Telepon
        </label>
        <input
          type="text"
          id="no_telepon"
          name="no_telepon"
          className="form-input"
          placeholder="Masukkan No. Telepon (e.g. 0812...)"
          value={formData.no_telepon || ''}
          onChange={handleChange}
        />
      </div>

      {/* Alamat */}
      <div className="form-group">
        <label htmlFor="alamat" className="form-label">
          Alamat
        </label>
        <textarea
          id="alamat"
          name="alamat"
          className="form-input"
          placeholder="Masukkan Alamat Lengkap"
          value={formData.alamat || ''}
          onChange={handleChange}
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* User Account Link */}
      <div className="form-group">
        <label htmlFor="user_id" className="form-label">
          Hubungkan Akun User <span className="form-label-hint">(Opsional)</span>
        </label>
        <select
          id="user_id"
          name="user_id"
          className="form-select form-input"
          value={formData.user_id || ''}
          onChange={handleChange}
        >
          <option value="">-- Tanpa Akun User --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Menghubungkan guru dengan akun user agar guru dapat login dan menginput nilai.
        </p>
      </div>

      {/* Mata Pelajaran (Checkboxes) */}
      <div className="form-group">
        <label className="form-label">
          Mata Pelajaran yang Diampu
        </label>
        <div style={{
          maxHeight: '150px',
          overflowY: 'auto',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.5rem',
          background: 'var(--bg-card)'
        }}>
          {subjects.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mata pelajaran tidak tersedia</span>
          ) : (
            subjects.map((sub) => (
              <label key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={(formData.mata_pelajaran_ids || []).includes(sub.id)}
                  onChange={() => handleSubjectChange(sub.id)}
                />
                <span>{sub.nama} ({sub.kode})</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="modal-actions">
        <button className="btn btn-outline" type="button" onClick={onCancel} disabled={loading}>
          Batal
        </button>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </form>
  );
};

export default GuruForm;
