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

// Pages — KEVIN
import GuruList from './pages/guru/GuruList';
import SiswaList from './pages/siswa/SiswaList';
import KelasList from './pages/kelas/KelasList';

// Pages — JOSAN
import MapelList from './pages/mapel/MapelList';
import TahunAjaranList from './pages/tahun-ajaran/TahunAjaranList';
import InputNilai from './pages/nilai/InputNilai';

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

          {/* Data Guru — KEVIN's page */}
          <Route
            path="/guru"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <GuruList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Data Siswa — KEVIN's page */}
          <Route
            path="/siswa"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <SiswaList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Data Kelas — KEVIN's page */}
          <Route
            path="/kelas"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <KelasList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Mata Pelajaran — JOSAN's page */}
          <Route
            path="/mapel"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <MapelList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Tahun Ajaran — JOSAN's page */}
          <Route
            path="/tahun-ajaran"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <TahunAjaranList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Input Nilai — JOSAN's page */}
          <Route
            path="/nilai"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <InputNilai />
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
            path="/rekap/:kelasId?"
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
