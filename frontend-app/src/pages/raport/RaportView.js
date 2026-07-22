import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import '../../styles/raport.css';

const RaportView = () => {
  const { studentId } = useParams();
  const { user } = useAuth();
  const id = studentId || user?.id;

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
        const res = await api.get(`/raport/${id}`);
        setRaport(res.data);
      } catch (err) {
        console.error('Error fetching raport:', err);
        setError('Gagal memuat data raport.');
      } finally {
        setLoading(false);
      }
    };

    fetchRaport();
  }, [id]);

  const getSubjects = () => {
    if (!raport) return [];
    return raport.subjects || raport.nilai || raport.data || [];
  };

  const computeAverage = (items) => {
    if (!items || items.length === 0) return '-';
    const values = items
      .map((it) => {
        if (typeof it === 'number') return it;
        return Number(it.nilai ?? it.value ?? it.score ?? it.grade ?? it.points ?? 0);
      })
      .filter((v) => !Number.isNaN(v));
    if (values.length === 0) return '-';
    const sum = values.reduce((s, v) => s + v, 0);
    return (sum / values.length).toFixed(2);
  };

  const handlePrint = () => window.print();

  const subjects = getSubjects();
  const avg = computeAverage(subjects);

  return (
    <div className="raport-view">
      <div className="raport-header">
        <h1>Raport Siswa</h1>
        <div className="raport-actions">
          <button className="btn" onClick={handlePrint} disabled={loading || !!error}>
            Cetak
          </button>
        </div>
      </div>

      {loading && <div className="loader">Memuat data...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="raport-card">
          <div className="raport-meta">
            <div>
              <strong>Nama:</strong> {raport?.student?.name || raport?.student_name || user?.name || '-'}
            </div>
            <div>
              <strong>NIS:</strong> {raport?.student?.nis || raport?.nis || '-'}
            </div>
            <div>
              <strong>Kelas:</strong> {raport?.student?.kelas || raport?.kelas || '-'}
            </div>
            <div>
              <strong>Semester:</strong> {raport?.semester || '-'}
            </div>
          </div>

          <table className="raport-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Mata Pelajaran</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    Tidak ada data nilai.
                  </td>
                </tr>
              )}
              {subjects.map((s, idx) => {
                const name = s.subject ?? s.mapel ?? s.nama ?? s.name ?? s.title ?? `Mapel ${idx + 1}`;
                const value = typeof s === 'number' ? s : (s.nilai ?? s.value ?? s.score ?? s.grade ?? s.points ?? '-');
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{name}</td>
                    <td>{value}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>Rata-rata</strong></td>
                <td><strong>{avg}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default RaportView;
