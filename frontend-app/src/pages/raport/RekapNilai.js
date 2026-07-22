import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/raport.css';

const RekapNilai = () => {
  const { kelasId: paramKelasId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const kelasId = paramKelasId || queryParams.get('kelas_id');
  const tahunAjaranId = queryParams.get('tahun_ajaran_id') || '1';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRekap = async () => {
      if (!kelasId) {
        setError('Kelas tidak ditentukan. Tambahkan /rekap/{kelasId} atau ?kelas_id= pada URL.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/rekap/${kelasId}?tahun_ajaran_id=${tahunAjaranId}`);
        setData(res.data?.rekap || []);
      } catch (err) {
        console.error('Failed to fetch rekap:', err);
        setError('Gagal memuat data rekap.');
      } finally {
        setLoading(false);
      }
    };

    fetchRekap();
  }, [kelasId, tahunAjaranId]);

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
                <th>NIS</th>
                <th>Nama Siswa</th>
                <th>Jumlah Mapel</th>
                <th>Rata-rata</th>
                <th>Ranking</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    Tidak ada data rekap.
                  </td>
                </tr>
              )}
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{row.nis ?? '-'}</td>
                  <td>{row.nama ?? row.student_name ?? row.name ?? '-'}</td>
                  <td>{row.jumlah_mapel ?? row.mapel_count ?? '-'}</td>
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
