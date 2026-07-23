import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const RekapNilai = () => {
  const { kelasId: paramKelasId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const urlKelasId = paramKelasId || queryParams.get('kelas_id');
  const urlTahunAjaranId = queryParams.get('tahun_ajaran_id');

  const navigate = useNavigate();

  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  
  const [filter, setFilter] = useState({ 
    tahun_ajaran_id: urlTahunAjaranId || '', 
    kelas_id: urlKelasId || '' 
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data dropdown filter
  useEffect(() => {
    api.get('/tahun-ajaran').then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setTahunAjaranList(data);
      // Set default tahun ajaran jika belum ada
      if (!filter.tahun_ajaran_id && data.length > 0) {
        setFilter(prev => ({ ...prev, tahun_ajaran_id: data[0].id }));
      }
    });
    api.get('/kelas?per_page=1000').then((res) => {
      const data = res.data?.data?.data || res.data?.data || res.data;
      setKelasList(Array.isArray(data) ? data : []);
    });
  }, []);

  // Fetch Rekap Data ketika filter lengkap
  useEffect(() => {
    const fetchRekap = async () => {
      if (!filter.kelas_id || !filter.tahun_ajaran_id) {
        setData([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Memperbarui URL tanpa me-reload agar link bisa dishare
        navigate(`/rekap/${filter.kelas_id}?tahun_ajaran_id=${filter.tahun_ajaran_id}`, { replace: true });
        
        const res = await api.get(`/rekap/${filter.kelas_id}?tahun_ajaran_id=${filter.tahun_ajaran_id}`);
        setData(res.data?.rekap || []);
      } catch (err) {
        console.error('Failed to fetch rekap:', err);
        setError('Gagal memuat data rekap.');
      } finally {
        setLoading(false);
      }
    };

    fetchRekap();
  }, [filter.kelas_id, filter.tahun_ajaran_id, navigate]);

  return (
    <div className="premium-card">
      <div className="premium-header">
        <div>
          <h1 className="premium-title">🏅 Leaderboard & Rekap Nilai</h1>
          <p className="premium-subtitle">Peringkat siswa berdasarkan nilai rata-rata tertinggi di kelas</p>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b' }}>Filter Leaderboard</h3>
        <div className="premium-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
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

      {!filter.kelas_id ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <span style={{ fontSize: '32px' }}>📊</span>
          <p style={{ color: '#64748b', marginTop: '12px' }}>Silakan pilih Tahun Ajaran dan Kelas untuk melihat Leaderboard.</p>
        </div>
      ) : (
        <>
          {loading && <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#64748b' }}>⏳ Mengkalkulasi peringkat...</div>}
          {error && <div style={{ textAlign: 'center', color: '#ef4444', padding: '40px', background: '#fee2e2', borderRadius: '12px' }}>⚠️ {error}</div>}

          {!loading && !error && (
            <div className="premium-table-wrapper" style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>NIS</th>
                    <th>Nama Siswa</th>
                    <th style={{ textAlign: 'center' }}>Jumlah Mapel Dinilai</th>
                    <th style={{ textAlign: 'center' }}>Nilai Rata-rata</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        Belum ada data nilai di kelas ini.
                      </td>
                    </tr>
                  )}
                  {data.map((row, idx) => {
                    const rank = row.ranking ?? row.rank ?? (idx + 1);
                    let rowClass = '';
                    let medal = '';
                    if (rank === 1) { rowClass = 'leaderboard-row-1'; medal = '🥇'; }
                    else if (rank === 2) { rowClass = 'leaderboard-row-2'; medal = '🥈'; }
                    else if (rank === 3) { rowClass = 'leaderboard-row-3'; medal = '🥉'; }

                    return (
                      <tr key={idx} className={rowClass} style={{ transition: 'all 0.3s' }}>
                        <td style={{ fontSize: rank <= 3 ? '18px' : '14px', fontWeight: rank <= 3 ? 'bold' : 'normal' }}>
                          {medal && <span className="medal">{medal}</span>} 
                          {rank > 3 && `#${rank}`}
                        </td>
                        <td>{row.nis ?? '-'}</td>
                        <td><strong style={{ fontSize: rank === 1 ? '16px' : '14px' }}>{row.nama ?? row.student_name ?? row.name ?? '-'}</strong></td>
                        <td style={{ textAlign: 'center' }}>{row.jumlah_mapel ?? row.mapel_count ?? '-'}</td>
                        <td style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: rank === 1 ? '#d97706' : '#1e293b' }}>
                          {row.rata_rata ?? row.avg ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RekapNilai;
