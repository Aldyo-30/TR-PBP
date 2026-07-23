import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NilaiForm from '../../components/forms/NilaiForm';

export default function InputNilai() {
  const [nilaiList, setNilaiList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [editing, setEditing] = useState(null);

  const [filter, setFilter] = useState({ mata_pelajaran_id: '', tahun_ajaran_id: '' });

  useEffect(() => {
    axios.get('http://localhost:8000/api/mata-pelajaran').then((res) => setMapelList(res.data));
    axios.get('http://localhost:8000/api/tahun-ajaran').then((res) => setTahunAjaranList(res.data));
  }, []);

  const fetchNilai = async () => {
    const res = await axios.get('http://localhost:8000/api/nilai', { params: filter });
    setNilaiList(res.data);
  };

  useEffect(() => {
    fetchNilai();
  }, [filter]);

  const handleSubmit = async (data) => {
    if (editing) {
      await axios.put(`http://localhost:8000/api/nilai/${editing.id}`, data);
    } else {
      await axios.post('http://localhost:8000/api/nilai', data);
    }
    setEditing(null);
    fetchNilai();
  };

  return (
    <div>
      <h2>Input & Data Nilai Siswa</h2>
      <NilaiForm
        onSubmit={handleSubmit}
        selectedData={editing}
        mapelList={mapelList}
        tahunAjaranList={tahunAjaranList}
        onCancel={() => setEditing(null)}
      />

      <hr />
      <h3>Filter Data Nilai</h3>
      <select onChange={(e) => setFilter({ ...filter, mata_pelajaran_id: e.target.value })}>
        <option value="">Semua Mapel</option>
        {mapelList.map((m) => (
          <option key={m.id} value={m.id}>{m.nama_mapel}</option>
        ))}
      </select>

      <select onChange={(e) => setFilter({ ...filter, tahun_ajaran_id: e.target.value })}>
        <option value="">Semua Tahun Ajaran</option>
        {tahunAjaranList.map((ta) => (
          <option key={ta.id} value={ta.id}>{ta.tahun_ajaran} ({ta.semester})</option>
        ))}
      </select>

      <br /><br />

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nama Siswa</th>
            <th>Mapel</th>
            <th>Tugas</th>
            <th>UTS</th>
            <th>UAS</th>
            <th>Nilai Akhir</th>
            <th>Predikat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {nilaiList.map((item) => (
            <tr key={item.id}>
              <td>{item.nama_siswa}</td>
              <td>{item.mata_pelajaran?.nama_mapel}</td>
              <td>{item.nilai_tugas}</td>
              <td>{item.nilai_uts}</td>
              <td>{item.nilai_uas}</td>
              <td>{item.nilai_akhir}</td>
              <td><strong>{item.predikat}</strong></td>
              <td>
                <button onClick={() => setEditing(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}