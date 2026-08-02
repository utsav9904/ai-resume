import type { ResumeState } from '../../store/useResumeStore';
import React from 'react';
import { getPageCardDimensions } from '../../utils/pageSizeUtils';

interface TemplateProps {
  data: ResumeState;
}

const fontMap = {
  inter: '"Inter", sans-serif',
  roboto: '"Roboto", sans-serif',
  outfit: '"Outfit", sans-serif',
  merriweather: '"Merriweather", serif',
  playfair: '"Playfair Display", serif',
  'fira-code': '"Fira Code", monospace'
};

const fontSizeMap = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px'
};

const groupSectionsIntoPages = (sections: string[], breaks: string[]) => {
  const result: string[][] = [];
  let currentGroup: string[] = [];

  for (const sec of sections) {
    if (breaks.includes(sec) && currentGroup.length > 0) {
      result.push(currentGroup);
      currentGroup = [sec];
    } else {
      currentGroup.push(sec);
    }
  }
  if (currentGroup.length > 0) {
    result.push(currentGroup);
  }
  return result;
};

const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    fontFamily: 'outfit',
    fontSize: 'sm',
    accentColor: data.templateColor || '#ec4899',
    textColor: '#1f2937',
    showDates: true,
    pageBreaks: [],
  };

  const accentColor = customization.accentColor || data.templateColor || '#ec4899';
  const textColor = customization.textColor || '#1f2937';
  const pageBreaks = customization.pageBreaks || [];
  const showDates = customization.showDates !== false;

  const fontStyle = {
    fontFamily: fontMap[customization.fontFamily] || fontMap.outfit,
    fontSize: fontSizeMap[customization.fontSize] || fontSizeMap.sm,
    color: textColor,
  };

  const allSkills = [
    ...(data.skills?.technical || []),
    ...(data.skills?.soft || []),
    ...(data.skills?.languages || [])
  ];

  const renderSummary = () => {
    if (!data.summary) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2" style={{ color: accentColor }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          About Me
        </h2>
        <p className="text-[0.9em] leading-relaxed text-gray-700 font-medium">
          {data.summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: accentColor }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          Work Experience
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}33` }}>
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <div className="flex justify-between items-baseline flex-wrap">
                <span className="font-bold text-[1em] text-gray-900">{exp.position}</span>
                {showDates && (
                  <span className="text-[0.8em] font-semibold px-2 py-0.5 rounded text-gray-600 bg-gray-100 font-mono">
                    {exp.startDate} - {exp.endDate}
                  </span>
                )}
              </div>
              <div className="text-[0.85em] font-semibold text-gray-500 mb-1">{exp.company}</div>
              {exp.description && (
                <p className="text-[0.88em] text-gray-700 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!data.education || data.education.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: accentColor }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          Education
        </h2>
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="font-bold text-gray-900">{edu.degree}</div>
              <div className="text-[0.85em] font-medium text-gray-600">{edu.school}</div>
              {showDates && <div className="text-[0.8em] text-gray-400 font-mono">{edu.startDate} - {edu.endDate}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: accentColor }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          Projects & Portfolio
        </h2>
        <div className="space-y-3">
          {data.projects.map((proj) => (
            <div key={proj.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-gray-900">{proj.name}</span>
                {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-xs font-semibold underline" style={{ color: accentColor }}>Link ↗</a>}
              </div>
              {proj.description && <p className="text-[0.85em] text-gray-600 mt-1">{proj.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSidebarSkills = () => {
    if (allSkills.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xs font-black tracking-widest uppercase text-white/80 mb-3 border-b border-white/20 pb-1">
          Skills & Mastery
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {allSkills.map((skill, idx) => (
            <span key={idx} className="text-[0.8em] font-semibold px-2.5 py-1 bg-white/20 text-white rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderSidebarCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xs font-black tracking-widest uppercase text-white/80 mb-3 border-b border-white/20 pb-1">
          Certifications
        </h3>
        <div className="space-y-2 text-[0.85em] text-white/90">
          {data.certifications.map((cert) => (
            <div key={cert.id}>
              <div className="font-bold text-white">{cert.name}</div>
              <div className="text-[0.8em] text-white/70">{cert.organization}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const orderList = customization.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
  const pageChunks = groupSectionsIntoPages(orderList, pageBreaks);
  const pageDim = getPageCardDimensions(customization.pageSize, customization.customPageSize);

  const { personalInfo } = data;

  return (
    <div id="resume-preview" className="w-full space-y-8">
      {pageChunks.map((_, pageIndex) => (
        <div
          key={pageIndex}
          className="w-full bg-white shadow-2xl rounded-sm border border-gray-200 relative overflow-hidden flex flex-col md:flex-row transition-all duration-300"
          style={{
            ...fontStyle,
            minHeight: pageDim.minHeight,
            aspectRatio: pageDim.aspectRatio,
          }}
        >
          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 p-6 text-white flex flex-col justify-between" style={{ backgroundColor: accentColor }}>
            <div>
              <div className="mb-8 border-b border-white/20 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center font-black text-2xl mb-4 text-white shadow-inner">
                  {(personalInfo?.fullName || 'Y').charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl font-black tracking-tight leading-tight text-white">
                  {personalInfo?.fullName || 'Your Name'}
                </h1>
              </div>

              {/* Contact Info Sidebar */}
              <div className="mb-8 space-y-2 text-[0.85em] text-white/90">
                <h3 className="text-xs font-black tracking-widest uppercase text-white/80 mb-2 border-b border-white/20 pb-1">
                  Contact
                </h3>
                {personalInfo?.email && <div className="break-all">✉ {personalInfo.email}</div>}
                {personalInfo?.phone && <div>📞 {personalInfo.phone}</div>}
                {personalInfo?.address && <div>📍 {personalInfo.address}</div>}
                {personalInfo?.portfolio && <div className="break-all">🌐 {personalInfo.portfolio}</div>}
                {personalInfo?.linkedin && <div className="break-all">🔗 {personalInfo.linkedin}</div>}
              </div>

              {renderSidebarSkills()}
              {renderSidebarCertifications()}
            </div>

            <div className="text-[10px] text-white/60 uppercase tracking-widest pt-4">
              🎨 Creative Theme · Page {pageIndex + 1}
            </div>
          </div>

          {/* Right Main Content */}
          <div className="w-full md:w-2/3 p-8 bg-white">
            {renderSummary()}
            {renderExperience()}
            {renderEducation()}
            {renderProjects()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreativeTemplate;
