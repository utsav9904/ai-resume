import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Briefcase, GraduationCap, Code, FileText, Download, Plus, Trash2, Save, Sparkles, Mail, GripVertical } from 'lucide-react';
import api from '../../services/api';
import { useResumeStore } from '../../store/useResumeStore';
import ModernTemplate from '../../components/templates/ModernTemplate';
import MinimalistTemplate from '../../components/templates/MinimalistTemplate';
import ProfessionalTemplate from '../../components/templates/ProfessionalTemplate';
import { generatePDF } from '../../utils/pdfExport';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, children, onRemove }: { id: string, children: React.ReactNode, onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative group p-5 border border-gray-200 rounded-xl bg-white mb-4">
      <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-grab opacity-0 group-hover:opacity-100 transition">
        <GripVertical size={20} />
      </div>
      <button 
        onClick={onRemove}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 z-10"
      >
        <Trash2 size={18} />
      </button>
      <div className="pl-4">
        {children}
      </div>
    </div>
  );
};

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const store = useResumeStore();
  const { 
    personalInfo, updatePersonalInfo, 
    summary, updateSummary,
    experience, addExperience, updateExperience, removeExperience, reorderExperience,
    education, addEducation, updateEducation, removeEducation, reorderEducation,
    skills, updateSkills,
    template, templateColor, updateTemplateColor,
    setResume
  } = store;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (id) {
      api.get(`/api/resumes/${id}`).then(res => {
        if (res.data) setResume(res.data);
      }).catch(err => {
        console.error('Failed to load resume:', err);
      });
    }
  }, [id, setResume]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title: `${personalInfo.fullName || 'Untitled'}'s Resume`,
        personalInfo, summary, experience, education, skills,
        template, templateColor
      };
      if (id) {
        await api.put(`/api/resumes/${id}`, payload);
      } else {
        const res = await api.post('/api/resumes', payload);
        navigate(`/builder/${res.data._id}`);
      }
    } catch (err) {
      console.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAISummary = async () => {
    if (!personalInfo.fullName) return alert('Please fill in your name first!');
    setIsGeneratingAI(true);
    try {
      const prompt = `Write a professional resume summary for ${personalInfo.fullName}. Based on: ${JSON.stringify(experience)} and ${JSON.stringify(skills)}`;
      const res = await api.post('/api/ai/generate-summary', { prompt });
      updateSummary(res.data.summary);
    } catch (err) {
      console.error('AI Error:', err);
      alert('Failed to generate summary.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleImproveBullet = async (expId: string, currentText: string) => {
    if (!currentText) return;
    try {
      const res = await api.post('/api/ai/improve-bullet', { text: currentText });
      updateExperience(expId, { description: res.data.improvedText });
    } catch (err) {
      console.error('AI Error:', err);
    }
  };

  const handleSuggestSkills = async () => {
    try {
      const res = await api.post('/api/ai/suggest-skills', { experience, currentSkills: skills });
      if (res.data.technical) updateSkills('technical', res.data.technical);
      if (res.data.soft) updateSkills('soft', res.data.soft);
    } catch (err) {
      console.error('AI Error:', err);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription) return alert('Please paste a job description first!');
    setIsGeneratingCoverLetter(true);
    try {
      const res = await api.post('/api/ai/generate-cover-letter', { 
        resumeData: { personalInfo, summary, experience, education, skills },
        jobDescription 
      });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleDragEndExperience = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = experience.findIndex(x => x.id === active.id);
      const newIndex = experience.findIndex(x => x.id === over.id);
      reorderExperience(oldIndex, newIndex);
    }
  };

  const handleDragEndEducation = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = education.findIndex(x => x.id === active.id);
      const newIndex = education.findIndex(x => x.id === over.id);
      reorderEducation(oldIndex, newIndex);
    }
  };

  const tabs = [
    { id: 'personal', icon: <User size={20}/>, label: 'Personal Info' },
    { id: 'summary', icon: <FileText size={20}/>, label: 'Summary' },
    { id: 'experience', icon: <Briefcase size={20}/>, label: 'Experience' },
    { id: 'education', icon: <GraduationCap size={20}/>, label: 'Education' },
    { id: 'skills', icon: <Code size={20}/>, label: 'Skills' },
    { id: 'coverLetter', icon: <Mail size={20}/>, label: 'Cover Letter' },
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
          
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={personalInfo.fullName} onChange={(e) => updatePersonalInfo({ fullName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={personalInfo.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={personalInfo.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={personalInfo.address} onChange={(e) => updatePersonalInfo({ address: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="City, State, Country"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input type="url" value={personalInfo.linkedin} onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input type="url" value={personalInfo.github} onChange={(e) => updatePersonalInfo({ github: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Website</label>
                <input type="url" value={personalInfo.portfolio} onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
               <textarea rows={6} value={summary} onChange={(e) => updateSummary(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Write a brief summary..."></textarea>
               <button onClick={handleGenerateAISummary} disabled={isGeneratingAI} className="mt-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition flex items-center gap-2 disabled:opacity-50">
                 <Sparkles size={16} /> {isGeneratingAI ? 'Generating...' : '✨ Generate with AI'}
               </button>
             </div>
          )}
          
          {activeTab === 'experience' && (
             <div className="space-y-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndExperience}>
                  <SortableContext items={experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
                    {experience.map((exp, index) => (
                      <SortableItem key={exp.id} id={exp.id} onRemove={() => removeExperience(exp.id)}>
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
                            <button onClick={() => handleImproveBullet(exp.id, exp.description)} className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">✨ AI Improve</button>
                          </div>
                          <textarea rows={4} value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Responsibilities and achievements..."></textarea>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                
                <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2">
                  <Plus size={20} /> Add Experience
                </button>
             </div>
          )}
          
          {activeTab === 'education' && (
             <div className="space-y-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndEducation}>
                  <SortableContext items={education.map(e => e.id)} strategy={verticalListSortingStrategy}>
                    {education.map((edu, index) => (
                      <SortableItem key={edu.id} id={edu.id} onRemove={() => removeEducation(edu.id)}>
                        <h3 className="font-semibold text-gray-800 mb-4">Education #{index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">School / University</label>
                            <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, { school: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                            <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
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
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                
                <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2">
                  <Plus size={20} /> Add Education
                </button>
             </div>
          )}

          {activeTab === 'skills' && (
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Technical Skills (comma separated)</label>
                    <button onClick={handleSuggestSkills} className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">✨ AI Suggest</button>
                  </div>
                  <textarea rows={3} value={skills.technical.join(', ')} onChange={(e) => updateSkills('technical', e.target.value.split(',').map(s => s.trimStart()))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="React, Node.js..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills (comma separated)</label>
                  <textarea rows={2} value={skills.soft.join(', ')} onChange={(e) => updateSkills('soft', e.target.value.split(',').map(s => s.trimStart()))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                  <textarea rows={2} value={skills.languages.join(', ')} onChange={(e) => updateSkills('languages', e.target.value.split(',').map(s => s.trimStart()))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"></textarea>
                </div>
             </div>
          )}

          {activeTab === 'coverLetter' && (
             <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea rows={6} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Paste the job description here..."></textarea>
                  <button onClick={handleGenerateCoverLetter} disabled={isGeneratingCoverLetter} className="mt-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition flex items-center gap-2 disabled:opacity-50">
                    <Sparkles size={16} /> {isGeneratingCoverLetter ? 'Generating Cover Letter...' : '✨ Generate Tailored Cover Letter'}
                  </button>
                </div>
                {coverLetter && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Generated Cover Letter</h3>
                    <textarea rows={12} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition text-sm"></textarea>
                  </div>
                )}
             </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
            <button 
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
              }}
              disabled={activeTab === tabs[0].id}
              className="px-6 py-2.5 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-0"
            >
              &larr; Previous
            </button>
            <button 
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
              }}
              disabled={activeTab === tabs[tabs.length - 1].id}
              className="px-6 py-2.5 rounded-xl font-medium bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm disabled:opacity-0"
            >
              Next Step &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Live Preview Area */}
      <section className="w-[45%] bg-gray-200 p-8 overflow-y-auto hidden lg:block border-l border-gray-300">
         <div className="flex justify-end mb-4 gap-3">
            <button onClick={handleSave} disabled={isSaving} className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50">
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
            <button onClick={() => generatePDF('resume-preview', `${personalInfo.fullName || 'resume'}.pdf`)} className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-900 transition">
              <Download size={16} /> Download PDF
            </button>
         </div>

         {/* Template Customizer */}
         <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm items-center">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Template</label>
              <select value={template} onChange={(e) => setResume({ template: e.target.value })} className="w-full text-sm border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-gray-50 p-2 border outline-none">
                <option value="modern">Modern</option>
                <option value="minimalist">Minimalist</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Accent Color</label>
              <input type="color" value={templateColor} onChange={(e) => updateTemplateColor(e.target.value)} className="h-9 w-16 p-1 border border-gray-200 rounded-lg cursor-pointer bg-gray-50" />
            </div>
         </div>

         {/* A4 Paper mockup */}
         <div className="w-full aspect-[1/1.414] bg-white shadow-xl mx-auto text-sm overflow-hidden">
            {template === 'modern' && <ModernTemplate data={store} />}
            {template === 'minimalist' && <MinimalistTemplate data={store} />}
            {template === 'professional' && <ProfessionalTemplate data={store} />}
         </div>
      </section>
    </div>
  );
};

export default Builder;
