/**
 * ============================================
 * Header Component
 * ============================================
 * Top bar with page title, user info, and
 * mobile hamburger toggle for sidebar.
 * ============================================
 */

import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiBell,
} from 'react-icons/fi';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * Map route paths to page titles
   */
  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/guru': 'Data Guru',
      '/siswa': 'Data Siswa',
      '/kelas': 'Data Kelas',
      '/mapel': 'Mata Pelajaran',
      '/tahun-ajaran': 'Tahun Ajaran',
      '/nilai': 'Input Nilai',
      '/raport': 'Raport',
      '/rekap': 'Rekap Nilai',
      '/users': 'Manajemen User',
    };
    return titles[location.pathname] || 'Halaman';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile hamburger */}
        <button className="header-hamburger" onClick={onToggleSidebar}>
          <FiMenu size={22} />
        </button>

        {/* Page title */}
        <div className="header-title-section">
          <h2 className="header-title">{getPageTitle()}</h2>
          <p className="header-subtitle">
            Selamat datang, <strong>{user?.name || 'User'}</strong>
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* Notification bell (decorative for now) */}
        <button className="header-icon-btn">
          <FiBell size={20} />
          <span className="header-notification-dot" />
        </button>

        {/* User dropdown */}
        <div className="header-user-dropdown" ref={dropdownRef}>
          <button
            className="header-user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="header-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="header-user-name">{user?.name || 'User'}</span>
            <FiChevronDown
              size={16}
              className={`header-chevron ${dropdownOpen ? 'header-chevron-open' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="header-dropdown-menu">
              <div className="header-dropdown-header">
                <span className="header-dropdown-name">{user?.name}</span>
                <span className="header-dropdown-email">{user?.email}</span>
              </div>
              <div className="header-dropdown-divider" />
              <button
                className="header-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/dashboard');
                }}
              >
                <FiUser size={16} />
                <span>Profil</span>
              </button>
              <button
                className="header-dropdown-item header-dropdown-item-danger"
                onClick={handleLogout}
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
