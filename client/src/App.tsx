import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Builder from './pages/Builder/Builder';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Simple Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b border-gray-100">
          <h1 className="text-2xl font-bold text-teal-600 tracking-tight">ResumeAI</h1>
        </header>

        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/builder/:id" element={<Builder />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
