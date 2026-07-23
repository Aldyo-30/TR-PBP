import React, { useState, useEffect } from 'react';

export default function MapelForm({ onSubmit, selectedData, onCancel }) {
  const [formData, setFormData] = useState({ kode: '', nama: '', kkm: '' });

  useEffect(() => {
    if (selectedData) setFormData(selectedData);
    else setFormData({ kode: '', nama: '', kkm: '' });
  }, [selectedData]);

  return (
    <form 
      style={{
        background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1', marginBottom: '24px'
      }} 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ kode: '', nama: '', kkm: '' });
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>
        {selectedData ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
      </h3>
      
      <div className="premium-form-grid">
        <div className="form-group">
          <label>Kode Mapel</label>
          <input
            className="form-input"
            value={formData.kode}
            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
            placeholder="M01"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Nama Mapel</label>
          <input
            className="form-input"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            placeholder="Matematika"
            required
          />
        </div>
        
        <div className="form-group">
          <label>KKM</label>
          <input
            className="form-input"
            type="number"
            value={formData.kkm}
            onChange={(e) => setFormData({ ...formData, kkm: e.target.value })}
            placeholder="75"
            required
          />
        </div>
      </div>
      
      <div className="action-buttons">
        <button type="submit" className="btn-premium btn-success">
          💾 {selectedData ? 'Update' : 'Simpan'}
        </button>
        {selectedData && (
          <button type="button" className="btn-premium btn-secondary" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}