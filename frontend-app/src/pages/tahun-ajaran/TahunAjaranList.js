import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import TahunAjaranForm from '../../components/forms/TahunAjaranForm';

export default function TahunAjaranList() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchTA = async () => {
    const res = await api.get('/tahun-ajaran');
    setList(res.data);
  };

  useEffect(() => { fetchTA(); }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await api.put(`/tahun-ajaran/${editing.id}`, data);
    } else {
      await api.post('/tahun-ajaran', data);
    }
    setEditing(null);
    fetchTA();
  };

  const handleToggle = async (id) => {
    await api.patch(`/tahun-ajaran/${id}/toggle-active`);
    fetchTA();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus?')) {
      await api.delete(`/tahun-ajaran/${id}`);
      fetchTA();
    }
  };

  return (
    <div className="premium-card">
      <div className="premium-header">
        <div>
          <h2 className="premium-title">Tahun Ajaran</h2>
          <p className="premium-subtitle">Kelola tahun ajaran dan semester aktif</p>
        </div>
      </div>
      
      <TahunAjaranForm onSubmit={handleSubmit} selectedData={editing} onCancel={() => setEditing(null)} />
      
      <div className="premium-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Tahun</th>
              <th>Semester</th>
              <th>Status</th>
              <th width="220">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.tahun}</strong></td>
                <td>{item.semester}</td>
                <td>
                  <span className={`badge ${item.is_active ? 'badge-aktif' : 'badge-nonaktif'}`}>
                    {item.is_active ? '✅ Sedang Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className={`btn-premium btn-icon ${item.is_active ? 'btn-danger' : 'btn-success'}`} 
                      onClick={() => handleToggle(item.id)}
                      title={item.is_active ? "Matikan Semester Ini" : "Aktifkan Semester Ini"}
                      style={{ minWidth: '100px' }}
                    >
                      {item.is_active ? '🛑 Matikan' : '⚡ Aktifkan'}
                    </button>
                    <button 
                      className="btn-premium btn-secondary btn-icon" 
                      onClick={() => setEditing(item)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-premium btn-secondary btn-icon" 
                      onClick={() => handleDelete(item.id)}
                      title="Hapus"
                      style={{ color: '#ef4444' }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#64748b' }}>Belum ada data tahun ajaran</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}