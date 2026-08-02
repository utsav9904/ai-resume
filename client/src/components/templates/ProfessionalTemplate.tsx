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

const lineHeightMap = {
  compact: '1.2',
  normal: '1.5',
  spacious: '1.8'
};

const paddingMap = {
  compact: '16px',
  normal: '32px',
  spacious: '48px'
};

const sectionMarginMap = {
  compact: '12px',
  normal: '24px',
  spacious: '36px'
};

const itemMarginMap = {
  compact: '4px',
  normal: '12px',
  spacious: '20px'
};

const SectionHeader: React.FC<{ title: string; color: string; styleType: string; isSidebar?: boolean }> = ({ title, color, styleType, isSidebar }) => {
  const isUppercase = styleType === 'uppercase' || styleType === 'colored-bg';
  const displayTitle = isUppercase ? title.toUpperCase() : title;
  const borderColor = isSidebar ? 'rgba(255, 255, 255, 0.3)' : color;
  const textColor = isSidebar ? '#ffffff' : color;
  
  if (styleType === 'underline') {
    return (
      <h2 className="text-[1.1em] font-bold pb-1 border-b-2 mb-3" style={{ color: textColor, borderColor }}>
        {displayTitle}
      </h2>
    );
  }
  if (styleType === 'colored-bg') {
    return (
      <h2 className="text-[0.9em] font-bold px-3 py-1.5 rounded mb-3" style={{ backgroundColor: isSidebar ? 'rgba(255, 255, 255, 0.15)' : color, color: '#ffffff' }}>
        {displayTitle}
      </h2>
    );
  }
  if (styleType === 'border-left') {
    return (
      <h2 className="text-[1.1em] font-bold pl-2.5 border-l-4 mb-3" style={{ color: textColor, borderColor }}>
        {displayTitle}
      </h2>
    );
  }
  
  return (
    <h2 className="text-[1.1em] font-bold border-b pb-1 mb-3" style={{ color: textColor, borderColor }}>
      {displayTitle}
    </h2>
  );
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

const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    fontFamily: 'inter',
    fontSize: 'sm',
    lineHeight: 'normal',
    pagePadding: 'normal',
    sectionSpacing: 'normal',
    itemSpacing: 'normal',
    headingStyle: 'default',
    layout: '2-column',
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
    fontFamily: fontMap[customization.fontFamily] || fontMap.inter,
    fontSize: fontSizeMap[customization.fontSize] || fontSizeMap.sm,
    lineHeight: lineHeightMap[customization.lineHeight] || lineHeightMap.normal,
    color: textColor,
    backgroundColor: bgColor,
  };

  const pagePadding = paddingMap[customization.pagePadding] || paddingMap.normal;

  const sectionStyle = {
    marginBottom: sectionMarginMap[customization.sectionSpacing] || sectionMarginMap.normal,
  };

  const itemStyle = {
    marginBottom: itemMarginMap[customization.itemSpacing] || itemMarginMap.normal,
  };

  const showDates = customization.showDates !== false;
  const showIcons = customization.showIcons !== false;
  const pageBreaks = customization.pageBreaks || [];

  const expList = data.experience || [];
  const eduList = data.education || [];
  const techSkills = data.skills?.technical || [];
  const softSkills = data.skills?.soft || [];
  const langSkills = data.skills?.languages || [];
  const pInfo = data.personalInfo || {};

  // Render Subsections
  const renderSummary = (isSidebar = false) => {
    if (!data.summary) return null;
    return (
      <section style={sectionStyle} key="summary">
        <SectionHeader title="Professional Summary" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <p className="text-[0.88em] leading-relaxed">{data.summary}</p>
      </section>
    );
  };

  const renderExperience = (isSidebar = false) => {
    if (expList.length === 0) return null;
    return (
      <section style={sectionStyle} key="experience">
        <SectionHeader title="Work Experience" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="space-y-3">
          {expList.map((exp) => (
            <div key={exp.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[0.95em]">{exp.position || 'Position Title'}</h3>
                {showDates && (exp.startDate || exp.endDate) && (
                  <span className="text-[0.8em] font-semibold" style={{ color: isSidebar ? '#ffffff' : accentColor }}>
                    {exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}
                  </span>
                )}
              </div>
              <div className="text-[0.88em] font-medium opacity-85 mb-1">{exp.company || 'Company Name'}</div>
              {exp.description && (
                <p className="text-[0.82em] whitespace-pre-wrap leading-relaxed opacity-90">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = (isSidebar = false) => {
    if (eduList.length === 0) return null;
    return (
      <section style={sectionStyle} key="education">
        <SectionHeader title="Education" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="space-y-3">
          {eduList.map((edu) => (
            <div key={edu.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[0.92em]">{edu.degree || 'Degree'}</h3>
                {showDates && (edu.startDate || edu.endDate) && (
                  <span className="text-[0.78em] font-semibold" style={{ color: isSidebar ? '#ffffff' : accentColor }}>
                    {edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[0.85em] opacity-85">
                <span>{edu.school || 'School / University'}</span>
                {edu.grade && <span className="font-medium">{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = (isSidebar = false) => {
    const hasTechnical = techSkills.some(s => s);
    const hasSoft = softSkills.some(s => s);
    const hasLanguages = langSkills.some(s => s);
    if (!hasTechnical && !hasSoft && !hasLanguages) return null;

    return (
      <section style={sectionStyle} key="skills">
        <SectionHeader title="Skills & Competencies" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="text-[0.85em] space-y-2">
          {hasTechnical && (
            <div>
              <div className="font-semibold mb-0.5 text-[0.9em]">Technical Skills</div>
              <div className="flex flex-wrap gap-1">
                {techSkills.filter(s => s).map((sk, i) => (
                  <span key={i} className={`px-2 py-0.5 rounded text-[0.85em] ${isSidebar ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
          {hasSoft && (
            <div>
              <div className="font-semibold mb-0.5 text-[0.9em]">Soft Skills</div>
              <div className="opacity-90">{softSkills.filter(s => s).join(', ')}</div>
            </div>
          )}
          {hasLanguages && (
            <div>
              <div className="font-semibold mb-0.5 text-[0.9em]">Languages</div>
              <div className="opacity-90">{langSkills.filter(s => s).join(', ')}</div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderProjects = (isSidebar = false) => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <section style={sectionStyle} key="projects">
        <SectionHeader title="Key Projects" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="space-y-3">
          {(data.projects as any[]).map((proj) => (
            <div key={proj.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[0.92em]">{proj.name || 'Project Name'}</h3>
                {proj.githubLink && <span className="text-[0.8em]" style={{ color: isSidebar ? '#ffffff' : accentColor }}>{proj.githubLink}</span>}
              </div>
              {proj.technologies && <div className="text-[0.78em] opacity-75 mb-1">{proj.technologies}</div>}
              {proj.description && <p className="text-[0.82em] leading-relaxed opacity-80">{proj.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = (isSidebar = false) => {
    if (!data.certifications || data.certifications.length === 0) return null;
    return (
      <section style={sectionStyle} key="certifications">
        <SectionHeader title="Certifications" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="space-y-2">
          {(data.certifications as any[]).map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline" style={itemStyle}>
              <div className="text-[0.88em]">
                <span className="font-semibold">{cert.name || 'Certificate Name'}</span>
                {cert.organization && <span className="text-[0.82em] opacity-80 ml-2">— {cert.organization}</span>}
              </div>
              {showDates && cert.date && <span className="text-[0.78em] font-medium">{cert.date}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSection = (sectionId: string, isSidebar = false) => {
    switch (sectionId) {
      case 'summary': return renderSummary(isSidebar);
      case 'experience': return renderExperience(isSidebar);
      case 'education': return renderEducation(isSidebar);
      case 'skills': return renderSkills(isSidebar);
      case 'projects': return renderProjects(isSidebar);
      case 'certifications': return renderCertifications(isSidebar);
      default: return null;
    }
  };

  const orderList = customization.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
  const sidebarList = customization.sidebarSections || ['skills', 'certifications'];
  const mainList = customization.mainSections || ['summary', 'experience', 'education', 'projects'];
  const colRatio = customization.columnRatio || '1/3-2/3';

  const sidebarWidth = colRatio === '1/2-1/2' ? 'w-1/2' : colRatio === '2/3-1/3' ? 'w-2/3' : 'w-1/3';
  const mainWidth = colRatio === '1/2-1/2' ? 'w-1/2' : colRatio === '2/3-1/3' ? 'w-1/3' : 'w-2/3';

  const pageChunks = groupSectionsIntoPages(orderList, pageBreaks);

  // Render Contact Info Block
  const renderContactInfo = (isSidebar = false) => {
    const wrapperClass = isSidebar ? "space-y-2.5 mt-5" : "flex flex-wrap gap-x-4 gap-y-1 text-[0.85em] opacity-85 mt-2";
    const itemClass = isSidebar ? "break-all" : "";
    return (
      <div className={wrapperClass}>
        {pInfo.email && <div className={itemClass}>{showIcons ? '✉ ' : ''}{pInfo.email}</div>}
        {pInfo.phone && <div className={itemClass}>{showIcons ? '☎ ' : ''}{pInfo.phone}</div>}
        {pInfo.address && <div className={itemClass}>{showIcons ? '📍 ' : ''}{pInfo.address}</div>}
        {pInfo.linkedin && <div className={itemClass}>{showIcons ? '💼 ' : ''}{pInfo.linkedin}</div>}
        {pInfo.github && <div className={itemClass}>{showIcons ? '⌨ ' : ''}{pInfo.github}</div>}
        {pInfo.portfolio && <div className={itemClass}>{showIcons ? '🌐 ' : ''}{pInfo.portfolio}</div>}
      </div>
    );
  };

  const pageDim = getPageCardDimensions(customization.pageSize, customization.customPageSize);

  return (
    <div id="resume-preview" className="w-full space-y-8">
      {pageChunks.map((chunk, pageIndex) => (
        <div
          key={pageIndex}
          className={`w-full bg-white shadow-2xl rounded-sm border border-gray-200 relative flex overflow-hidden transition-all duration-300 ${pageIndex > 0 ? 'page-break-before' : ''}`}
          style={{
            ...fontStyle,
            minHeight: pageDim.minHeight,
            aspectRatio: pageDim.aspectRatio,
          }}
        >
          {/* Page Badge indicator */}
          <div className="absolute top-3 right-4 z-20 px-2.5 py-1 bg-gray-900 text-white rounded text-[10px] font-bold uppercase tracking-wider select-none print:hidden shadow-md flex items-center gap-1.5">
            <span>📄 Page {pageIndex + 1} of {pageChunks.length}</span>
            <span className="opacity-40">•</span>
            <span className="font-mono text-gray-300">{pageDim.label}</span>
          </div>

          {customization.layout === '1-column' ? (
            <div className="w-full flex flex-col" style={{ padding: pagePadding }}>
              {pageIndex === 0 && (
                <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
                  <h1 className="text-[2.2em] font-bold tracking-tight mb-1" style={{ lineHeight: 1.1 }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                  {renderContactInfo(false)}
                </header>
              )}
              <div className="space-y-1 flex-grow">
                {chunk.map(id => renderSection(id, false))}
              </div>
            </div>
          ) : (
            <>
              {/* Sidebar */}
              <aside className={`${sidebarWidth} text-white flex flex-col z-10`} style={{ backgroundColor: accentColor, padding: pagePadding }}>
                {pageIndex === 0 && (
                  <div className="mb-6">
                    <h1 className="text-[1.8em] font-bold tracking-tight leading-tight mb-1">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                    <div className="text-[0.7em] font-bold uppercase tracking-wider opacity-75 border-b border-white/20 pb-1.5 mt-4">Contact</div>
                    {renderContactInfo(true)}
                  </div>
                )}
                <div className="space-y-2 flex-grow mt-4">
                  {sidebarList.map(id => renderSection(id, true))}
                </div>
              </aside>

              {/* Main Content */}
              <main className={`${mainWidth} flex flex-col`} style={{ padding: pagePadding }}>
                <div className="space-y-2 flex-grow">
                  {pageIndex === 0 ? mainList.map(id => renderSection(id, false)) : chunk.map(id => renderSection(id, false))}
                </div>
              </main>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfessionalTemplate;
