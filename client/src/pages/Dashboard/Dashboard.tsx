import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/api/resumes');
        setResumes(res.data);
      } catch (err) {
        console.error('Failed to fetch resumes');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const deleteResume = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/api/resumes/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete resume');
    }
  };

  const createNewResume = async () => {
    try {
      const res = await api.post('/api/resumes', { title: 'Untitled Resume' });
      navigate(`/builder/${res.data._id}`);
    } catch (err) {
      console.error('Failed to create resume');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading resumes...</div>;

  return (
    <div className="max-w-6xl mx-auto w-full p-8 flex-grow">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Resumes</h2>
          <p className="text-gray-500 mt-1">Manage and create your ATS-friendly resumes</p>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm font-medium text-gray-600">Hi, {user?.name}</span>
           <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
           <button onClick={createNewResume} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-teal-600/20">
             <PlusCircle size={20} />
             Create New
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6">Create your first professional resume now.</p>
            <button onClick={createNewResume} className="text-teal-600 font-semibold hover:text-teal-700">Get Started &rarr;</button>
          </div>
        ) : (
          resumes.map((resume) => (
            <div key={resume._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-100 transition group relative">
              <button onClick={() => deleteResume(resume._id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={18} />
              </button>
              <div className="h-40 bg-gray-50 rounded-xl mb-6 flex items-center justify-center border border-gray-200 border-dashed">
                <FileText size={48} className="text-gray-300" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 truncate mb-1">{resume.title || 'Untitled Resume'}</h3>
              <p className="text-sm text-gray-500 mb-6">Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
              <Link to={`/builder/${resume._id}`} className="block w-full text-center bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition flex items-center justify-center gap-2">
                <Edit3 size={16} /> Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
