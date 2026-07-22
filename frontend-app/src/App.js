/**
 * ============================================
 * App.js — Root Application Component
 * ============================================
 * Sets up routing, auth context, and layout.
 * - BrowserRouter for client-side routing
 * - AuthProvider wraps everything for global auth
 * - ToastContainer for notifications
 * - Public routes: Login
 * - Protected routes: wrapped in MainLayout
 * ============================================
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages — ALDYO
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RaportView from './pages/raport/RaportView';
import RekapNilai from './pages/raport/RekapNilai';
import UserList from './pages/users/UserList';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Toast notifications container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Routes>
          {/* ---- Public Routes ---- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* ---- Protected Routes (wrapped in MainLayout) ---- */}

          {/* Dashboard — all authenticated users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Data Guru — KEVIN's page (placeholder) */}
          <Route
            path="/guru"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <div className="page-container">
                    <div className="page-header">
                      <h1 className="page-title">Halaman Guru</h1>
                      <p className="page-description">Halaman ini akan dikerjakan oleh KEVIN.</p>
                    </div>
                    <div className="card placeholder-card">
                      <span className="placeholder-emoji">👨‍🏫</span>
                      <p>Modul Data Guru — Coming Soon</p>
                    </div>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Data Siswa — KEVIN's page (placeholder) */}
          <Route
            path="/siswa"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <div className="page-container">
                    <div className="page-header">
                      <h1 className="page-title">Halaman Siswa</h1>
                      <p className="page-description">Halaman ini akan dikerjakan oleh KEVIN.</p>
                    </div>
                    <div className="card placeholder-card">
                      <span className="placeholder-emoji">👨‍🎓</span>
                      <p>Modul Data Siswa — Coming Soon</p>
                    </div>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Data Kelas — KEVIN's page (placeholder) */}
          <Route
            path="/kelas"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <div className="page-container">
                    <div className="page-header">
                      <h1 className="page-title">Halaman Kelas</h1>
                      <p className="page-description">Halaman ini akan dikerjakan oleh KEVIN.</p>
                    </div>
                    <div className="card placeholder-card">
                      <span className="placeholder-emoji">🏫</span>
                      <p>Modul Data Kelas — Coming Soon</p>
                    </div>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Mata Pelajaran — JOSAN's page (placeholder) */}
          <Route
            path="/mapel"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <div className="page-container">
                    <div className="page-header">
                      <h1 className="page-title">Halaman Mata Pelajaran</h1>
                      <p className="page-description">Halaman ini akan dikerjakan oleh JOSAN.</p>
                    </div>
                    <div className="card placeholder-card">
                      <span className="placeholder-emoji">📚</span>
                      <p>Modul Mata Pelajaran — Coming Soon</p>
                    </div>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Tahun Ajaran — JOSAN's page (placeholder) */}
          <Route
            path="/tahun-ajaran"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <div className="page-container">
                    <div className="page-header">
                      <h1 className="page-title">Halaman Tahun Ajaran</h1>
                      <p className="page-description">Halaman ini akan dikerjakan oleh JOSAN.</p>
                    </div>
                    <div className="card placeholder-card">
                      <span className="placeholder-emoji">📅</span>
                      <p>Modul Tahun Ajaran — Coming Soon</p>
                    </div>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Input Nilai — JOSAN's page (placeholder) */}
          <Route
            path="/nilai"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div className="page-container">
                    <div className="page-header">
                      <h1 className="page-title">Halaman Input Nilai</h1>
                      <p className="page-description">Halaman ini akan dikerjakan oleh JOSAN.</p>
                    </div>
                    <div className="card placeholder-card">
                      <span className="placeholder-emoji">✏️</span>
                      <p>Modul Input Nilai — Coming Soon</p>
                    </div>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Raport — full view */}
          <Route
            path="/raport"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RaportView />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/raport/:studentId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RaportView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Rekap Nilai — class recap & ranking */}
          <Route
            path="/rekap"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RekapNilai />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* User Management — Admin only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <UserList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Profile — all authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
