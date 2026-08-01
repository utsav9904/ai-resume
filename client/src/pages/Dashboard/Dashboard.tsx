import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Edit3, Trash2, Copy, LogOut, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

import { resumeService } from '../../services/resumeService';

interface ResumeItem {
  _id: string;
  title?: string;
  template?: string;
  templateColor?: string;
  updatedAt?: string;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  summary?: string;
  experience?: unknown[];
  education?: unknown[];
  skills?: {
    technical?: string[];
  };
  [key: string]: unknown;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    resumeService.getUserResumes()
      .then(list => setResumes(list as ResumeItem[]))
      .catch(err => {
        console.error('Database fetch error:', err);
        toast.error('Failed to load resumes from cloud');
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteResume = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeService.deleteResume(id);
      setResumes(prev => prev.filter(r => r._id !== id));
      toast.success('Resume deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete resume');
    }
  };

  const duplicateResume = async (resume: ResumeItem) => {
    setDuplicating(resume._id);
    const toastId = toast.loading('Duplicating resume...');
    try {
      const duplicated = await resumeService.duplicateResume(resume as any);
      setResumes(prev => [duplicated as ResumeItem, ...prev]);
      toast.success('Resume duplicated', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to duplicate resume', { id: toastId });
    } finally {
      setDuplicating(null);
    }
  };

  const createNewResume = async () => {
    const toastId = toast.loading('Creating new resume...');
    try {
      const newId = await resumeService.saveResume(undefined, { title: 'Untitled Resume' });
      toast.success('Resume created', { id: toastId });
      navigate(`/builder/${newId}`);
    } catch (err) {
      console.error('Failed to create resume:', err);
      toast.error('Failed to create resume', { id: toastId });
    }
  };

  const getTemplateColor = (resume: ResumeItem) => resume.templateColor || '#0d9488';
  const getCompletion = (resume: ResumeItem) => {
    const checks = [
      resume.personalInfo?.fullName, resume.personalInfo?.email,
      resume.personalInfo?.phone, resume.summary,
      (resume.experience?.length ?? 0) > 0, (resume.education?.length ?? 0) > 0,
      (resume.skills?.technical?.length ?? 0) > 0,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500">Loading your resumes...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8 flex-grow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Resumes</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Build and manage your AI-powered resumes</p>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-medium text-gray-600">👋 {user?.name}</span>
          <div className="flex items-center gap-2">
            <button onClick={logout} className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-red-500 font-medium transition px-2 py-1.5 border border-gray-200 sm:border-none rounded-lg">
              <LogOut size={15} /> Logout
            </button>
            <button onClick={createNewResume} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold transition shadow-md shadow-teal-600/20 text-xs sm:text-sm">
              <PlusCircle size={17} /> Create New
            </button>
          </div>
        </div>
      </div>

      {/* Resume Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {resumes.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Create your first professional AI-powered resume now.</p>
            <button onClick={createNewResume} className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition text-sm">
              <Sparkles size={16} /> Get Started
            </button>
          </div>
        ) : (
          resumes.map((resume) => {
            const color = getTemplateColor(resume);
            const completion = getCompletion(resume);
            return (
              <div key={resume._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden group relative">
                {/* Mini Preview Card */}
                <div className="h-44 relative overflow-hidden" style={{ backgroundColor: `${color}10` }}>
                  {/* Mini resume preview */}
                  <div className="absolute inset-0 p-4 flex flex-col gap-2 scale-[0.85] origin-top-left w-[120%] opacity-90">
                    <div className="h-2 rounded-full w-2/3" style={{ backgroundColor: color }}/>
                    <div className="h-1.5 rounded-full w-1/2 bg-gray-200" />
                    <div className="h-1.5 rounded-full w-3/4 bg-gray-200" />
                    <div className="mt-2 h-1 rounded-full w-full bg-gray-200" />
                    <div className="h-1 rounded-full w-5/6 bg-gray-200" />
                    <div className="h-1 rounded-full w-4/6 bg-gray-200" />
                    <div className="mt-2 h-1.5 rounded-full w-1/3" style={{ backgroundColor: color, opacity: 0.7 }}/>
                    <div className="h-1 rounded-full w-full bg-gray-200" />
                    <div className="h-1 rounded-full w-5/6 bg-gray-200" />
                  </div>
                  {/* Template badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold capitalize text-white shadow-xs" style={{ backgroundColor: color }}>
                    {resume.template || 'modern'}
                  </div>
                  {/* Action buttons (Always accessible on mobile, hover effect on desktop) */}
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button
                      onClick={() => duplicateResume(resume)}
                      disabled={duplicating === resume._id}
                      title="Duplicate"
                      className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-teal-600 hover:shadow-md transition disabled:opacity-50"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => deleteResume(resume._id)}
                      title="Delete"
                      className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500 hover:shadow-md transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate mb-0.5 text-sm">{resume.title || 'Untitled Resume'}</h3>
                  <p className="text-xs text-gray-400 mb-3">Updated {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'recently'}</p>

                  {/* Completion bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Completion</span>
                      <span className="font-semibold" style={{ color }}>{completion}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${completion}%`, backgroundColor: color }} />
                    </div>
                  </div>

                  <Link
                    to={`/builder/${resume._id}`}
                    className="flex w-full items-center justify-center gap-2 text-sm font-medium py-2 rounded-xl border border-gray-200 text-gray-700 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50 transition"
                  >
                    <Edit3 size={15} /> Edit Resume
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
