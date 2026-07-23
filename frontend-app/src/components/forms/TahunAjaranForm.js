import React, { useState, useEffect } from 'react';

export default function TahunAjaranForm({ onSubmit, selectedData, onCancel }) {
  const [formData, setFormData] = useState({ tahun_ajaran: '', semester: 'Ganjil' });

  useEffect(() => {
    if (selectedData) setFormData(selectedData);
  }, [selectedData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ tahun_ajaran: '', semester: 'Ganjil' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{selectedData ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}</h3>
      <input
        type="text"
        placeholder="Contoh: 2024/2025"
        value={formData.tahun_ajaran}
        onChange={(e) => setFormData({ ...formData, tahun_ajaran: e.target.value })}
        required
      />
      <select
        value={formData.semester}
        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
      >
        <option value="Ganjil">Ganjil</option>
        <option value="Genap">Genap</option>
      </select>
      <button type="submit">Simpan</button>
      {selectedData && <button type="button" onClick={onCancel}>Batal</button>}
    </form>
  );
}