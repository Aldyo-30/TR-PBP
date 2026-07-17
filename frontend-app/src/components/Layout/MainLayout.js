/**
 * ============================================
 * Main Layout Component
 * ============================================
 * Wraps authenticated pages with Sidebar + Header.
 * - Manages sidebar toggle state
 * - Responsive layout (sidebar overlays on mobile)
 * ============================================
 */

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="layout-main">
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
