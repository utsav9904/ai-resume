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

const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    fontFamily: 'merriweather',
    fontSize: 'sm',
    lineHeight: 'normal',
    pagePadding: 'normal',
    sectionSpacing: 'normal',
    itemSpacing: 'normal',
    headingStyle: 'default',
    layout: '1-column',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
    sidebarSections: ['skills', 'certifications'],
    mainSections: ['summary', 'experience', 'education', 'projects'],
    columnRatio: '1/3-2/3',
    accentColor: data.templateColor || '#1e3a8a',
    textColor: '#1f2937',
    bgColor: '#ffffff',
    showIcons: true,
    showDates: true,
    pageBreaks: [],
  };

  const accentColor = customization.accentColor || data.templateColor || '#1e3a8a';
  const textColor = customization.textColor || '#1f2937';
  const bgColor = customization.bgColor || '#ffffff';
  
  const fontStyle = {
    fontFamily: fontMap[customization.fontFamily] || fontMap.merriweather,
    fontSize: fontSizeMap[customization.fontSize] || fontSizeMap.sm,
    color: textColor,
    backgroundColor: bgColor,
  };

  const showDates = customization.showDates !== false;
  const pageBreaks = customization.pageBreaks || [];

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <h2 className="text-[1.1em] font-bold tracking-wide uppercase font-serif" style={{ color: accentColor }}>
          {title}
        </h2>
        <div className="flex-1 h-[2px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!data.summary) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Executive Profile" />
        <p className="text-[0.95em] leading-relaxed text-gray-700 font-serif italic border-l-2 pl-3" style={{ borderColor: accentColor }}>
          {data.summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Leadership & Professional Experience" />
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline flex-wrap gap-1 mb-1">
                <div>
                  <span className="font-bold text-[1.05em] text-gray-900 font-serif">{exp.position}</span>
                  {exp.company && <span className="text-gray-600 font-medium"> · {exp.company}</span>}
                </div>
                {showDates && (
                  <span className="text-[0.85em] font-medium text-gray-500 font-mono">
                    {exp.startDate} - {exp.endDate}
                  </span>
                )}
              </div>
              {exp.description && (
                <p className="text-[0.9em] text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l border-gray-200">
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
      <div className="mb-5">
        <SectionHeader title="Education & Credentials" />
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline flex-wrap gap-1">
              <div>
                <span className="font-bold text-gray-900 font-serif">{edu.degree}</span>
                <div className="text-[0.9em] text-gray-600 font-medium">{edu.school}</div>
              </div>
              {showDates && (
                <span className="text-[0.85em] text-gray-500 font-mono">
                  {edu.startDate} - {edu.endDate}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const allSkills = [
    ...(data.skills?.technical || []),
    ...(data.skills?.soft || []),
    ...(data.skills?.languages || [])
  ];

  const renderSkills = () => {
    if (allSkills.length === 0) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Core Competencies" />
        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[0.85em] font-semibold px-3 py-1 rounded-md border font-serif"
              style={{ borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}0a` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Key Initiatives & Projects" />
        <div className="space-y-3">
          {data.projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-gray-900 font-serif">{proj.name}</span>
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[0.8em] underline text-blue-700 font-mono">
                    View Link ↗
                  </a>
                )}
              </div>
              {proj.description && (
                <p className="text-[0.9em] text-gray-700 leading-relaxed mt-1">
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Certifications & Honors" />
        <div className="space-y-2">
          {data.certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between text-[0.9em]">
              <span className="font-semibold text-gray-800 font-serif">{cert.name} — <span className="font-normal text-gray-600">{cert.organization}</span></span>
              {cert.date && <span className="text-gray-500 font-mono text-[0.85em]">{cert.date}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    const { personalInfo } = data;
    return (
      <header className="mb-6 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-serif tracking-tight text-gray-900" style={{ color: accentColor }}>
              {personalInfo?.fullName || 'Your Name'}
            </h1>
          </div>
          <div className="text-[0.85em] text-gray-600 text-left sm:text-right space-y-0.5 font-sans">
            {personalInfo?.email && <div>✉ {personalInfo.email}</div>}
            {personalInfo?.phone && <div>📞 {personalInfo.phone}</div>}
            {personalInfo?.address && <div>📍 {personalInfo.address}</div>}
            {personalInfo?.portfolio && <div>🌐 {personalInfo.portfolio}</div>}
            {personalInfo?.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
          </div>
        </div>
      </header>
    );
  };

  const orderList = customization.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
  const pageChunks = groupSectionsIntoPages(orderList, pageBreaks);
  const pageDim = getPageCardDimensions(customization.pageSize, customization.customPageSize);

  return (
    <div id="resume-preview" className="w-full space-y-8">
      {pageChunks.map((_, pageIndex) => (
        <div
          key={pageIndex}
          className="w-full bg-white shadow-2xl rounded-sm p-8 border border-gray-200 relative transition-all duration-300"
          style={{
            ...fontStyle,
            minHeight: pageDim.minHeight,
            aspectRatio: pageDim.aspectRatio,
          }}
        >
          <div className="absolute top-3 right-4 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px] font-bold uppercase tracking-wider select-none print:hidden shadow-xs">
            👑 Executive · Page {pageIndex + 1}
          </div>

          {pageIndex === 0 && renderHeader()}
          {renderSummary()}
          {renderExperience()}
          {renderEducation()}
          {renderSkills()}
          {renderProjects()}
          {renderCertifications()}
        </div>
      ))}
    </div>
  );
};

export default ExecutiveTemplate;
