

import { useState, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const DataTable = ({
  columns,
  data = [],
  searchPlaceholder = 'Cari data...',
  searchKeys = [],
  itemsPerPage = 10,
  actionsHeader = 'Aksi',
  renderActions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    return searchKeys.some((key) => {
      const value = key.split('.').reduce((acc, part) => acc && acc[part], item);
      return value ? String(value).toLowerCase().includes(query) : false;
    });
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="datatable-container">

      {searchKeys.length > 0 && (
        <div className="search-bar" style={{ marginBottom: '1.5rem' }}>
          <div className="search-input-group">
            <FiSearch size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                type="button"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              {columns.map((col, idx) => (
                <th key={idx} style={col.style || {}}>
                  {col.header}
                </th>
              ))}
              {renderActions && <th style={{ textAlign: 'center', width: '150px' }}>{actionsHeader}</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 2 : 1)}
                  className="text-center"
                  style={{ padding: '3rem 1.5rem', color: 'var(--text-muted)' }}
                >
                  <div className="empty-state">
                    <span style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>🔍</span>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem', margin: 0 }}>Data tidak ditemukan</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Coba cari dengan kata kunci lain
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{startIndex + index + 1}</td>
                  {columns.map((col, idx) => {
                    const value = col.accessor
                      ? col.accessor.split('.').reduce((acc, part) => acc && acc[part], item)
                      : null;
                    return (
                      <td key={idx} style={col.style || {}}>
                        {col.render ? col.render(item, value) : value ?? '-'}
                      </td>
                    );
                  })}
                  {renderActions && (
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {renderActions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="pagination-info" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Menampilkan <span style={{ fontWeight: '600', color: 'var(--text-color)' }}>{startIndex + 1}</span> -{' '}
            <span style={{ fontWeight: '600', color: 'var(--text-color)' }}>
              {Math.min(startIndex + itemsPerPage, filteredData.length)}
            </span>{' '}
            dari <span style={{ fontWeight: '600', color: 'var(--text-color)' }}>{filteredData.length}</span> data
          </div>
          <div className="pagination-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ padding: '0.5rem' }}
              type="button"
            >
              <FiChevronLeft size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    minWidth: '35px',
                    height: '35px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  type="button"
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="btn btn-outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ padding: '0.5rem' }}
              type="button"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
