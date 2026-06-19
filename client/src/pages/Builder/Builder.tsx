import { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, FileText, Download, Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import ModernTemplate from '../../components/templates/ModernTemplate';
import { generatePDF } from '../../utils/pdfExport';

const Builder = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const store = useResumeStore();
  const { 
    personalInfo, updatePersonalInfo, 
    summary, updateSummary,
    experience, addExperience, updateExperience, removeExperience,
    education, addEducation, updateEducation, removeEducation,
    skills, updateSkills
  } = store;

  const tabs = [
    { id: 'personal', icon: <User size={20}/>, label: 'Personal Info' },
    { id: 'summary', icon: <FileText size={20}/>, label: 'Summary' },
    { id: 'experience', icon: <Briefcase size={20}/>, label: 'Experience' },
    { id: 'education', icon: <GraduationCap size={20}/>, label: 'Education' },
    { id: 'skills', icon: <Code size={20}/>, label: 'Skills' },
  ];

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
        <nav className="p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Form Area */}
      <section className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{activeTab}</h2>
          
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" 
                />
              </div>
              <div className="col-span-2">
                 <p className="text-sm text-gray-500 italic mt-4">Other fields (Address, LinkedIn, GitHub) will be implemented in the full version.</p>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
               <textarea 
                  rows={6}
                  value={summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  placeholder="Write a brief summary of your professional background..."
               ></textarea>
               <button className="mt-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition flex items-center gap-2">
                 ✨ Generate with AI
               </button>
             </div>
          )}
          
          {activeTab === 'experience' && (
             <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="p-5 border border-gray-200 rounded-xl bg-white relative group">
                    <button 
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                    <h3 className="font-semibold text-gray-800 mb-4">Experience #{index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="text" placeholder="Jan 2020" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="text" placeholder="Present" value={exp.endDate} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">✨ AI Improve</button>
                      </div>
                      <textarea rows={4} value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Describe your responsibilities and achievements..."></textarea>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={addExperience}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add Experience
                </button>
             </div>
          )}
          
          {activeTab === 'education' && (
             <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={edu.id} className="p-5 border border-gray-200 rounded-xl bg-white relative group">
                    <button 
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                    <h3 className="font-semibold text-gray-800 mb-4">Education #{index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">School / University</label>
                        <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, { school: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="e.g. B.S. Computer Science" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade / CGPA</label>
                        <input type="text" value={edu.grade} onChange={(e) => updateEducation(edu.id, { grade: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="text" placeholder="2018" value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="text" placeholder="2022" value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={addEducation}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add Education
                </button>
             </div>
          )}

          {activeTab === 'skills' && (
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Technical Skills (comma separated)</label>
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">✨ AI Suggest</button>
                  </div>
                  <textarea rows={3} value={skills.technical.join(', ')} onChange={(e) => updateSkills('technical', e.target.value.split(',').map(s => s.trimStart()))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="React, Node.js, TypeScript..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills (comma separated)</label>
                  <textarea rows={2} value={skills.soft.join(', ')} onChange={(e) => updateSkills('soft', e.target.value.split(',').map(s => s.trimStart()))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Leadership, Communication..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                  <textarea rows={2} value={skills.languages.join(', ')} onChange={(e) => updateSkills('languages', e.target.value.split(',').map(s => s.trimStart()))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="English, Spanish..."></textarea>
                </div>
             </div>
          )}
        </div>
      </section>

      {/* Live Preview Area */}
      <section className="w-[45%] bg-gray-200 p-8 overflow-y-auto hidden lg:block border-l border-gray-300">
         <div className="flex justify-end mb-4">
            <button 
              onClick={() => generatePDF('resume-preview', `${personalInfo.fullName || 'resume'}.pdf`)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-900 transition"
            >
              <Download size={16} /> Download PDF
            </button>
         </div>
         {/* A4 Paper mockup */}
         <div className="w-full aspect-[1/1.414] bg-white shadow-xl mx-auto text-sm overflow-hidden">
            <ModernTemplate data={store} />
         </div>
      </section>
    </div>
  );
};

export default Builder;
