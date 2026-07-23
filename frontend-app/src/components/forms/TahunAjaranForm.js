import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

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
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
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
      
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}>
          <FiSave /> {selectedData ? 'Update Tahun Ajaran' : 'Simpan Tahun Ajaran'}
        </button>
        {selectedData && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}>
            <FiX /> Batal
          </button>
        )}
      </div>
    </form>
  );
}