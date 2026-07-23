

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  FiUsers,
  FiUserCheck,
  FiLayers,
  FiCalendar,
  FiArrowRight,
  FiEdit,
  FiFileText,
  FiBarChart2,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    total_siswa: 0,
    total_guru: 0,
    total_kelas: 0,
    tahun_ajaran_aktif: '-',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: 'Total Siswa',
      value: stats.total_siswa,
      icon: <FiUserCheck size={28} />,
      gradient: 'stat-card-blue',
      color: '#3b82f6',
    },
    {
      label: 'Total Guru',
      value: stats.total_guru,
      icon: <FiUsers size={28} />,
      gradient: 'stat-card-green',
      color: '#22c55e',
    },
    {
      label: 'Total Kelas',
      value: stats.total_kelas,
      icon: <FiLayers size={28} />,
      gradient: 'stat-card-purple',
      color: '#8b5cf6',
    },
    {
      label: 'Tahun Ajaran Aktif',
      value: stats.tahun_ajaran_aktif
        ? `${stats.tahun_ajaran_aktif.tahun} - ${stats.tahun_ajaran_aktif.semester}`
        : <span style={{ fontSize: '18px', color: '#ef4444' }}>Belum ada yang aktif</span>,
      icon: <FiCalendar size={28} />,
      gradient: 'stat-card-orange',
      color: '#f59e0b',
    },
  ];

  const quickActions = [
    { label: 'Input Nilai', icon: <FiEdit size={20} />, path: '/nilai' },
    { label: 'Lihat Raport', icon: <FiFileText size={20} />, path: '/raport' },
    { label: 'Rekap Nilai', icon: <FiBarChart2 size={20} />, path: '/rekap' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="dashboard">

      <div className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <h1 className="dashboard-welcome-title">
            {getGreeting()}, {user?.name || 'User'}! 👋
          </h1>
          <p className="dashboard-welcome-text">
            {isAdmin
              ? 'Kelola data sekolah dan pantau perkembangan siswa dari dashboard ini.'
              : 'Pantau dan kelola nilai siswa dari dashboard ini.'}
          </p>
        </div>
        <div className="dashboard-welcome-illustration">
          <span className="dashboard-welcome-emoji">🎓</span>
        </div>
      </div>

      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`stat-card ${card.gradient} ${loading ? 'stat-card-loading' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-card-content">
              {loading ? (
                <>
                  <div className="skeleton skeleton-number" />
                  <div className="skeleton skeleton-label" />
                </>
              ) : (
                <>
                  <span className="stat-card-value">{card.value}</span>
                  <span className="stat-card-label">{card.label}</span>
                </>
              )}
            </div>
            <div className="stat-card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>

            <div className="stat-card-bg-circle" />
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Aksi Cepat</h2>
        <div className="dashboard-actions">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon">{action.icon}</div>
              <span className="dashboard-action-label">{action.label}</span>
              <FiArrowRight size={16} className="dashboard-action-arrow" />
            </Link>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Informasi Sistem</h2>
          <div className="dashboard-info-card">
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Status Sistem</span>
              <span className="dashboard-info-value">
                <span className="status-dot status-dot-active" />
                Aktif
              </span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Role Anda</span>
              <span className="dashboard-info-value">
                <span className="badge badge-admin">Administrator</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
