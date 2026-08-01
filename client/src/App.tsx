import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Builder from './pages/Builder/Builder';
import Landing from './pages/Landing/Landing';
import Blog from './pages/Blog/Blog';
import BlogDetail from './pages/Blog/BlogDetail';
import FutureFeatures from './pages/FutureFeatures/FutureFeatures';
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

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

const AppShell = ({ showBack = false, children }: { showBack?: boolean; children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-xs py-3 px-4 sm:px-6 flex justify-between items-center border-b border-gray-100 z-30 relative">
        <Link to="/dashboard" className="text-lg sm:text-xl font-bold text-teal-600 tracking-tight flex items-center gap-2">
          <span className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-xs">✦</span>
          ResumeAI
        </Link>
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to="/dashboard" className="text-xs sm:text-sm text-gray-600 hover:text-teal-600 transition font-medium flex items-center gap-1">
              ← <span className="hidden sm:inline">Back to</span> Dashboard
            </Link>
          )}
          {user && (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
              <span className="text-xs text-gray-500 font-medium">👋 {user.name}</span>
              <button
                onClick={logout}
                className="text-xs text-gray-500 hover:text-red-500 font-medium transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow flex flex-col">{children}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/future-features" element={<FutureFeatures />} />

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
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </AuthProvider>
  );
}

export default App;
