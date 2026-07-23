import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import MapelForm from '../../components/forms/MapelForm';

export default function MapelList() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchMapel = async () => {
    const res = await api.get('/mata-pelajaran');
    setList(res.data);
  };

  useEffect(() => { fetchMapel(); }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await api.put(`/mata-pelajaran/${editing.id}`, data);
    } else {
      await api.post('/mata-pelajaran', data);
    }
    setEditing(null);
    fetchMapel();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus?')) {
      await api.delete(`/mata-pelajaran/${id}`);
      fetchMapel();
    }
  };

  return (
    <div className="premium-card">
      <div className="premium-header">
        <div>
          <h2 className="premium-title">Mata Pelajaran</h2>
          <p className="premium-subtitle">Kelola data mata pelajaran dan KKM</p>
        </div>
      </div>
      
      <MapelForm onSubmit={handleSubmit} selectedData={editing} onCancel={() => setEditing(null)} />
      
      <div className="premium-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Mapel</th>
              <th>KKM</th>
              <th width="150">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.kode}</strong></td>
                <td>{item.nama}</td>
                <td><span className="badge badge-A">{item.kkm}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-premium btn-secondary btn-icon" onClick={() => setEditing(item)}>✏️ Edit</button>
                    <button className="btn-premium btn-danger btn-icon" onClick={() => handleDelete(item.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#64748b' }}>Belum ada data mata pelajaran</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}