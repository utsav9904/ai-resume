import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Briefcase, GraduationCap, Code, FileText, Download, Plus, Trash2,
  Save, Sparkles, Mail, GripVertical, FolderOpen, Award, CheckCircle,
  Menu, X, Edit2, Target
} from 'lucide-react';
import api from '../../services/api';
import { useResumeStore } from '../../store/useResumeStore';
import ModernTemplate from '../../components/templates/ModernTemplate';
import MinimalistTemplate from '../../components/templates/MinimalistTemplate';
import ProfessionalTemplate from '../../components/templates/ProfessionalTemplate';
import { generatePDF } from '../../utils/pdfExport';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, children, onRemove }: { id: string; children: React.ReactNode; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative group p-5 border border-gray-200 rounded-xl bg-white mb-4">
      <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-grab opacity-0 group-hover:opacity-100 transition">
        <GripVertical size={20} />
      </div>
      <button onClick={onRemove} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 z-10">
        <Trash2 size={18} />
      </button>
      <div className="pl-4">{children}</div>
    </div>
  );
};

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition text-sm";

// Completion calculator
const calcCompletion = (store: any) => {
  let total = 0, filled = 0;
  const checks = [
    store.personalInfo.fullName, store.personalInfo.email, store.personalInfo.phone,
    store.personalInfo.address, store.personalInfo.linkedin, store.summary,
    store.experience.length > 0, store.education.length > 0,
    store.skills.technical.some((s: string) => s), store.projects.length > 0,
  ];
  checks.forEach(c => { total++; if (c) filled++; });
  return Math.round((filled / total) * 100);
};

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [tailorSuggestions, setTailorSuggestions] = useState<string[]>([]);
  const [tailoredSummary, setTailoredSummary] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const autoSaveTimer = useRef<any>(null);

  const store = useResumeStore();
  const {
    title, updateTitle,
    personalInfo, updatePersonalInfo,
    summary, updateSummary,
    experience, addExperience, updateExperience, removeExperience, reorderExperience,
    education, addEducation, updateEducation, removeEducation, reorderEducation,
    skills, updateSkills,
    projects, addProject, updateProject, removeProject,
    certifications, addCertification, updateCertification, removeCertification,
    template, templateColor, updateTemplateColor,
    setResume, resetResume,
  } = store;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Reset store on new resume, load on existing
  useEffect(() => {
    if (id) {
      api.get(`/api/resumes/${id}`).then(res => {
        if (res.data) setResume(res.data);
      }).catch(err => console.error('Failed to load resume:', err));
    } else {
      resetResume();
    }
  }, [id]);

  const doSave = useCallback(async (silent = false) => {
    if (!silent) setIsSaving(true);
    setSaveStatus('saving');
    try {
      const payload = {
        title: title || `${personalInfo.fullName || 'Untitled'}'s Resume`,
        personalInfo, summary, experience, education, skills, projects, certifications,
        template, templateColor,
      };
      if (id) {
        await api.put(`/api/resumes/${id}`, payload);
      } else {
        const res = await api.post('/api/resumes', payload);
        navigate(`/builder/${res.data._id}`, { replace: true });
      }
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    } finally {
      if (!silent) setIsSaving(false);
    }
  }, [title, personalInfo, summary, experience, education, skills, projects, certifications, template, templateColor, id, navigate]);

  // Auto-save debounce (3 seconds after last change)
  useEffect(() => {
    if (saveStatus === 'saved') return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => doSave(true), 3000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [title, personalInfo, summary, experience, education, skills, projects, certifications, template, templateColor]);

  // Mark unsaved on any change
  useEffect(() => { setSaveStatus('unsaved'); }, [
    title, personalInfo, summary, experience, education, skills, projects, certifications, template, templateColor
  ]);

  const handleGenerateAISummary = async () => {
    if (!personalInfo.fullName) return alert('Please fill in your name first!');
    setIsGeneratingAI(true);
    try {
      const prompt = `Write a professional resume summary for ${personalInfo.fullName}. Based on: ${JSON.stringify(experience)} and ${JSON.stringify(skills)}`;
      const res = await api.post('/api/ai/generate-summary', { prompt });
      updateSummary(res.data.summary);
    } catch { alert('Failed to generate summary.'); }
    finally { setIsGeneratingAI(false); }
  };

  const handleImproveBullet = async (expId: string, currentText: string) => {
    if (!currentText) return;
    try {
      const res = await api.post('/api/ai/improve-bullet', { text: currentText });
      updateExperience(expId, { description: res.data.improvedText });
    } catch { console.error('AI Error'); }
  };

  const handleSuggestSkills = async () => {
    try {
      const res = await api.post('/api/ai/suggest-skills', { experience, currentSkills: skills });
      if (res.data.technical) updateSkills('technical', [...new Set([...skills.technical.filter(s=>s), ...res.data.technical])]);
      if (res.data.soft) updateSkills('soft', [...new Set([...skills.soft.filter(s=>s), ...res.data.soft])]);
    } catch { console.error('AI Error'); }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription) return alert('Please paste a job description first!');
    setIsGeneratingCoverLetter(true);
    try {
      const res = await api.post('/api/ai/generate-cover-letter', {
        resumeData: { personalInfo, summary, experience, education, skills },
        jobDescription,
      });
      setCoverLetter(res.data.coverLetter);
    } catch { console.error('AI Error'); }
    finally { setIsGeneratingCoverLetter(false); }
  };

  const handleTailorResume = async () => {
    if (!jobDescription) return alert('Please paste a job description first!');
    setIsTailoring(true);
    try {
      const res = await api.post('/api/ai/tailor-resume', {
        resumeData: { personalInfo, summary, experience, education, skills },
        jobDescription,
      });
      setTailorSuggestions(res.data.suggestions || []);
      setTailoredSummary(res.data.improvedSummary || '');
    } catch { console.error('AI Error'); }
    finally { setIsTailoring(false); }
  };

  const handleDragEndExperience = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = experience.findIndex(x => x.id === active.id);
      const newIndex = experience.findIndex(x => x.id === over.id);
      reorderExperience(oldIndex, newIndex);
    }
  };

  const handleDragEndEducation = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = education.findIndex(x => x.id === active.id);
      const newIndex = education.findIndex(x => x.id === over.id);
      reorderEducation(oldIndex, newIndex);
    }
  };

  const completion = calcCompletion(store);

  const tabs = [
    { id: 'personal', icon: <User size={18} />, label: 'Personal Info' },
    { id: 'summary', icon: <FileText size={18} />, label: 'Summary' },
    { id: 'experience', icon: <Briefcase size={18} />, label: 'Experience' },
    { id: 'education', icon: <GraduationCap size={18} />, label: 'Education' },
    { id: 'skills', icon: <Code size={18} />, label: 'Skills' },
    { id: 'projects', icon: <FolderOpen size={18} />, label: 'Projects' },
    { id: 'certifications', icon: <Award size={18} />, label: 'Certifications' },
    { id: 'tailor', icon: <Target size={18} />, label: 'Job Tailor' },
    { id: 'coverLetter', icon: <Mail size={18} />, label: 'Cover Letter' },
  ];

  const SidebarContent = () => (
    <nav className="p-4 space-y-1">
      {/* Completion bar */}
      <div className="mb-4 px-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Resume Completion</span>
          <span className="font-bold text-teal-600">{completion}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${completion}%`, backgroundColor: completion === 100 ? '#10b981' : '#0d9488' }}
          />
        </div>
      </div>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === tab.id ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-gray-800">Resume Sections</span>
              <button onClick={() => setMobileSidebarOpen(false)}><X size={20} /></button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto hidden md:block flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Form Area */}
      <section className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-3 mb-4">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg border border-gray-200 bg-white">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-700">{tabs.find(t => t.id === activeTab)?.label}</span>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Editable Title */}
          <div className="flex items-center gap-2 mb-6">
            {isEditingTitle ? (
              <input
                autoFocus
                className="text-xl font-bold text-gray-800 border-b-2 border-teal-500 outline-none flex-1 bg-transparent"
                value={title}
                onChange={e => updateTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800 flex-1 truncate">{title || 'Untitled Resume'}</h2>
            )}
            <button onClick={() => setIsEditingTitle(v => !v)} className="text-gray-400 hover:text-teal-600 transition flex-shrink-0">
              <Edit2 size={16} />
            </button>
          </div>

          {/* ─── Personal ─── */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={personalInfo.fullName} onChange={e => updatePersonalInfo({ fullName: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={personalInfo.email} onChange={e => updatePersonalInfo({ email: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={personalInfo.phone} onChange={e => updatePersonalInfo({ phone: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={personalInfo.address} onChange={e => updatePersonalInfo({ address: e.target.value })} className={inputCls} placeholder="City, State, Country" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input type="url" value={personalInfo.linkedin} onChange={e => updatePersonalInfo({ linkedin: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input type="url" value={personalInfo.github} onChange={e => updatePersonalInfo({ github: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Website</label>
                <input type="url" value={personalInfo.portfolio} onChange={e => updatePersonalInfo({ portfolio: e.target.value })} className={inputCls} />
              </div>
            </div>
          )}

          {/* ─── Summary ─── */}
          {activeTab === 'summary' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea rows={6} value={summary} onChange={e => updateSummary(e.target.value)} className={inputCls} placeholder="Write a brief summary..." />
              <button onClick={handleGenerateAISummary} disabled={isGeneratingAI} className="mt-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition flex items-center gap-2 disabled:opacity-50">
                <Sparkles size={16} /> {isGeneratingAI ? 'Generating...' : '✨ Generate with AI'}
              </button>
            </div>
          )}

          {/* ─── Experience ─── */}
          {activeTab === 'experience' && (
            <div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndExperience}>
                <SortableContext items={experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
                  {experience.map((exp, index) => (
                    <SortableItem key={exp.id} id={exp.id} onRemove={() => removeExperience(exp.id)}>
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Experience #{index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Company</label><input type="text" value={exp.company} onChange={e => updateExperience(exp.id, { company: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Position</label><input type="text" value={exp.position} onChange={e => updateExperience(exp.id, { position: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label><input type="text" placeholder="Jan 2020" value={exp.startDate} onChange={e => updateExperience(exp.id, { startDate: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">End Date</label><input type="text" placeholder="Present" value={exp.endDate} onChange={e => updateExperience(exp.id, { endDate: e.target.value })} className={inputCls} /></div>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-600">Description</label>
                        <button onClick={() => handleImproveBullet(exp.id, exp.description)} className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">✨ AI Improve</button>
                      </div>
                      <textarea rows={3} value={exp.description} onChange={e => updateExperience(exp.id, { description: e.target.value })} className={inputCls} placeholder="Responsibilities and achievements..." />
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
              <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2 text-sm">
                <Plus size={18} /> Add Experience
              </button>
            </div>
          )}

          {/* ─── Education ─── */}
          {activeTab === 'education' && (
            <div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndEducation}>
                <SortableContext items={education.map(e => e.id)} strategy={verticalListSortingStrategy}>
                  {education.map((edu, index) => (
                    <SortableItem key={edu.id} id={edu.id} onRemove={() => removeEducation(edu.id)}>
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Education #{index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">School / University</label><input type="text" value={edu.school} onChange={e => updateEducation(edu.id, { school: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Degree</label><input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, { degree: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Grade / CGPA</label><input type="text" value={edu.grade} onChange={e => updateEducation(edu.id, { grade: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label><input type="text" placeholder="2018" value={edu.startDate} onChange={e => updateEducation(edu.id, { startDate: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">End Date</label><input type="text" placeholder="2022" value={edu.endDate} onChange={e => updateEducation(edu.id, { endDate: e.target.value })} className={inputCls} /></div>
                      </div>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
              <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2 text-sm">
                <Plus size={18} /> Add Education
              </button>
            </div>
          )}

          {/* ─── Skills ─── */}
          {activeTab === 'skills' && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Technical Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <button onClick={handleSuggestSkills} className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">✨ AI Suggest</button>
                </div>
                <textarea rows={3} value={skills.technical.join(', ')} onChange={e => updateSkills('technical', e.target.value.split(',').map(s => s.trimStart()))} className={inputCls} placeholder="React, Node.js, TypeScript..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <textarea rows={2} value={skills.soft.join(', ')} onChange={e => updateSkills('soft', e.target.value.split(',').map(s => s.trimStart()))} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <textarea rows={2} value={skills.languages.join(', ')} onChange={e => updateSkills('languages', e.target.value.split(',').map(s => s.trimStart()))} className={inputCls} />
              </div>
            </div>
          )}

          {/* ─── Projects ─── */}
          {activeTab === 'projects' && (
            <div>
              {(projects as any[]).map((proj, index) => (
                <div key={proj.id} className="relative group p-5 border border-gray-200 rounded-xl bg-white mb-4">
                  <button onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">Project #{index + 1}</h3>
                  <div className="space-y-3">
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Project Name</label><input type="text" value={proj.name} onChange={e => updateProject(proj.id, { name: e.target.value })} className={inputCls} /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Technologies Used</label><input type="text" value={proj.technologies} onChange={e => updateProject(proj.id, { technologies: e.target.value })} className={inputCls} placeholder="React, Node.js, MongoDB..." /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">GitHub Link</label><input type="url" value={proj.githubLink} onChange={e => updateProject(proj.id, { githubLink: e.target.value })} className={inputCls} /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Description</label><textarea rows={3} value={proj.description} onChange={e => updateProject(proj.id, { description: e.target.value })} className={inputCls} placeholder="What does the project do?" /></div>
                  </div>
                </div>
              ))}
              <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2 text-sm">
                <Plus size={18} /> Add Project
              </button>
            </div>
          )}

          {/* ─── Certifications ─── */}
          {activeTab === 'certifications' && (
            <div>
              {(certifications as any[]).map((cert, index) => (
                <div key={cert.id} className="relative group p-5 border border-gray-200 rounded-xl bg-white mb-4">
                  <button onClick={() => removeCertification(cert.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">Certification #{index + 1}</h3>
                  <div className="space-y-3">
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Certificate Name</label><input type="text" value={cert.name} onChange={e => updateCertification(cert.id, { name: e.target.value })} className={inputCls} /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Issuing Organization</label><input type="text" value={cert.organization} onChange={e => updateCertification(cert.id, { organization: e.target.value })} className={inputCls} placeholder="e.g. Google, AWS, Coursera..." /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Date Issued</label><input type="text" value={cert.date} onChange={e => updateCertification(cert.id, { date: e.target.value })} className={inputCls} placeholder="e.g. Mar 2024" /></div>
                  </div>
                </div>
              ))}
              <button onClick={addCertification} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2 text-sm">
                <Plus size={18} /> Add Certification
              </button>
            </div>
          )}

          {/* ─── Job Tailor ─── */}
          {activeTab === 'tailor' && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">Paste a job description and the AI will analyze your resume and suggest specific improvements to match the role.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea rows={7} value={jobDescription} onChange={e => setJobDescription(e.target.value)} className={inputCls} placeholder="Paste the job posting here..." />
              </div>
              <button onClick={handleTailorResume} disabled={isTailoring} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition flex items-center gap-2 disabled:opacity-50">
                <Target size={16} /> {isTailoring ? 'Analyzing...' : '✨ Tailor My Resume'}
              </button>
              {tailorSuggestions.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2"><CheckCircle size={16} /> AI Suggestions</h3>
                  <ul className="space-y-2">
                    {tailorSuggestions.map((s, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="mt-0.5 text-amber-500">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tailoredSummary && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-green-800">✅ AI-Tailored Summary</h3>
                    <button onClick={() => updateSummary(tailoredSummary)} className="text-xs font-bold text-green-700 hover:text-green-900 border border-green-300 px-2 py-1 rounded-lg">Use This</button>
                  </div>
                  <p className="text-sm text-green-700 leading-relaxed">{tailoredSummary}</p>
                </div>
              )}
            </div>
          )}

          {/* ─── Cover Letter ─── */}
          {activeTab === 'coverLetter' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea rows={6} value={jobDescription} onChange={e => setJobDescription(e.target.value)} className={inputCls} placeholder="Paste the job description here..." />
                <button onClick={handleGenerateCoverLetter} disabled={isGeneratingCoverLetter} className="mt-3 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition flex items-center gap-2 disabled:opacity-50">
                  <Sparkles size={16} /> {isGeneratingCoverLetter ? 'Generating...' : '✨ Generate Cover Letter'}
                </button>
              </div>
              {coverLetter && (
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-2">Generated Cover Letter</h3>
                  <textarea rows={12} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className={inputCls} />
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={() => { const i = tabs.findIndex(t => t.id === activeTab); if (i > 0) setActiveTab(tabs[i - 1].id); }}
              disabled={activeTab === tabs[0].id}
              className="px-5 py-2 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm disabled:opacity-0"
            >
              &larr; Previous
            </button>
            <button
              onClick={() => { const i = tabs.findIndex(t => t.id === activeTab); if (i < tabs.length - 1) setActiveTab(tabs[i + 1].id); }}
              disabled={activeTab === tabs[tabs.length - 1].id}
              className="px-5 py-2 rounded-xl font-medium bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm text-sm disabled:opacity-0"
            >
              Next Step &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Live Preview Area */}
      <section className="w-[45%] bg-gray-200 p-6 overflow-y-auto hidden lg:block border-l border-gray-300 flex-shrink-0">
        <div className="flex justify-between items-center mb-4 gap-3">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            {saveStatus === 'saving' && <><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /><span className="text-amber-600">Saving...</span></>}
            {saveStatus === 'saved' && <><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-green-600">All saved</span></>}
            {saveStatus === 'unsaved' && <><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-red-500">Unsaved changes</span></>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => doSave(false)} disabled={isSaving || saveStatus === 'saved'} className="bg-teal-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium hover:bg-teal-700 transition disabled:opacity-50">
              <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => generatePDF('resume-preview', `${personalInfo.fullName || 'resume'}.pdf`)} className="bg-gray-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium hover:bg-gray-900 transition">
              <Download size={14} /> PDF
            </button>
          </div>
        </div>

        {/* Template Customizer */}
        <div className="flex gap-3 mb-4 bg-white p-3 rounded-xl shadow-sm items-center">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Template</label>
            <select value={template} onChange={e => setResume({ template: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg p-1.5 outline-none bg-gray-50 focus:ring-1 focus:ring-teal-400">
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Color</label>
            <input type="color" value={templateColor} onChange={e => updateTemplateColor(e.target.value)} className="h-8 w-14 p-0.5 border border-gray-200 rounded-lg cursor-pointer bg-gray-50" />
          </div>
        </div>

        {/* A4 Paper */}
        <div className="w-full aspect-[1/1.414] bg-white shadow-xl mx-auto text-sm overflow-hidden rounded-sm">
          {template === 'modern' && <ModernTemplate data={store} />}
          {template === 'minimalist' && <MinimalistTemplate data={store} />}
          {template === 'professional' && <ProfessionalTemplate data={store} />}
        </div>
      </section>
    </div>
  );
};

export default Builder;
