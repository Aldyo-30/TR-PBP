import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FiEdit3, FiPrinter, FiSave, FiArrowLeft } from 'react-icons/fi';

export default function InputNilai() {
  const navigate = useNavigate();
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  
  const [filter, setFilter] = useState({ tahun_ajaran_id: '', kelas_id: '' });
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [allGradesInClass, setAllGradesInClass] = useState([]);
  
  const [grades, setGrades] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/tahun-ajaran').then((res) => {
      setTahunAjaranList(Array.isArray(res.data) ? res.data : (res.data.data || []));
    });
    api.get('/kelas?per_page=1000').then((res) => {
      const data = res.data?.data?.data || res.data?.data || res.data;
      setKelasList(Array.isArray(data) ? data : []);
    });
    api.get('/siswa?per_page=1000').then((res) => {
      const data = res.data?.data?.data || res.data?.data || res.data;
      setSiswaList(Array.isArray(data) ? data : []);
    });
    api.get('/mata-pelajaran').then((res) => {
      setMapelList(Array.isArray(res.data) ? res.data : (res.data.data || []));
    });
  }, []);

  const studentsInClass = siswaList.filter(s => s.kelas_id == filter.kelas_id);

  // Jika filter berubah, reset siswa dan fetch ulang nilai sekelas
  useEffect(() => {
    setSelectedSiswa(null);
    if (filter.tahun_ajaran_id && filter.kelas_id) {
      api.get('/nilai', { 
        params: { tahun_ajaran_id: filter.tahun_ajaran_id, kelas_id: filter.kelas_id } 
      }).then(res => {
        setAllGradesInClass(Array.isArray(res.data?.data) ? res.data.data : []);
      }).catch(err => console.error(err));
    } else {
      setAllGradesInClass([]);
    }
  }, [filter]);

  // Fetch nilai spesifik siswa untuk Grid
  useEffect(() => {
    if (selectedSiswa && filter.tahun_ajaran_id && filter.kelas_id) {
      const existingData = allGradesInClass.filter(n => n.siswa_id === selectedSiswa.id);
      const initialGrades = {};
      
      mapelList.forEach(m => {
        const existing = existingData.find(n => n.mata_pelajaran_id === m.id);
        initialGrades[m.id] = {
          mata_pelajaran_id: m.id,
          nilai_tugas: existing ? existing.nilai_tugas : '',
          nilai_uts: existing ? existing.nilai_uts : '',
          nilai_uas: existing ? existing.nilai_uas : '',
          nilai_akhir: existing ? existing.nilai_akhir : 0,
          predikat: existing ? existing.predikat : '-'
        };
      });
      setGrades(initialGrades);
    }
  }, [selectedSiswa, filter, mapelList, allGradesInClass]);

  const handleGradeChange = (mapelId, field, value) => {
    let val = value;
    if (val !== '') {
      val = Math.min(100, Math.max(0, Number(val) || 0));
    }
    
    setGrades(prev => {
      const updatedMapel = { ...prev[mapelId], [field]: val };
      
      const tugas = Number(updatedMapel.nilai_tugas) || 0;
      const uts = Number(updatedMapel.nilai_uts) || 0;
      const uas = Number(updatedMapel.nilai_uas) || 0;
      
      const akhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
      updatedMapel.nilai_akhir = akhir.toFixed(2);
      
      if (akhir >= 85) updatedMapel.predikat = 'A';
      else if (akhir >= 75) updatedMapel.predikat = 'B';
      else if (akhir >= 60) updatedMapel.predikat = 'C';
      else if (akhir >= 50) updatedMapel.predikat = 'D';
      else updatedMapel.predikat = 'E';

      return { ...prev, [mapelId]: updatedMapel };
    });
  };

  const handleBulkSubmit = async () => {
    try {
      setIsSaving(true);
      const dataToSave = Object.values(grades).filter(g => 
        g.nilai_tugas !== '' || g.nilai_uts !== '' || g.nilai_uas !== ''
      ).map(g => ({
        mata_pelajaran_id: g.mata_pelajaran_id,
        nilai_tugas: Number(g.nilai_tugas) || 0,
        nilai_uts: Number(g.nilai_uts) || 0,
        nilai_uas: Number(g.nilai_uas) || 0,
      }));

      if (dataToSave.length === 0) {
        alert("Belum ada satupun nilai yang diisi.");
        setIsSaving(false);
        return;
      }

      await api.post('/nilai', {
        siswa_id: selectedSiswa.id,
        kelas_id: filter.kelas_id,
        tahun_ajaran_id: filter.tahun_ajaran_id,
        data_nilai: dataToSave
      });
      
      alert('Berhasil menyimpan Raport untuk siswa ini!');
      
      // Refresh all grades in class to update the progress fraction
      const res = await api.get('/nilai', { 
        params: { tahun_ajaran_id: filter.tahun_ajaran_id, kelas_id: filter.kelas_id } 
      });
      setAllGradesInClass(Array.isArray(res.data?.data) ? res.data.data : []);
      
      setSelectedSiswa(null);
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || 'Gagal menyimpan nilai.');
    } finally {
      setIsSaving(false);
    }
  };

  const totalMapel = mapelList.length;

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>Input Nilai Per Siswa</h2>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {selectedSiswa ? `Mengisi nilai untuk: ${selectedSiswa.nama}` : 'Pilih Tahun Ajaran dan Kelas untuk melihat daftar siswa'}
        </p>
      </div>

      {!selectedSiswa && (
        <div className="card" style={{ padding: '20px', marginBottom: '24px', background: '#f8fafc', boxShadow: 'none' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#334155', fontWeight: '600' }}>Filter Data</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Tahun Ajaran</label>
              <select className="form-input" value={filter.tahun_ajaran_id} onChange={(e) => setFilter({ ...filter, tahun_ajaran_id: e.target.value })}>
                <option value="">-- Pilih Tahun Ajaran --</option>
                {tahunAjaranList.map((ta) => <option key={ta.id} value={ta.id}>{ta.tahun} ({ta.semester})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Kelas</label>
              <select className="form-input" value={filter.kelas_id} onChange={(e) => setFilter({ ...filter, kelas_id: e.target.value })}>
                <option value="">-- Pilih Kelas --</option>
                {kelasList.map((k) => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAHAP 1: Tabel Daftar Siswa */}
      {!selectedSiswa && filter.tahun_ajaran_id && filter.kelas_id && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th width="80">No</th>
                <th>NIS</th>
                <th>Nama Siswa</th>
                <th style={{ textAlign: 'center' }}>Status Penilaian</th>
                <th width="250" style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {studentsInClass.map((siswa, idx) => {
                const gradedCount = allGradesInClass.filter(n => n.siswa_id === siswa.id).length;
                let badgeClass = 'badge-E'; // Merah if 0
                if (gradedCount === totalMapel && totalMapel > 0) badgeClass = 'badge-A'; // Hijau if complete
                else if (gradedCount > 0) badgeClass = 'badge-C'; // Kuning if partial

                return (
                  <tr key={siswa.id}>
                    <td>{idx + 1}</td>
                    <td>{siswa.nis}</td>
                    <td><strong>{siswa.nama}</strong></td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        background: badgeClass === 'badge-A' ? '#dcfce7' : (badgeClass === 'badge-C' ? '#fef9c3' : '#fee2e2'),
                        color: badgeClass === 'badge-A' ? '#166534' : (badgeClass === 'badge-C' ? '#854d0e' : '#991b1b'),
                        padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '600'
                      }}>
                        {gradedCount} / {totalMapel} Mapel
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setSelectedSiswa(siswa)}
                          style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <FiEdit3 /> Isi Nilai
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => navigate(`/raport/${siswa.id}?tahun_ajaran_id=${filter.tahun_ajaran_id}`)}
                          disabled={gradedCount === 0}
                          title={gradedCount === 0 ? "Belum ada nilai untuk dicetak" : "Cetak/Lihat Raport Fisik"}
                          style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <FiPrinter /> Raport
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {studentsInClass.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>Belum ada siswa di kelas ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAHAP 2: Form Input Grid Seluruh Mapel untuk 1 Siswa */}
      {selectedSiswa && (
        <div className="animate-fade-in card" style={{ padding: '24px', boxShadow: 'none', background: '#f8fafc' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setSelectedSiswa(null)}
            style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FiArrowLeft /> Kembali ke Daftar Siswa
          </button>
          
          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran</th>
                  <th width="140">Tugas (30%)</th>
                  <th width="140">UTS (30%)</th>
                  <th width="140">UAS (40%)</th>
                  <th width="100">Akhir</th>
                  <th width="100">Predikat</th>
                </tr>
              </thead>
              <tbody>
                {mapelList.map((mapel, idx) => {
                  const mGrade = grades[mapel.id] || {};
                  return (
                    <tr key={mapel.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{mapel.nama}</strong></td>
                      <td>
                        <input 
                          type="number" 
                          className="form-input" 
                          style={{ padding: '8px', textAlign: 'center', borderColor: mGrade.nilai_tugas !== '' ? '#3b82f6' : '#cbd5e1' }} 
                          value={mGrade.nilai_tugas ?? ''}
                          placeholder="-"
                          onChange={(e) => handleGradeChange(mapel.id, 'nilai_tugas', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="form-input" 
                          style={{ padding: '8px', textAlign: 'center', borderColor: mGrade.nilai_uts !== '' ? '#3b82f6' : '#cbd5e1' }} 
                          value={mGrade.nilai_uts ?? ''}
                          placeholder="-"
                          onChange={(e) => handleGradeChange(mapel.id, 'nilai_uts', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="form-input" 
                          style={{ padding: '8px', textAlign: 'center', borderColor: mGrade.nilai_uas !== '' ? '#3b82f6' : '#cbd5e1' }} 
                          value={mGrade.nilai_uas ?? ''}
                          placeholder="-"
                          onChange={(e) => handleGradeChange(mapel.id, 'nilai_uas', e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}><strong>{mGrade.nilai_akhir ?? 0}</strong></td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          background: mGrade.predikat === 'A' ? '#dcfce7' : (mGrade.predikat === 'B' ? '#dbeafe' : (mGrade.predikat === 'C' ? '#fef9c3' : '#fee2e2')),
                          color: mGrade.predikat === 'A' ? '#166534' : (mGrade.predikat === 'B' ? '#1e40af' : (mGrade.predikat === 'C' ? '#854d0e' : '#991b1b')),
                          padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '700'
                        }}>
                          {mGrade.predikat ?? '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'right', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              ℹ️ Anda dapat mengosongi baris mata pelajaran yang belum ingin diinput.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={handleBulkSubmit}
              disabled={isSaving}
              style={{ padding: '10px 24px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <FiSave /> {isSaving ? 'Menyimpan...' : 'Simpan Raport Siswa'}
            </button>
          </div>
        </div>
      )}

      {/* Kosong (Belum pilih filter sama sekali) */}
      {!selectedSiswa && (!filter.tahun_ajaran_id || !filter.kelas_id) && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <span style={{ fontSize: '32px' }}>👨‍🎓</span>
          <p style={{ color: '#64748b', marginTop: '12px' }}>Silakan pilih Tahun Ajaran dan Kelas untuk memunculkan daftar siswa.</p>
        </div>
      )}
    </div>
  );
}
