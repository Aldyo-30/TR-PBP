import React, { useState, useEffect } from 'react';

export default function MapelForm({ onSubmit, selectedData, onCancel }) {
  const [formData, setFormData] = useState({ kode_mapel: '', nama_mapel: '' });

  useEffect(() => {
    if (selectedData) setFormData(selectedData);
  }, [selectedData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ kode_mapel: '', nama_mapel: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{selectedData ? 'Edit Mapel' : 'Tambah Mapel'}</h3>
      <input
        type="text"
        placeholder="Kode Mapel"
        value={formData.kode_mapel}
        onChange={(e) => setFormData({ ...formData, kode_mapel: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Nama Mapel"
        value={formData.nama_mapel}
        onChange={(e) => setFormData({ ...formData, nama_mapel: e.target.value })}
        required
      />
      <button type="submit">Simpan</button>
      {selectedData && <button type="button" onClick={onCancel}>Batal</button>}
    </form>
  );
}