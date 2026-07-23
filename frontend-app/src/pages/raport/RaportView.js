import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import '../../styles/raport.css';

const RaportView = () => {
  const { studentId } = useParams();
  const { user } = useAuth();
  const id = studentId || user?.id;
  const tahunAjaranId = new URLSearchParams(window.location.search).get('tahun_ajaran_id') || '1';

  const [loading, setLoading] = useState(true);
  const [raport, setRaport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('ID siswa tidak ditemukan.');
      setLoading(false);
      return;
    }

    const fetchRaport = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/raport/${id}?tahun_ajaran_id=${tahunAjaranId}`);
        setRaport(res.data);
      } catch (err) {
        console.error('Error fetching raport:', err);
        setError('Gagal memuat data raport.');
      } finally {
        setLoading(false);
      }
    };

    fetchRaport();
  }, [id, tahunAjaranId]);

  const getSubjects = () => {
    if (!raport) return [];
    return raport.nilai || raport.subjects || raport.data || [];
  };

  const computeAverage = (items) => {
    if (!items || items.length === 0) return '-';
    const values = items
      .map((it) => {
        if (typeof it === 'number') return it;
        return Number(it.nilai_akhir ?? it.nilai ?? it.value ?? it.score ?? it.grade ?? it.points ?? 0);
      })
      .filter((v) => !Number.isNaN(v));
    if (values.length === 0) return '-';
    const sum = values.reduce((s, v) => s + v, 0);
    return (sum / values.length).toFixed(2);
  };

  const handlePrint = () => window.print();

  const subjects = getSubjects();
  const avg = raport?.rata_rata ?? computeAverage(subjects);

  // Jika diakses dari menu Sidebar tanpa parameter siswa (dan bukan akun siswa yang melihat raportnya sendiri)
  if (!studentId && user?.role !== 'siswa') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '64px' }}>📇</span>
        <h2 style={{ color: '#1e293b', marginTop: '24px', fontSize: '24px', fontWeight: 'bold' }}>Raport Belum Dipilih</h2>
        <p style={{ color: '#64748b', marginTop: '12px', fontSize: '16px', maxWidth: '400px', lineHeight: '1.5' }}>
          Menu ini berfungsi sebagai Pratinjau Cetak (Print Preview). <br/><br/>
          Untuk mencetak atau melihat raport, silakan menuju menu <strong>Input Nilai</strong> terlebih dahulu dan tekan tombol <strong>🖨️ Raport</strong> pada baris nama siswa yang diinginkan.
        </p>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>⏳ Memuat Dokumen Raport...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#ef4444', padding: '40px' }}>⚠️ {error}</div>;

  return (
    <div style={{ padding: '20px', background: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button className="btn-premium btn-primary" onClick={handlePrint}>
          🖨️ Cetak Raport
        </button>
      </div>

      <div className="paper-document">
        <div className="paper-header">
          <h1 className="paper-title">Laporan Hasil Belajar</h1>
          <p className="paper-subtitle">Sekolah Dasar Negeri PBP</p>
        </div>

        <div className="student-info-grid">
          <div className="info-item">
            <span className="label">Nama Siswa</span>
            <span className="value">: {raport?.siswa?.nama || raport?.student?.name || raport?.student_name || user?.name || '-'}</span>
          </div>
          <div className="info-item">
            <span className="label">Nomor Induk</span>
            <span className="value">: {raport?.siswa?.nis || raport?.student?.nis || raport?.nis || '-'}</span>
          </div>
          <div className="info-item">
            <span className="label">Kelas</span>
            <span className="value">: {raport?.siswa?.kelas?.nama || raport?.student?.kelas || raport?.kelas || '-'}</span>
          </div>
          <div className="info-item">
            <span className="label">Semester</span>
            <span className="value">: {raport?.tahun_ajaran?.nama || raport?.tahun_ajaran?.semester || '-'}</span>
          </div>
        </div>

        <div className="premium-table-wrapper" style={{ border: '2px solid #1e293b' }}>
          <table className="premium-table" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th style={{ textAlign: 'center' }}>Tugas</th>
                <th style={{ textAlign: 'center' }}>UTS</th>
                <th style={{ textAlign: 'center' }}>UAS</th>
                <th style={{ textAlign: 'center' }}>Nilai Akhir</th>
                <th style={{ textAlign: 'center' }}>Predikat</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                    Belum ada data nilai akademik.
                  </td>
                </tr>
              )}
              {subjects.map((s, idx) => {
                const name = s.mataPelajaran?.nama ?? s.mata_pelajaran?.nama ?? s.subject ?? s.mapel ?? s.nama ?? s.name ?? s.title ?? `Mapel ${idx + 1}`;
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td>{idx + 1}</td>
                    <td><strong>{name}</strong></td>
                    <td style={{ textAlign: 'center' }}>{s.nilai_tugas ?? s.tugas ?? '-'} </td>
                    <td style={{ textAlign: 'center' }}>{s.nilai_uts ?? s.uts ?? '-'} </td>
                    <td style={{ textAlign: 'center' }}>{s.nilai_uas ?? s.uas ?? '-'} </td>
                    <td style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>{s.nilai_akhir ?? s.akhir ?? '-'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge badge-${s.predikat ?? 'D'}`}>{s.predikat ?? '-'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', borderTop: '2px solid #1e293b' }}>
                <td colSpan={5} style={{ textAlign: 'right', fontSize: '16px' }}><strong>Rata-rata Nilai:</strong></td>
                <td style={{ textAlign: 'center', fontSize: '18px', color: '#1d4ed8' }}><strong>{avg}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'flex-end', paddingRight: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '60px' }}>Kepala Sekolah,</p>
            <p><strong>(...................................)</strong></p>
            <p>NIP. </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaportView;
