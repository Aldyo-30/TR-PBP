import { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../../styles/raport.css';

const RekapNilai = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRekap = async () => {
      try {
        setLoading(true);
        const res = await api.get('/rekap');
        setData(res.data || []);
      } catch (err) {
        console.error('Failed to fetch rekap:', err);
        setError('Gagal memuat data rekap.');
      } finally {
        setLoading(false);
      }
    };

    fetchRekap();
  }, []);

  return (
    <div className="rekap-page">
      <div className="page-header">
        <h1 className="page-title">Rekap Nilai</h1>
        <p className="page-description">Tabel rekap & ranking kelas</p>
      </div>

      {loading && <div className="loader">Memuat data...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="card">
          <table className="raport-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Kelas</th>
                <th>Nama Siswa</th>
                <th>Rata-rata</th>
                <th>Ranking</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    Tidak ada data rekap.
                  </td>
                </tr>
              )}
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{row.kelas || row.class || '-'}</td>
                  <td>{row.nama || row.student_name || row.name || '-'}</td>
                  <td>{row.rata_rata ?? row.avg ?? '-'}</td>
                  <td>{row.ranking ?? row.rank ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RekapNilai;
