import React, { useState, useEffect } from 'react';

export default function TahunAjaranForm({ onSubmit, selectedData, onCancel }) {
  const [formData, setFormData] = useState({ tahun: '', semester: 'Ganjil' });

  useEffect(() => {
    if (selectedData) setFormData(selectedData);
    else setFormData({ tahun: '', semester: 'Ganjil' });
  }, [selectedData]);

  return (
    <form 
      style={{
        background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1', marginBottom: '24px'
      }} 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ tahun: '', semester: 'Ganjil' });
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>
        {selectedData ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
      </h3>
      
      <div className="premium-form-grid">
        <div className="form-group">
          <label>Tahun Ajaran</label>
          <input
            className="form-input"
            value={formData.tahun}
            onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
            placeholder="2023/2024"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Semester</label>
          <select 
            className="form-input" 
            value={formData.semester} 
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
          >
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
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