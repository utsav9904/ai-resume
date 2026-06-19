import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Edit3 } from 'lucide-react';

const Dashboard = () => {
  const dummyResumes = [
    { id: 1, title: 'Software Engineer Resume', updatedAt: '2 hours ago' },
    { id: 2, title: 'Frontend Developer Role', updatedAt: '1 day ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full p-8 flex-grow">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Resumes</h2>
          <p className="text-gray-500 mt-1">Manage and create your ATS-friendly resumes</p>
        </div>
        <Link to="/builder" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-teal-600/20">
          <PlusCircle size={20} />
          Create New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyResumes.map(resume => (
          <div key={resume.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-dashed border-gray-200 group-hover:border-teal-300 transition">
              <FileText size={48} className="text-gray-300 group-hover:text-teal-500 transition" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">{resume.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Updated {resume.updatedAt}</p>
            <div className="flex gap-2">
              <Link to={`/builder/${resume.id}`} className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition text-sm">
                <Edit3 size={16} /> Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
