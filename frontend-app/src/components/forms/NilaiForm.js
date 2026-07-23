import React, { useState, useEffect } from 'react';

export default function NilaiForm({ onSubmit, selectedData, mapelList, tahunAjaranList, onCancel }) {
  const [formData, setFormData] = useState({
    nama_siswa: '',
    mata_pelajaran_id: '',
    tahun_ajaran_id: '',
    nilai_tugas: 0,
    nilai_uts: 0,
    nilai_uas: 0,
  });

  useEffect(() => {
    if (selectedData) {
      setFormData(selectedData);
    } else {
      const activeTA = tahunAjaranList.find((ta) => ta.is_active);
      if (activeTA) setFormData((prev) => ({ ...prev, tahun_ajaran_id: activeTA.id }));
    }
  }, [selectedData, tahunAjaranList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nama_siswa: '', mata_pelajaran_id: '', tahun_ajaran_id: '', nilai_tugas: 0, nilai_uts: 0, nilai_uas: 0 });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{selectedData ? 'Edit Nilai' : 'Input Nilai Baru'}</h3>
      <input
        type="text"
        placeholder="Nama Siswa"
        value={formData.nama_siswa}
        onChange={(e) => setFormData({ ...formData, nama_siswa: e.target.value })}
        required
      />
      <select
        value={formData.mata_pelajaran_id}
        onChange={(e) => setFormData({ ...formData, mata_pelajaran_id: e.target.value })}
        required
        disabled={!!selectedData}
      >
        <option value="">-- Pilih Mapel --</option>
        {mapelList.map((m) => (
          <option key={m.id} value={m.id}>{m.nama_mapel}</option>
        ))}
      </select>

      <select
        value={formData.tahun_ajaran_id}
        onChange={(e) => setFormData({ ...formData, tahun_ajaran_id: e.target.value })}
        required
        disabled={!!selectedData}
      >
        <option value="">-- Pilih Tahun Ajaran --</option>
        {tahunAjaranList.map((ta) => (
          <option key={ta.id} value={ta.id}>{ta.tahun_ajaran} ({ta.semester})</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Nilai Tugas"
        value={formData.nilai_tugas}
        onChange={(e) => setFormData({ ...formData, nilai_tugas: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Nilai UTS"
        value={formData.nilai_uts}
        onChange={(e) => setFormData({ ...formData, nilai_uts: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Nilai UAS"
        value={formData.nilai_uas}
        onChange={(e) => setFormData({ ...formData, nilai_uas: e.target.value })}
        required
      />
      <button type="submit">Simpan Nilai</button>
      {selectedData && <button type="button" onClick={onCancel}>Batal</button>}
    </form>
  );
}