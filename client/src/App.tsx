import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Builder from './pages/Builder/Builder';
import Landing from './pages/Landing/Landing';
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!token) return <Navigate to="/login" />;
  return children;
};

const AppShell = ({ showBack = false, children }: { showBack?: boolean; children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
    <header className="bg-white shadow-sm py-3 px-6 flex justify-between items-center border-b border-gray-100">
      <Link to="/dashboard" className="text-xl font-bold text-teal-600 tracking-tight flex items-center gap-2">
        <span className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white text-xs">✦</span>
        ResumeAI
      </Link>
      {showBack && (
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-teal-600 transition font-medium">
          ← Back to Dashboard
        </Link>
      )}
    </header>
    <main className="flex-grow flex flex-col">{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppShell>
                <Dashboard />
              </AppShell>
            </ProtectedRoute>
          } />
          <Route path="/builder" element={
            <ProtectedRoute>
              <AppShell showBack>
                <Builder />
              </AppShell>
            </ProtectedRoute>
          } />
          <Route path="/builder/:id" element={
            <ProtectedRoute>
              <AppShell showBack>
                <Builder />
              </AppShell>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
