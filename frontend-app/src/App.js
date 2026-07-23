

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './components/Layout/MainLayout';

import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RaportView from './pages/raport/RaportView';
import RekapNilai from './pages/raport/RekapNilai';
import UserList from './pages/users/UserList';
import Profile from './pages/Profile';

import GuruList from './pages/guru/GuruList';
import SiswaList from './pages/siswa/SiswaList';
import KelasList from './pages/kelas/KelasList';

import MapelList from './pages/mapel/MapelList';
import TahunAjaranList from './pages/tahun-ajaran/TahunAjaranList';
import InputNilai from './pages/nilai/InputNilai';

function App() {
  return (
    <Router>
      <AuthProvider>

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

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

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
