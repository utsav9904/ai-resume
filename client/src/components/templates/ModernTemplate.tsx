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

const SectionHeader: React.FC<{ title: string; color: string; styleType: string }> = ({ title, color, styleType }) => {
  const isUppercase = styleType === 'uppercase' || styleType === 'colored-bg';
  const displayTitle = isUppercase ? title.toUpperCase() : title;
  
  if (styleType === 'underline') {
    return (
      <h2 className="text-[1.15em] font-bold pb-1 border-b-2 mb-3" style={{ color, borderColor: color }}>
        {displayTitle}
      </h2>
    );
  }
  if (styleType === 'colored-bg') {
    return (
      <h2 className="text-[0.95em] font-bold px-3 py-1.5 rounded mb-3 text-white" style={{ backgroundColor: color }}>
        {displayTitle}
      </h2>
    );
  }
  if (styleType === 'border-left') {
    return (
      <h2 className="text-[1.15em] font-bold pl-2.5 border-l-4 mb-3" style={{ color, borderColor: color }}>
        {displayTitle}
      </h2>
    );
  }
  
  return (
    <h2 className="text-[1.15em] font-bold mb-2" style={{ color }}>
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

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    fontFamily: 'inter',
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
    accentColor: data.templateColor || '#0d9488',
    textColor: '#1f2937',
    bgColor: '#ffffff',
    showIcons: true,
    showDates: true,
    pageBreaks: [],
  };

  const accentColor = customization.accentColor || data.templateColor || '#0d9488';
  const textColor = customization.textColor || '#1f2937';
  const bgColor = customization.bgColor || '#ffffff';
  
  const fontStyle = {
    fontFamily: fontMap[customization.fontFamily] || fontMap.inter,
    fontSize: fontSizeMap[customization.fontSize] || fontSizeMap.sm,
    lineHeight: lineHeightMap[customization.lineHeight] || lineHeightMap.normal,
    padding: paddingMap[customization.pagePadding] || paddingMap.normal,
    color: textColor,
    backgroundColor: bgColor,
  };

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
  const renderSummary = () => {
    if (!data.summary) return null;
    return (
      <section style={sectionStyle} key="summary">
        <SectionHeader title="Professional Summary" color={accentColor} styleType={customization.headingStyle} />
        <p className="text-[0.9em] leading-relaxed">{data.summary}</p>
      </section>
    );
  };

  const renderExperience = () => {
    if (expList.length === 0) return null;
    return (
      <section style={sectionStyle} key="experience">
        <SectionHeader title="Experience" color={accentColor} styleType={customization.headingStyle} />
        <div className="space-y-3">
          {expList.map((exp) => (
            <div key={exp.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-semibold text-[0.95em]">{exp.position || 'Position Title'}</h3>
                {showDates && (exp.startDate || exp.endDate) && (
                  <span className="text-[0.85em] font-medium" style={{ color: accentColor }}>
                    {exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}
                  </span>
                )}
              </div>
              <div className="text-[0.88em] opacity-80 mb-1.5">{exp.company || 'Company Name'}</div>
              {exp.description && (
                <p className="text-[0.85em] whitespace-pre-wrap leading-relaxed opacity-90">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (eduList.length === 0) return null;
    return (
      <section style={sectionStyle} key="education">
        <SectionHeader title="Education" color={accentColor} styleType={customization.headingStyle} />
        <div className="space-y-3">
          {eduList.map((edu) => (
            <div key={edu.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-semibold text-[0.95em]">{edu.degree || 'Degree'}</h3>
                {showDates && (edu.startDate || edu.endDate) && (
                  <span className="text-[0.85em] font-medium" style={{ color: accentColor }}>
                    {edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[0.88em] opacity-80">
                <span>{edu.school || 'School / University'}</span>
                {edu.grade && <span className="font-medium">{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    const hasTechnical = techSkills.some(s => s);
    const hasSoft = softSkills.some(s => s);
    const hasLanguages = langSkills.some(s => s);
    if (!hasTechnical && !hasSoft && !hasLanguages) return null;

    return (
      <section style={sectionStyle} key="skills">
        <SectionHeader title="Skills" color={accentColor} styleType={customization.headingStyle} />
        <div className="text-[0.88em] space-y-1.5">
          {hasTechnical && (
             <div><span className="font-semibold">Technical: </span>{techSkills.filter(s => s).join(', ')}</div>
          )}
          {hasSoft && (
             <div><span className="font-semibold">Soft Skills: </span>{softSkills.filter(s => s).join(', ')}</div>
          )}
          {hasLanguages && (
             <div><span className="font-semibold">Languages: </span>{langSkills.filter(s => s).join(', ')}</div>
          )}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <section style={sectionStyle} key="projects">
        <SectionHeader title="Projects" color={accentColor} styleType={customization.headingStyle} />
        <div className="space-y-3">
          {(data.projects as any[]).map((proj) => (
            <div key={proj.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-semibold text-[0.95em]">{proj.name || 'Project Name'}</h3>
                {proj.githubLink && <span className="text-[0.8em]" style={{ color: accentColor }}>{proj.githubLink}</span>}
              </div>
              {proj.technologies && <div className="text-[0.8em] opacity-70 mb-1">{proj.technologies}</div>}
              {proj.description && <p className="text-[0.85em] leading-relaxed opacity-90">{proj.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    return (
      <section style={sectionStyle} key="certifications">
        <SectionHeader title="Certifications" color={accentColor} styleType={customization.headingStyle} />
        <div className="space-y-2">
          {(data.certifications as any[]).map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline" style={itemStyle}>
              <div className="text-[0.9em]">
                <span className="font-semibold">{cert.name || 'Certificate Name'}</span>
                {cert.organization && <span className="text-[0.85em] opacity-75 ml-2">— {cert.organization}</span>}
              </div>
              {showDates && cert.date && <span className="text-[0.8em] font-medium" style={{ color: accentColor }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary': return renderSummary();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      case 'certifications': return renderCertifications();
      default: return null;
    }
  };

  const renderHeader = () => (
    <header className="border-b-2 pb-4" style={{ borderColor: accentColor, marginBottom: sectionMarginMap[customization.sectionSpacing] || '24px' }}>
      <h1 className="text-[2.2em] font-bold tracking-tight mb-1" style={{ lineHeight: 1.1 }}>{pInfo.fullName || 'YOUR NAME'}</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.88em] opacity-85 mt-2">
        {pInfo.email && <span>{showIcons ? '✉ ' : ''}{pInfo.email}</span>}
        {pInfo.phone && <span>{showIcons ? '☎ ' : '• '}{pInfo.phone}</span>}
        {pInfo.address && <span>{showIcons ? '📍 ' : '• '}{pInfo.address}</span>}
        {pInfo.linkedin && <span>{showIcons ? '💼 ' : '• '}{pInfo.linkedin}</span>}
        {pInfo.github && <span>{showIcons ? '⌨ ' : '• '}{pInfo.github}</span>}
        {pInfo.portfolio && <span>{showIcons ? '🌐 ' : '• '}{pInfo.portfolio}</span>}
      </div>
    </header>
  );

  const orderList = customization.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
  const sidebarList = customization.sidebarSections || ['skills', 'certifications'];
  const mainList = customization.mainSections || ['summary', 'experience', 'education', 'projects'];
  const colRatio = customization.columnRatio || '1/3-2/3';

  const pageChunks = groupSectionsIntoPages(orderList, pageBreaks);
  const pageDim = getPageCardDimensions(customization.pageSize, customization.customPageSize);

  return (
    <div id="resume-preview" className="w-full space-y-8">
      {pageChunks.map((chunk, pageIndex) => (
        <div
          key={pageIndex}
          className={`w-full bg-white shadow-2xl rounded-sm p-8 border border-gray-200 relative transition-all duration-300 ${pageIndex > 0 ? 'page-break-before' : ''}`}
          style={{
            ...fontStyle,
            minHeight: pageDim.minHeight,
            aspectRatio: pageDim.aspectRatio,
          }}
        >
          {/* Page Badge indicator */}
          <div className="absolute top-3 right-4 px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-700 rounded text-[10px] font-bold uppercase tracking-wider select-none print:hidden shadow-xs flex items-center gap-1.5">
            <span>📄 Page {pageIndex + 1} of {pageChunks.length}</span>
            <span className="opacity-40">•</span>
            <span className="font-mono text-teal-900">{pageDim.label}</span>
          </div>

          {/* Header on Page 1 */}
          {pageIndex === 0 && renderHeader()}

          {/* Page Content */}
          {customization.layout === '2-column' && pageIndex === 0 ? (
            <div className={`grid gap-6 ${colRatio === '1/2-1/2' ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {colRatio === '2/3-1/3' ? (
                <>
                  <div className="col-span-2 space-y-1">
                    {mainList.map(id => renderSection(id))}
                  </div>
                  <div className="col-span-1 space-y-1">
                    {sidebarList.map(id => renderSection(id))}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-1 space-y-1">
                    {sidebarList.map(id => renderSection(id))}
                  </div>
                  <div className={`${colRatio === '1/2-1/2' ? 'col-span-1' : 'col-span-2'} space-y-1`}>
                    {mainList.map(id => renderSection(id))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {chunk.map(id => renderSection(id))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModernTemplate;
