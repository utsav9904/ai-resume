import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Briefcase, GraduationCap, Code, FileText, Download, Plus, Trash2,
  Save, Sparkles, Mail, GripVertical, FolderOpen, Award, CheckCircle,
  Menu, X, Edit2, Target, Sliders, Columns, Type, Palette, Move, Heading,
  ChevronUp, ChevronDown, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { useResumeStore } from '../../store/useResumeStore';
import ModernTemplate from '../../components/templates/ModernTemplate';
import MinimalistTemplate from '../../components/templates/MinimalistTemplate';
import ProfessionalTemplate from '../../components/templates/ProfessionalTemplate';
import { generatePDF, generatePDFBlob, printVectorPDF } from '../../utils/pdfExport';
import { exportToDocx, exportToTxt, exportToJson } from '../../utils/docxExport';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'react-hot-toast';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../../config/firebase';
import { resumeService } from '../../services/resumeService';

const sectionLabels: { [key: string]: string } = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills & Languages',
  projects: 'Projects',
  certifications: 'Certifications',
};

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
  const [editorMode, setEditorMode] = useState<'content' | 'customize'>('content');
  const [activeCustomizeTab, setActiveCustomizeTab] = useState<'layout' | 'typography' | 'colors' | 'spacing' | 'headers'>('layout');
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
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
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
    customization, updateCustomization,
    setResume, resetResume,
  } = store;

  const moveSection = (sectionId: string, to: 'sidebar' | 'main') => {
    const sidebarList = customization.sidebarSections || ['skills', 'certifications'];
    const mainList = customization.mainSections || ['summary', 'experience', 'education', 'projects'];
    
    if (to === 'sidebar') {
      const newMain = mainList.filter(s => s !== sectionId);
      const newSidebar = [...sidebarList.filter(s => s !== sectionId), sectionId];
      updateCustomization({ mainSections: newMain, sidebarSections: newSidebar });
    } else {
      const newSidebar = sidebarList.filter(s => s !== sectionId);
      const newMain = [...mainList.filter(s => s !== sectionId), sectionId];
      updateCustomization({ mainSections: newMain, sidebarSections: newSidebar });
    }
  };

  const reorderSectionList = (listKey: 'sectionOrder' | 'sidebarSections' | 'mainSections', index: number, direction: 'up' | 'down') => {
    const list = [...(customization[listKey] || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    
    updateCustomization({ [listKey]: list });
  };

  const togglePageBreak = (sectionId: string) => {
    const pageBreaks = customization.pageBreaks || [];
    const nextPageBreaks = pageBreaks.includes(sectionId)
      ? pageBreaks.filter((id) => id !== sectionId)
      : [...pageBreaks, sectionId];
    updateCustomization({ pageBreaks: nextPageBreaks });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  const handleShareEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail) return;
    
    const toastId = toast.loading('Generating PDF and preparing email...');
    try {
      const blob = await generatePDFBlob('resume-preview', customization.pageSize || 'a4', customization.customPageSize);
      if (!blob) throw new Error('Failed to generate PDF');

      const uid = auth.currentUser?.uid || 'guest';
      const fileRef = ref(storage, `resumes/${uid}/shared_${Date.now()}.pdf`);
      await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);

      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';

      const data = {
        service_id: 'service_lf4pzre',
        template_id: templateId,
        user_id: 'u01NJS_ZbqnoN7kVS',
        template_params: {
          user_name: personalInfo.fullName || 'User',
          to_email: shareEmail,
          download_link: downloadUrl
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success('Email sent successfully!', { id: toastId });
      setShareModalOpen(false);
      setShareEmail('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to send email', { id: toastId });
    }
  };

  // Reset store on new resume, load on existing
  useEffect(() => {
    if (id) {
      resumeService.getResumeById(id, auth.currentUser?.uid).then(data => {
        if (data) {
          setResume(data as any);
          setSaveStatus('saved');
        } else {
          toast.error('Resume not found');
        }
      }).catch(err => {
        console.error('Failed to load resume:', err);
      });
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
        template, templateColor, customization,
      };

      const savedId = await resumeService.saveResume(id, payload, auth.currentUser?.uid);

      if (!id && savedId) {
        navigate(`/builder/${savedId}`, { replace: true });
      }

      setSaveStatus('saved');
      if (!silent) toast.success('Resume saved successfully!');
    } catch (err) {
      console.error(err);
      setSaveStatus('unsaved');
      if (!silent) toast.error('Failed to save resume');
    } finally {
      if (!silent) setIsSaving(false);
    }
  }, [title, personalInfo, summary, experience, education, skills, projects, certifications, template, templateColor, customization, id, navigate]);

  // Auto-save debounce (3 seconds after last change)
  useEffect(() => {
    if (saveStatus === 'saved') return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => doSave(true), 3000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [title, personalInfo, summary, experience, education, skills, projects, certifications, template, templateColor, customization]);

  // Mark unsaved on any change
  useEffect(() => { setSaveStatus('unsaved'); }, [
    title, personalInfo, summary, experience, education, skills, projects, certifications, template, templateColor, customization
  ]);

  const handleGenerateAISummary = async () => {
    if (!personalInfo.fullName) {
      toast.error('Please fill in your name first!');
      return;
    }
    setIsGeneratingAI(true);
    const toastId = toast.loading('Generating AI summary...');
    try {
      const prompt = `Write a professional resume summary for ${personalInfo.fullName}. Based on: ${JSON.stringify(experience)} and ${JSON.stringify(skills)}`;
      const res = await api.post('/api/ai/generate-summary', { prompt });
      updateSummary(res.data.summary);
      toast.success('Summary generated successfully', { id: toastId });
    } catch { 
      toast.error('Failed to generate summary.', { id: toastId }); 
    }
    finally { setIsGeneratingAI(false); }
  };

  const handleImproveBullet = async (expId: string, currentText: string) => {
    if (!currentText) return;
    const toastId = toast.loading('Improving text with AI...');
    try {
      const res = await api.post('/api/ai/improve-bullet', { text: currentText });
      updateExperience(expId, { description: res.data.improvedText });
      toast.success('Text improved successfully', { id: toastId });
    } catch { 
      toast.error('Failed to improve text', { id: toastId }); 
    }
  };

  const handleSuggestSkills = async () => {
    const toastId = toast.loading('Analyzing skills...');
    try {
      const res = await api.post('/api/ai/suggest-skills', { experience, currentSkills: skills });
      if (res.data.technical) updateSkills('technical', [...new Set([...skills.technical.filter(s=>s), ...res.data.technical])]);
      if (res.data.soft) updateSkills('soft', [...new Set([...skills.soft.filter(s=>s), ...res.data.soft])]);
      toast.success('Skills added successfully', { id: toastId });
    } catch { 
      toast.error('Failed to suggest skills', { id: toastId }); 
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription) {
      toast.error('Please paste a job description first!');
      return;
    }
    setIsGeneratingCoverLetter(true);
    const toastId = toast.loading('Generating Cover Letter...');
    try {
      const res = await api.post('/api/ai/generate-cover-letter', {
        resumeData: { personalInfo, summary, experience, education, skills },
        jobDescription,
      });
      setCoverLetter(res.data.coverLetter);
      toast.success('Cover Letter generated', { id: toastId });
    } catch { 
      toast.error('Failed to generate cover letter', { id: toastId }); 
    }
    finally { setIsGeneratingCoverLetter(false); }
  };

  const handleTailorResume = async () => {
    if (!jobDescription) {
      toast.error('Please paste a job description first!');
      return;
    }
    setIsTailoring(true);
    const toastId = toast.loading('Tailoring Resume...');
    try {
      const res = await api.post('/api/ai/tailor-resume', {
        resumeData: { personalInfo, summary, experience, education, skills },
        jobDescription,
      });
      setTailorSuggestions(res.data.suggestions || []);
      setTailoredSummary(res.data.improvedSummary || '');
      toast.success('Resume tailored successfully', { id: toastId });
    } catch { 
      toast.error('Failed to tailor resume', { id: toastId }); 
    }
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

  const customizeTabs = [
    { id: 'layout', icon: <Columns size={18} />, label: 'Layout & Columns' },
    { id: 'typography', icon: <Type size={18} />, label: 'Typography' },
    { id: 'colors', icon: <Palette size={18} />, label: 'Themes & Colors' },
    { id: 'spacing', icon: <Move size={18} />, label: 'Margins & Spacing' },
    { id: 'headers', icon: <Heading size={18} />, label: 'Heading Styles' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Mode Switcher */}
      <div className="p-3 border-b border-gray-150 flex gap-1.5 bg-gray-50/50">
        <button
          onClick={() => setEditorMode('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg transition border ${
            editorMode === 'content'
              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Edit2 size={13} /> Content
        </button>
        <button
          onClick={() => setEditorMode('customize')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg transition border ${
            editorMode === 'customize'
              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Sliders size={13} /> Customize
        </button>
      </div>

      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        {editorMode === 'content' ? (
          <>
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
          </>
        ) : (
          customizeTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveCustomizeTab(tab.id as any); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeCustomizeTab === tab.id ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))
        )}
      </nav>
    </div>
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

          {/* ─── Forms or Customize ─── */}
          {editorMode === 'content' ? (
            <>
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
            </>
          ) : (
            <>
              {/* ─── Customize Layout ─── */}
              {activeCustomizeTab === 'layout' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Paper Size</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {[
                        { id: 'a4', label: 'A4 Standard', desc: '210 × 297 mm' },
                        { id: 'letter', label: 'US Letter', desc: '8.5 × 11 in' },
                        { id: 'legal', label: 'US Legal', desc: '8.5 × 14 in' },
                        { id: 'executive', label: 'Executive', desc: '7.25 × 10.5 in' },
                        { id: 'custom', label: 'Custom Size', desc: 'Set mm dimensions' },
                      ].map(ps => (
                        <button
                          key={ps.id}
                          onClick={() => updateCustomization({ pageSize: ps.id as any })}
                          className={`p-2.5 border rounded-xl text-left transition ${
                            (customization.pageSize || 'a4') === ps.id
                              ? 'border-teal-500 bg-teal-50/50 text-teal-800 font-bold'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-xs font-semibold">{ps.label}</div>
                          <div className="text-[10px] opacity-75">{ps.desc}</div>
                        </button>
                      ))}
                    </div>

                    {customization.pageSize === 'custom' && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                        <span className="text-xs font-semibold text-gray-700 block">Custom Dimensions (in millimeters):</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1">Width (mm)</label>
                            <input
                              type="number"
                              min="100"
                              max="500"
                              value={customization.customPageSize?.widthMm || 210}
                              onChange={e => updateCustomization({ customPageSize: { widthMm: Number(e.target.value), heightMm: customization.customPageSize?.heightMm || 297 } })}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1">Height (mm)</label>
                            <input
                              type="number"
                              min="100"
                              max="700"
                              value={customization.customPageSize?.heightMm || 297}
                              onChange={e => updateCustomization({ customPageSize: { widthMm: customization.customPageSize?.widthMm || 210, heightMm: Number(e.target.value) } })}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Column Structure</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updateCustomization({ layout: '1-column' })}
                        className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${
                          customization.layout === '1-column'
                            ? 'border-teal-500 bg-teal-50/50 text-teal-800'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="w-12 h-8 border border-current rounded bg-white flex items-center justify-center p-1 gap-1">
                          <div className="w-full h-full bg-current opacity-20 rounded-sm" />
                        </div>
                        <span className="text-xs font-bold">Single Column</span>
                      </button>
                      
                      <button
                        onClick={() => updateCustomization({ layout: '2-column' })}
                        className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${
                          customization.layout === '2-column'
                            ? 'border-teal-500 bg-teal-50/50 text-teal-800'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="w-12 h-8 border border-current rounded bg-white flex items-center justify-center p-1 gap-1">
                          <div className="w-1/3 h-full bg-current opacity-30 rounded-sm" />
                          <div className="w-2/3 h-full bg-current opacity-20 rounded-sm" />
                        </div>
                        <span className="text-xs font-bold">Two Columns</span>
                      </button>
                    </div>
                  </div>

                  {customization.layout === '2-column' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Column Width Ratio</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: '1/3-2/3', label: '1/3 - 2/3' },
                          { id: '1/2-1/2', label: '1/2 - 1/2' },
                          { id: '2/3-1/3', label: '2/3 - 1/3' },
                        ].map(ratio => (
                          <button
                            key={ratio.id}
                            onClick={() => updateCustomization({ columnRatio: ratio.id as any })}
                            className={`py-2 px-3 text-xs font-medium border rounded-lg text-center transition ${
                              customization.columnRatio === ratio.id
                                ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {ratio.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section Organizer */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Arrange Sections</label>
                    
                    {customization.layout === '2-column' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Sidebar sections list */}
                        <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sidebar Column</div>
                          <div className="space-y-2">
                            {(customization.sidebarSections || []).map((secId, index) => {
                              const isPageBreak = (customization.pageBreaks || []).includes(secId);
                              return (
                                <div key={secId} className="flex justify-between items-center bg-white p-2.5 border border-gray-200 rounded-lg shadow-sm">
                                  <span className="text-xs font-medium text-gray-700">{sectionLabels[secId] || secId}</span>
                                  <div className="flex gap-1 items-center">
                                    <button disabled={index === 0} onClick={() => reorderSectionList('sidebarSections', index, 'up')} className="p-1 hover:text-teal-600 disabled:opacity-30"><ChevronUp size={14} /></button>
                                    <button disabled={index === (customization.sidebarSections || []).length - 1} onClick={() => reorderSectionList('sidebarSections', index, 'down')} className="p-1 hover:text-teal-600 disabled:opacity-30"><ChevronDown size={14} /></button>
                                    <button onClick={() => moveSection(secId, 'main')} className="text-xs font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100 ml-1">&rarr;</button>
                                    <button type="button" onClick={() => togglePageBreak(secId)} className={`text-[0.65rem] font-semibold px-2 py-1 rounded ${isPageBreak ? 'bg-teal-600 text-white border border-teal-600' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}>
                                      {isPageBreak ? 'Page break' : 'Add break'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                            {(customization.sidebarSections || []).length === 0 && (
                              <div className="text-center py-6 text-xs text-gray-400 italic">No sections in Sidebar.</div>
                            )}
                          </div>
                        </div>

                        {/* Main sections list */}
                        <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Column</div>
                          <div className="space-y-2">
                            {(customization.mainSections || []).map((secId, index) => {
                              const isPageBreak = (customization.pageBreaks || []).includes(secId);
                              return (
                                <div key={secId} className="flex justify-between items-center bg-white p-2.5 border border-gray-200 rounded-lg shadow-sm">
                                  <span className="text-xs font-medium text-gray-700">{sectionLabels[secId] || secId}</span>
                                  <div className="flex gap-1 items-center">
                                    <button onClick={() => moveSection(secId, 'sidebar')} className="text-xs font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100 mr-1">&larr;</button>
                                    <button disabled={index === 0} onClick={() => reorderSectionList('mainSections', index, 'up')} className="p-1 hover:text-teal-600 disabled:opacity-30"><ChevronUp size={14} /></button>
                                    <button disabled={index === (customization.mainSections || []).length - 1} onClick={() => reorderSectionList('mainSections', index, 'down')} className="p-1 hover:text-teal-600 disabled:opacity-30"><ChevronDown size={14} /></button>
                                    <button type="button" onClick={() => togglePageBreak(secId)} className={`text-[0.65rem] font-semibold px-2 py-1 rounded ${isPageBreak ? 'bg-teal-600 text-white border border-teal-600' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}>
                                      {isPageBreak ? 'Page break' : 'Add break'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                            {(customization.mainSections || []).length === 0 && (
                              <div className="text-center py-6 text-xs text-gray-400 italic">No sections in Main column.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 space-y-2">
                        {(customization.sectionOrder || []).map((secId, index) => {
                          const isPageBreak = (customization.pageBreaks || []).includes(secId);
                          return (
                            <div key={secId} className="flex justify-between items-center bg-white p-2.5 border border-gray-200 rounded-lg shadow-sm">
                              <span className="text-xs font-medium text-gray-700">{sectionLabels[secId] || secId}</span>
                              <div className="flex gap-1">
                                <button disabled={index === 0} onClick={() => reorderSectionList('sectionOrder', index, 'up')} className="p-1 hover:text-teal-600 disabled:opacity-30"><ChevronUp size={14} /></button>
                                <button disabled={index === (customization.sectionOrder || []).length - 1} onClick={() => reorderSectionList('sectionOrder', index, 'down')} className="p-1 hover:text-teal-600 disabled:opacity-30"><ChevronDown size={14} /></button>
                                <button type="button" onClick={() => togglePageBreak(secId)} className={`text-[0.65rem] font-semibold px-2 py-1 rounded ${isPageBreak ? 'bg-teal-600 text-white border border-teal-600' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}>
                                  {isPageBreak ? 'Page break' : 'Add break'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── Customize Typography ─── */}
              {activeCustomizeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Font Family</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'inter', name: 'Inter', desc: 'Modern & Clean', font: '"Inter", sans-serif' },
                        { id: 'roboto', name: 'Roboto', desc: 'Neutral & Readable', font: '"Roboto", sans-serif' },
                        { id: 'outfit', name: 'Outfit', desc: 'Elegant & Rounded', font: '"Outfit", sans-serif' },
                        { id: 'merriweather', name: 'Merriweather', desc: 'Classic Serif', font: '"Merriweather", serif' },
                        { id: 'playfair', name: 'Playfair Display', desc: 'Stylish & Editorial', font: '"Playfair Display", serif' },
                        { id: 'fira-code', name: 'Fira Code', desc: 'Technical & Mono', font: '"Fira Code", monospace' },
                      ].map(font => (
                        <button
                          key={font.id}
                          onClick={() => updateCustomization({ fontFamily: font.id as any })}
                          className={`p-3 border rounded-xl text-left transition ${
                            customization.fontFamily === font.id
                              ? 'border-teal-500 bg-teal-50/50 text-teal-800'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <div className="text-sm font-semibold" style={{ fontFamily: font.font }}>{font.name}</div>
                          <div className="text-[10px] opacity-75">{font.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base Font Size</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'xs', label: 'Extra Small' },
                        { id: 'sm', label: 'Small (Rec.)' },
                        { id: 'md', label: 'Medium' },
                        { id: 'lg', label: 'Large' },
                      ].map(size => (
                        <button
                          key={size.id}
                          onClick={() => updateCustomization({ fontSize: size.id as any })}
                          className={`py-2.5 text-xs font-semibold border rounded-lg text-center transition ${
                            customization.fontSize === size.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm font-bold'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {size.id.toUpperCase()}
                          <div className="text-[9px] font-normal opacity-75">{size.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Line Height</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compact', label: 'Compact', desc: '1.2' },
                        { id: 'normal', label: 'Normal', desc: '1.5' },
                        { id: 'spacious', label: 'Spacious', desc: '1.8' },
                      ].map(lh => (
                        <button
                          key={lh.id}
                          onClick={() => updateCustomization({ lineHeight: lh.id as any })}
                          className={`py-2 px-3 text-xs font-semibold border rounded-lg text-center transition ${
                            customization.lineHeight === lh.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm font-bold'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {lh.label}
                          <div className="text-[9px] font-normal opacity-75">{lh.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Customize Colors ─── */}
              {activeCustomizeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Color Presets</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { name: 'Teal Dream', hex: '#0d9488' },
                        { name: 'Midnight Navy', hex: '#1e3a8a' },
                        { name: 'Forest Green', hex: '#15803d' },
                        { name: 'Crimson Wine', hex: '#991b1b' },
                        { name: 'Royal Purple', hex: '#6d28d9' },
                        { name: 'Classic Black', hex: '#000000' },
                      ].map(preset => (
                        <button
                          key={preset.hex}
                          onClick={() => {
                            updateTemplateColor(preset.hex);
                            updateCustomization({ accentColor: preset.hex });
                          }}
                          className="p-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition text-left"
                        >
                          <div className="w-5 h-5 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: preset.hex }} />
                          <div className="text-xs font-semibold text-gray-700 truncate">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Custom Colors</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-semibold">Theme Accent</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={customization.accentColor || templateColor}
                            onChange={e => {
                              updateTemplateColor(e.target.value);
                              updateCustomization({ accentColor: e.target.value });
                            }}
                            className="h-8 w-14 p-0.5 border border-gray-200 rounded-lg cursor-pointer bg-gray-50"
                          />
                          <span className="text-xs font-mono">{customization.accentColor || templateColor}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-semibold">Primary Text</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={customization.textColor || '#1f2937'}
                            onChange={e => updateCustomization({ textColor: e.target.value })}
                            className="h-8 w-14 p-0.5 border border-gray-200 rounded-lg cursor-pointer bg-gray-50"
                          />
                          <span className="text-xs font-mono">{customization.textColor || '#1f2937'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-semibold">Background</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={customization.bgColor || '#ffffff'}
                            onChange={e => updateCustomization({ bgColor: e.target.value })}
                            className="h-8 w-14 p-0.5 border border-gray-200 rounded-lg cursor-pointer bg-gray-50"
                          />
                          <span className="text-xs font-mono">{customization.bgColor || '#ffffff'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={() => {
                        updateTemplateColor('#0d9488');
                        updateCustomization({
                          accentColor: '#0d9488',
                          textColor: '#1f2937',
                          bgColor: '#ffffff',
                        });
                      }}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 transition font-semibold"
                    >
                      <RefreshCw size={12} /> Reset to Defaults
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Customize Margins & Spacing ─── */}
              {activeCustomizeTab === 'spacing' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Margins</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compact', label: 'Compact', desc: '16px' },
                        { id: 'normal', label: 'Normal', desc: '32px' },
                        { id: 'spacious', label: 'Spacious', desc: '48px' },
                      ].map(p => (
                        <button
                          key={p.id}
                          onClick={() => updateCustomization({ pagePadding: p.id as any })}
                          className={`py-2 px-3 text-xs font-semibold border rounded-lg text-center transition ${
                            customization.pagePadding === p.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm font-bold'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {p.label}
                          <div className="text-[9px] font-normal opacity-75">{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Section Spacing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compact', label: 'Compact', desc: '12px' },
                        { id: 'normal', label: 'Normal', desc: '24px' },
                        { id: 'spacious', label: 'Spacious', desc: '36px' },
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => updateCustomization({ sectionSpacing: s.id as any })}
                          className={`py-2 px-3 text-xs font-semibold border rounded-lg text-center transition ${
                            customization.sectionSpacing === s.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm font-bold'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {s.label}
                          <div className="text-[9px] font-normal opacity-75">{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Item Spacing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compact', label: 'Compact', desc: '4px' },
                        { id: 'normal', label: 'Normal', desc: '12px' },
                        { id: 'spacious', label: 'Spacious', desc: '20px' },
                      ].map(i => (
                        <button
                          key={i.id}
                          onClick={() => updateCustomization({ itemSpacing: i.id as any })}
                          className={`py-2 px-3 text-xs font-semibold border rounded-lg text-center transition ${
                            customization.itemSpacing === i.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm font-bold'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {i.label}
                          <div className="text-[9px] font-normal opacity-75">{i.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Customize Headings & Visibility ─── */}
              {activeCustomizeTab === 'headers' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Section Header Design</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'default', label: 'Standard Text', desc: 'Simple text colored by theme accent' },
                        { id: 'underline', label: 'Underlined', desc: 'Line decoration beneath heading' },
                        { id: 'uppercase', label: 'All Uppercase', desc: 'All caps headings' },
                        { id: 'colored-bg', label: 'Banner Badge', desc: 'Solid filled banner with white text' },
                        { id: 'border-left', label: 'Left Border Accent', desc: 'Thick vertical accent border on left' },
                      ].map(style => (
                        <button
                          key={style.id}
                          onClick={() => updateCustomization({ headingStyle: style.id as any })}
                          className={`p-3 border rounded-xl text-left transition flex flex-col gap-0.5 ${
                            customization.headingStyle === style.id
                              ? 'border-teal-500 bg-teal-50/50 text-teal-800'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className="text-sm font-semibold">{style.label}</span>
                          <span className="text-[10px] opacity-75">{style.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <label className="block text-sm font-semibold text-gray-700">Display Settings</label>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition border border-gray-100">
                        <input
                          type="checkbox"
                          checked={customization.showIcons !== false}
                          onChange={e => updateCustomization({ showIcons: e.target.checked })}
                          className="h-4 w-4 rounded text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <div>
                          <span className="text-xs font-semibold text-gray-800 block">Show Contact Icons</span>
                          <span className="text-[10px] text-gray-500">Render contact badges/emojis (✉, 📞, 📍, etc.)</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition border border-gray-100">
                        <input
                          type="checkbox"
                          checked={customization.showDates !== false}
                          onChange={e => updateCustomization({ showDates: e.target.checked })}
                          className="h-4 w-4 rounded text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <div>
                          <span className="text-xs font-semibold text-gray-800 block">Show Section Dates</span>
                          <span className="text-[10px] text-gray-500 font-normal">Render start and end dates next to items</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700">Page Breaks (Multi-Page Control)</label>
                    <p className="text-xs text-gray-500">Toggle page breaks before specific sections to push them onto a new page in live preview & download.</p>
                    <div className="space-y-2">
                      {['summary', 'experience', 'education', 'skills', 'projects', 'certifications'].map(secId => {
                        const hasBreak = (customization.pageBreaks || []).includes(secId);
                        return (
                          <label key={secId} className={`flex items-center justify-between p-2.5 rounded-lg border transition cursor-pointer ${hasBreak ? 'border-teal-500 bg-teal-50/50 text-teal-800' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                            <span className="text-xs font-semibold">{sectionLabels[secId] || secId}</span>
                            <input
                              type="checkbox"
                              checked={hasBreak}
                              onChange={() => togglePageBreak(secId)}
                              className="h-4 w-4 rounded text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex justify-between items-center">
            {editorMode === 'content' ? (
              <>
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
              </>
            ) : (
              <>
                <button
                  onClick={() => { const i = customizeTabs.findIndex(t => t.id === activeCustomizeTab); if (i > 0) setActiveCustomizeTab(customizeTabs[i - 1].id as any); }}
                  disabled={activeCustomizeTab === customizeTabs[0].id}
                  className="px-5 py-2 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm disabled:opacity-0"
                >
                  &larr; Previous
                </button>
                <button
                  onClick={() => { const i = customizeTabs.findIndex(t => t.id === activeCustomizeTab); if (i < customizeTabs.length - 1) setActiveCustomizeTab(customizeTabs[i + 1].id as any); }}
                  disabled={activeCustomizeTab === customizeTabs[customizeTabs.length - 1].id}
                  className="px-5 py-2 rounded-xl font-medium bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm text-sm disabled:opacity-0"
                >
                  Next Step &rarr;
                </button>
              </>
            )}
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
          <div className="flex gap-2 relative">
            <button onClick={() => doSave(false)} disabled={isSaving || saveStatus === 'saved'} className="bg-teal-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium hover:bg-teal-700 transition disabled:opacity-50">
              <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
            </button>
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="bg-gray-900 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold hover:bg-gray-800 transition shadow-sm"
              >
                <Download size={14} /> Export & Download <ChevronDown size={14} />
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 text-xs text-gray-700">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Document Formats</div>
                  <button
                    onClick={() => { setExportMenuOpen(false); generatePDF('resume-preview', `${personalInfo.fullName || 'resume'}.pdf`, customization.pageSize || 'a4', customization.customPageSize); }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition"
                  >
                    <span>📄 Download PDF (Standard)</span>
                  </button>
                  <button
                    onClick={() => { setExportMenuOpen(false); printVectorPDF(); }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition"
                  >
                    <span>🖨️ Print / Vector PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      setShareModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition"
                  >
                    <span>📧 Share via Email</span>
                  </button>
                  <button
                    onClick={() => { setExportMenuOpen(false); exportToDocx(store, `${personalInfo.fullName || 'resume'}.docx`); }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition font-semibold text-teal-800"
                  >
                    <span>📝 Download DOCX (MS Word)</span>
                  </button>
                  <button
                    onClick={() => { setExportMenuOpen(false); exportToTxt(store, `${personalInfo.fullName || 'resume'}.txt`); }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition"
                  >
                    <span>📑 Download Plain Text (.txt)</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data Backup</div>
                  <button
                    onClick={() => { setExportMenuOpen(false); exportToJson(store, `${personalInfo.fullName || 'resume'}-backup.json`); }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition"
                  >
                    <span>💾 Backup Data (.json)</span>
                  </button>
                </div>
              )}
            </div>
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

        {/* Multi-Page A4 Paper Sheets Container */}
        <div className="w-full mx-auto text-sm pb-12">
          {template === 'modern' && <ModernTemplate data={store} />}
          {template === 'minimalist' && <MinimalistTemplate data={store} />}
          {template === 'professional' && <ProfessionalTemplate data={store} />}
        </div>
      </section>

      {/* Share via Email Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Mail className="text-teal-600" size={20} /> Share Resume
              </h3>
              <button onClick={() => setShareModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Enter an email address to share this resume. We will generate a secure link and send it directly via EmailJS.
            </p>
            <form onSubmit={handleShareEmail}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
                  placeholder="recruiter@company.com"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition shadow-sm flex items-center gap-2"
                >
                  <Mail size={16} /> Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
