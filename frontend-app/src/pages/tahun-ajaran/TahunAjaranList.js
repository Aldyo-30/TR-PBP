import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import TahunAjaranForm from '../../components/forms/TahunAjaranForm';
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

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
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>Tahun Ajaran</h2>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Kelola tahun ajaran dan semester aktif</p>
      </div>

      <TahunAjaranForm onSubmit={handleSubmit} selectedData={editing} onCancel={() => setEditing(null)} />

      <div className="table-wrapper" style={{ marginTop: '20px' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Tahun</th>
              <th>Semester</th>
              <th>Status</th>
              <th width="280" style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} style={{ background: item.is_active ? '#f0fdf4' : 'transparent' }}>
                <td><strong>{item.tahun}</strong></td>
                <td>{item.semester}</td>
                <td>
                  <span style={{
                    background: item.is_active ? '#dcfce7' : '#f1f5f9',
                    color: item.is_active ? '#166534' : '#64748b',
                    padding: '4px 10px', borderRadius: '4px',
                    fontSize: '13px', fontWeight: '600',
                    display: 'inline-flex', alignItems: 'center', gap: '4px'
                  }}>
                    {item.is_active ? <><FiCheckCircle /> Sedang Aktif</> : 'Tidak Aktif'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      className={`btn ${item.is_active ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => handleToggle(item.id)}
                      title={item.is_active ? "Matikan Semester Ini" : "Aktifkan Semester Ini"}
                      style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', minWidth: '100px', justifyContent: 'center' }}
                    >
                      {item.is_active ? <><FiXCircle /> Matikan</> : <><FiCheckCircle /> Aktifkan</>}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditing(item)}
                      title="Edit"
                      style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                      title="Hapus"
                      style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>Belum ada data tahun ajaran</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
