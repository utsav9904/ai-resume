import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected pages */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b border-gray-100">
                  <h1 className="text-xl font-bold text-teal-600 tracking-tight flex items-center gap-2">
                    <span className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white text-xs">✦</span>
                    ResumeAI
                  </h1>
                </header>
                <main className="flex-grow flex flex-col"><Dashboard /></main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/builder" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <header className="bg-white shadow-sm py-3 px-6 flex justify-between items-center border-b border-gray-100">
                  <h1 className="text-xl font-bold text-teal-600 tracking-tight flex items-center gap-2">
                    <span className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white text-xs">✦</span>
                    ResumeAI
                  </h1>
                  <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800 transition">← Back to Dashboard</a>
                </header>
                <main className="flex-grow flex flex-col"><Builder /></main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/builder/:id" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <header className="bg-white shadow-sm py-3 px-6 flex justify-between items-center border-b border-gray-100">
                  <h1 className="text-xl font-bold text-teal-600 tracking-tight flex items-center gap-2">
                    <span className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white text-xs">✦</span>
                    ResumeAI
                  </h1>
                  <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800 transition">← Back to Dashboard</a>
                </header>
                <main className="flex-grow flex flex-col"><Builder /></main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
