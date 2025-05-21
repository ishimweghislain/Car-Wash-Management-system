import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Packages from './pages/Packages';
import ServiceRecords from './pages/ServiceRecords';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Login from './pages/Login';

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                <div className="container mx-auto px-4 py-2">
                  <Dashboard />
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/cars" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                <div className="container mx-auto px-4 py-2">
                  <Cars />
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/packages" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                <div className="container mx-auto px-4 py-2">
                  <Packages />
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/service-records" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                <div className="container mx-auto px-4 py-2">
                  <ServiceRecords />
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/payments" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                <div className="container mx-auto px-4 py-2">
                  <Payments />
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                <div className="container mx-auto px-4 py-2">
                  <Reports />
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
