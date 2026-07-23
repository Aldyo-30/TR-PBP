import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TahunAjaranForm from '../../components/forms/TahunAjaranForm';

export default function TahunAjaranList() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchTA = async () => {
    const res = await axios.get('http://localhost:8000/api/tahun-ajaran');
    setList(res.data);
  };

  useEffect(() => { fetchTA(); }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await axios.put(`http://localhost:8000/api/tahun-ajaran/${editing.id}`, data);
    } else {
      await axios.post('http://localhost:8000/api/tahun-ajaran', data);
    }
    setEditing(null);
    fetchTA();
  };

  const handleToggle = async (id) => {
    await axios.patch(`http://localhost:8000/api/tahun-ajaran/${id}/toggle-active`);
    fetchTA();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus?')) {
      await axios.delete(`http://localhost:8000/api/tahun-ajaran/${id}`);
      fetchTA();
    }
  };

  return (
    <div>
      <h2>Data Tahun Ajaran</h2>
      <TahunAjaranForm onSubmit={handleSubmit} selectedData={editing} onCancel={() => setEditing(null)} />
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Tahun Ajaran</th><th>Semester</th><th>Status</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.tahun_ajaran}</td>
              <td>{item.semester}</td>
              <td>{item.is_active ? '✅ Aktif' : 'Non-Aktif'}</td>
              <td>
                {!item.is_active && (
                  <button onClick={() => handleToggle(item.id)}>Set Aktif</button>
                )}
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