/**
 * ============================================
 * Sidebar Component
 * ============================================
 * Dark navy sidebar with navigation menu.
 * - Gradient accent highlights
 * - Role-based menu item visibility
 * - Active link highlighting via NavLink
 * - Collapsible on mobile
 * - User info + logout at bottom
 * ============================================
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiLayers,
  FiBook,
  FiCalendar,
  FiEdit,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiX,
  FiUser,
} from 'react-icons/fi';
import '../../styles/sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  /**
   * Navigation menu configuration
   * Each item has: path, label, icon, and role restriction
   */
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} />, roles: ['admin', 'guru'] },
    { path: '/guru', label: 'Data Guru', icon: <FiUsers size={20} />, roles: ['admin'] },
    { path: '/siswa', label: 'Data Siswa', icon: <FiUserCheck size={20} />, roles: ['admin'] },
    { path: '/kelas', label: 'Data Kelas', icon: <FiLayers size={20} />, roles: ['admin'] },
    { path: '/mapel', label: 'Mata Pelajaran', icon: <FiBook size={20} />, roles: ['admin'] },
    { path: '/tahun-ajaran', label: 'Tahun Ajaran', icon: <FiCalendar size={20} />, roles: ['admin'] },
    { path: '/nilai', label: 'Input Nilai', icon: <FiEdit size={20} />, roles: ['admin', 'guru'] },
    { path: '/raport', label: 'Raport', icon: <FiFileText size={20} />, roles: ['admin', 'guru'] },
    { path: '/rekap', label: 'Rekap Nilai', icon: <FiBarChart2 size={20} />, roles: ['admin', 'guru'] },
    { path: '/users', label: 'User Management', icon: <FiSettings size={20} />, roles: ['admin'] },
  ];

  // Filter menu items based on user role
  const filteredMenu = menuItems.filter(
    (item) => item.roles.includes(user?.role)
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* ---- Logo / Brand ---- */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">📊</span>
            <div className="sidebar-logo-text">
              <h1>Raport SD</h1>
              <span className="sidebar-logo-subtitle">Sistem Informasi</span>
            </div>
          </div>
          {/* Mobile close button */}
          <button className="sidebar-close-btn" onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        {/* ---- Navigation Menu ---- */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu Utama</div>
          <ul className="sidebar-menu">
            {filteredMenu.map((item) => (
              <li key={item.path} className="sidebar-menu-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-text">{item.label}</span>
                  {/* Active indicator dot */}
                  <span className="sidebar-link-indicator" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- User Info + Logout ---- */}
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{user?.name || 'User'}</span>
              <span className={`sidebar-user-role badge badge-${isAdmin ? 'admin' : 'guru'}`}>
                {user?.role === 'admin' ? 'Admin' : 'Guru'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
