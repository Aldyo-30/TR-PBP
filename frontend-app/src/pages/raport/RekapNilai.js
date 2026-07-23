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
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>🏅 Leaderboard & Rekap Nilai</h2>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Peringkat siswa berdasarkan nilai rata-rata tertinggi di kelas</p>
      </div>

      {/* FILTER SECTION */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', background: '#f8fafc', boxShadow: 'none' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#334155', fontWeight: '600' }}>Filter Leaderboard</h3>
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
            <div className="table-wrapper" style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <table className="table">
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '16px' }}>Rank</th>
                    <th style={{ padding: '16px' }}>NIS</th>
                    <th style={{ padding: '16px' }}>Nama Siswa</th>
                    <th style={{ textAlign: 'center', padding: '16px' }}>Jumlah Mapel Dinilai</th>
                    <th style={{ textAlign: 'center', padding: '16px' }}>Nilai Rata-rata</th>
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
                    let rowStyle = { transition: 'all 0.3s' };
                    
                    if (rank === 1) { 
                      medal = '🏆';
                      rowStyle = { ...rowStyle, background: 'linear-gradient(to right, #fef3c7, #fde68a)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
                    }
                    else if (rank === 2) { 
                      medal = '🥈'; 
                      rowStyle = { ...rowStyle, background: 'linear-gradient(to right, #f1f5f9, #e2e8f0)', boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)' };
                    }
                    else if (rank === 3) { 
                      medal = '🥉'; 
                      rowStyle = { ...rowStyle, background: 'linear-gradient(to right, #ffedd5, #fed7aa)', boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)' };
                    }

                    return (
                      <tr key={idx} className={rowClass} style={rowStyle}>
                        <td style={{ fontSize: rank <= 3 ? '18px' : '15px', fontWeight: rank <= 3 ? 'bold' : '600', padding: '16px' }}>
                          {medal && <span style={{ fontSize: '24px', marginRight: '8px', verticalAlign: 'middle' }}>{medal}</span>} 
                          {rank > 3 && <span style={{ color: '#64748b' }}>#{rank}</span>}
                        </td>
                        <td style={{ padding: '16px' }}>{row.nis ?? '-'}</td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: rank === 1 ? '#d97706' : (rank === 2 ? '#475569' : (rank === 3 ? '#b45309' : '#cbd5e1')), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                              {(row.nama ?? row.student_name ?? row.name ?? 'A').charAt(0).toUpperCase()}
                            </div>
                            <strong style={{ fontSize: rank <= 3 ? '16px' : '15px', color: '#1e293b' }}>
                              {row.nama ?? row.student_name ?? row.name ?? '-'}
                            </strong>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', padding: '16px' }}>
                          <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                            {row.jumlah_mapel ?? row.mapel_count ?? '-'} Mapel
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', fontSize: rank <= 3 ? '18px' : '16px', fontWeight: 'bold', color: rank === 1 ? '#b45309' : '#0f172a', padding: '16px' }}>
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
