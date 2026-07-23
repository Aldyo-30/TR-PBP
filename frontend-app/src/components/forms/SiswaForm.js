

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiSave, FiX } from 'react-icons/fi';

const SiswaForm = ({ formData, setFormData, onSubmit, onCancel, loading }) => {
  const [classes, setClasses] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      setFetchingData(true);
      try {
        const response = await api.get('/kelas');
        const result = response.data.data;
        setClasses(Array.isArray(result) ? result : (result.data || []));
      } catch (error) {
        console.error('Failed to load classes for Siswa selection:', error);
      } finally {
        setFetchingData(false);
      }
    };

    loadClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (fetchingData) {
    return <LoadingSpinner message="Memuat pilihan kelas..." />;
  }

  return (
    <form onSubmit={onSubmit} className="modal-form">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        <div className="form-group">
          <label htmlFor="nis" className="form-label">
            NIS <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="nis"
            name="nis"
            className="form-input"
            placeholder="Nomor Induk Siswa"
            value={formData.nis}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nisn" className="form-label">
            NISN <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="nisn"
            name="nisn"
            className="form-input"
            placeholder="NISN Nasional"
            value={formData.nisn}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nama" className="form-label">
          Nama Lengkap <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          className="form-input"
          placeholder="Masukkan Nama Lengkap Siswa"
          value={formData.nama}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        <div className="form-group">
          <label className="form-label">
            Jenis Kelamin <span className="text-danger">*</span>
          </label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.9rem' }}>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.9rem' }}>
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

        <div className="form-group">
          <label htmlFor="kelas_id" className="form-label">
            Kelas
          </label>
          <select
            id="kelas_id"
            name="kelas_id"
            className="form-select form-input"
            value={formData.kelas_id || ''}
            onChange={handleChange}
          >
            <option value="">-- Belum Masuk Kelas --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Kelas {cls.nama_kelas} ({cls.tahun_ajaran?.tahun || 'N/A'})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        <div className="form-group">
          <label htmlFor="tempat_reveal" className="form-label">
            Tempat Lahir <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="tempat_lahir"
            name="tempat_lahir"
            className="form-input"
            placeholder="Kota Kelahiran"
            value={formData.tempat_lahir}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tanggal_lahir" className="form-label">
            Tanggal Lahir <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            id="tanggal_reveal"
            name="tanggal_reveal"
            className="form-input"
            value={formData.tanggal_reveal || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, tanggal_reveal: e.target.value, tanggal_lahir: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nama_ortu_wali" className="form-label">
          Nama Orang Tua / Wali <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="nama_ortu_wali"
          name="nama_ortu_wali"
          className="form-input"
          placeholder="Nama Ayah/Ibu/Wali Siswa"
          value={formData.nama_ortu_wali}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="alamat" className="form-label">
          Alamat Rumah
        </label>
        <textarea
          id="alamat"
          name="alamat"
          className="form-input"
          placeholder="Alamat Lengkap Siswa"
          value={formData.alamat || ''}
          onChange={handleChange}
          rows={2}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}>
          <FiX /> Batal
        </button>
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}>
          <FiSave /> {loading ? 'Menyimpan...' : 'Simpan Data Siswa'}
        </button>
      </div>
    </form>
  );
};

export default SiswaForm;
