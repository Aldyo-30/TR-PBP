import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapelForm from '../../components/forms/MapelForm';

export default function MapelList() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchMapel = async () => {
    const res = await axios.get('http://localhost:8000/api/mata-pelajaran');
    setList(res.data);
  };

  useEffect(() => { fetchMapel(); }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await axios.put(`http://localhost:8000/api/mata-pelajaran/${editing.id}`, data);
    } else {
      await axios.post('http://localhost:8000/api/mata-pelajaran', data);
    }
    setEditing(null);
    fetchMapel();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus?')) {
      await axios.delete(`http://localhost:8000/api/mata-pelajaran/${id}`);
      fetchMapel();
    }
  };

  return (
    <div>
      <h2>Data Mata Pelajaran</h2>
      <MapelForm onSubmit={handleSubmit} selectedData={editing} onCancel={() => setEditing(null)} />
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Kode</th><th>Nama Mapel</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.kode_mapel}</td>
              <td>{item.nama_mapel}</td>
              <td>
                <button onClick={() => setEditing(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}