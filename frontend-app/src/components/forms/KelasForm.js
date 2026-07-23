

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiSave, FiX } from 'react-icons/fi';

const KelasForm = ({ formData, setFormData, onSubmit, onCancel, loading }) => {
  const [teachers, setTeachers] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    const loadFormDependencies = async () => {
      setFetchingData(true);
      try {
        const teachersResponse = await api.get('/guru');
        const teachersData = teachersResponse.data.data;
        setTeachers(Array.isArray(teachersData) ? teachersData : (teachersData.data || []));
      } catch (error) {
        console.error('Failed to load teachers for Wali Kelas selection:', error);
      }

      try {
        const yearsResponse = await api.get('/tahun-ajaran');
        const yearsData = yearsResponse.data.data;
        setAcademicYears(Array.isArray(yearsData) ? yearsData : (yearsData.data || []));
      } catch (error) {
        console.error('Failed to load academic years:', error);
        setAcademicYears([
          { id: 1, tahun: '2024/2025', semester: 'Ganjil', is_active: true },
          { id: 2, tahun: '2024/2025', semester: 'Genap', is_active: false },
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

  if (fetchingData) {
    return <LoadingSpinner message="Memuat pilihan form..." />;
  }

  return (
    <form onSubmit={onSubmit} className="modal-form">

      <div className="form-group">
        <label htmlFor="nama_kelas" className="form-label">
          Nama Kelas <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="nama_kelas"
          name="nama_kelas"
          className="form-input"
          placeholder="Masukkan Nama Kelas (e.g. 1A, 6B)"
          value={formData.nama_kelas}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="guru_id" className="form-label">
          Wali Kelas <span className="form-label-hint">(Opsional)</span>
        </label>
        <select
          id="guru_id"
          name="guru_id"
          className="form-select form-input"
          value={formData.guru_id || ''}
          onChange={handleChange}
        >
          <option value="">-- Tanpa Wali Kelas --</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nama} (NIP: {t.nip})
            </option>
          ))}
        </select>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Guru yang ditunjuk sebagai penanggung jawab kelas.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="tahun_ajaran_id" className="form-label">
          Tahun Ajaran & Semester <span className="text-danger">*</span>
        </label>
        <select
          id="tahun_ajaran_id"
          name="tahun_ajaran_id"
          className="form-select form-input"
          value={formData.tahun_ajaran_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Pilih Tahun Ajaran --</option>
          {academicYears.map((y) => (
            <option key={y.id} value={y.id}>
              {y.tahun} - Semester {y.semester} {y.is_active ? '(Aktif)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}>
          <FiX /> Batal
        </button>
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}>
          <FiSave /> {loading ? 'Menyimpan...' : 'Simpan Data Kelas'}
        </button>
      </div>
    </form>
  );
};

export default KelasForm;
