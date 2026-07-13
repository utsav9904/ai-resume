import type { ResumeState } from '../../store/useResumeStore';
import React from 'react';

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
    if (data.experience.length === 0) return null;
    return (
      <section style={sectionStyle} key="experience">
        <SectionHeader title="Experience" color={accentColor} styleType={customization.headingStyle} />
        <div className="space-y-3">
          {data.experience.map((exp) => (
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
    if (data.education.length === 0) return null;
    return (
      <section style={sectionStyle} key="education">
        <SectionHeader title="Education" color={accentColor} styleType={customization.headingStyle} />
        <div className="space-y-3">
          {data.education.map((edu) => (
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
    const hasTechnical = data.skills.technical.some(s => s);
    const hasSoft = data.skills.soft.some(s => s);
    const hasLanguages = data.skills.languages.some(s => s);
    if (!hasTechnical && !hasSoft && !hasLanguages) return null;

    return (
      <section style={sectionStyle} key="skills">
        <SectionHeader title="Skills" color={accentColor} styleType={customization.headingStyle} />
        <div className="text-[0.88em] space-y-1.5">
          {hasTechnical && (
             <div><span className="font-semibold">Technical: </span>{data.skills.technical.filter(s => s).join(', ')}</div>
          )}
          {hasSoft && (
             <div><span className="font-semibold">Soft Skills: </span>{data.skills.soft.filter(s => s).join(', ')}</div>
          )}
          {hasLanguages && (
             <div><span className="font-semibold">Languages: </span>{data.skills.languages.filter(s => s).join(', ')}</div>
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
    const pageBreaks = customization.pageBreaks || [];
    const isPageBreak = pageBreaks.includes(sectionId);
    
    let content = null;
    switch (sectionId) {
      case 'summary': content = renderSummary(); break;
      case 'experience': content = renderExperience(); break;
      case 'education': content = renderEducation(); break;
      case 'skills': content = renderSkills(); break;
      case 'projects': content = renderProjects(); break;
      case 'certifications': content = renderCertifications(); break;
      default: content = null;
    }
    
    if (!content) return null;
    
    return (
      <div key={sectionId} className={isPageBreak ? "page-break-before" : ""}>
        {isPageBreak && (
          <div className="w-full flex items-center gap-2 py-4 my-2 border-t border-dashed border-gray-300 text-gray-400 text-xs select-none print:hidden">
            <span className="font-semibold uppercase tracking-wider text-[0.8em]">Page Break</span>
            <div className="flex-grow border-t border-dashed border-gray-300"></div>
          </div>
        )}
        {content}
      </div>
    );
  };

  const orderList = customization.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
  const sidebarList = customization.sidebarSections || ['skills', 'certifications'];
  const mainList = customization.mainSections || ['summary', 'experience', 'education', 'projects'];
  const colRatio = customization.columnRatio || '1/3-2/3';

  return (
    <div className="w-full h-full" id="resume-preview" style={fontStyle}>
      {/* Header */}
      <header className="border-b-2 pb-4" style={{ borderColor: accentColor, marginBottom: sectionMarginMap[customization.sectionSpacing] || '24px' }}>
        <h1 className="text-[2.2em] font-bold tracking-tight mb-1" style={{ lineHeight: 1.1 }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.88em] opacity-85 mt-2">
          {data.personalInfo.email && <span>{showIcons ? '✉ ' : ''}{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{showIcons ? '☎ ' : '• '}{data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>{showIcons ? '📍 ' : '• '}{data.personalInfo.address}</span>}
          {data.personalInfo.linkedin && <span>{showIcons ? '💼 ' : '• '}{data.personalInfo.linkedin}</span>}
          {data.personalInfo.github && <span>{showIcons ? '⌨ ' : '• '}{data.personalInfo.github}</span>}
          {data.personalInfo.portfolio && <span>{showIcons ? '🌐 ' : '• '}{data.personalInfo.portfolio}</span>}
        </div>
      </header>

      {/* Body Content */}
      {customization.layout === '2-column' ? (
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
          {orderList.map(id => renderSection(id))}
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
