import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import MapelForm from '../../components/forms/MapelForm';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

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
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>Mata Pelajaran</h2>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Kelola data mata pelajaran dan KKM</p>
      </div>
      
      <MapelForm onSubmit={handleSubmit} selectedData={editing} onCancel={() => setEditing(null)} />
      
      <div className="table-wrapper" style={{ marginTop: '20px' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Mapel</th>
              <th>KKM</th>
              <th width="150" style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.kode}</strong></td>
                <td>{item.nama}</td>
                <td>
                  <span style={{ 
                    background: '#e0e7ff', color: '#4f46e5', 
                    padding: '4px 10px', borderRadius: '4px', 
                    fontSize: '13px', fontWeight: '600' 
                  }}>
                    {item.kkm}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setEditing(item)}>
                      <FiEdit /> Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }} onClick={() => handleDelete(item.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>Belum ada data mata pelajaran</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
