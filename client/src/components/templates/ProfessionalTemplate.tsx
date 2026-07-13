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

  // Render Subsections
  const renderSummary = (isSidebar = false) => {
    if (!data.summary) return null;
    return (
      <section style={sectionStyle} key="summary">
        <SectionHeader title={isSidebar ? "Profile" : "Professional Summary"} color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <p className="text-[0.88em] leading-relaxed opacity-95">{data.summary}</p>
      </section>
    );
  };

  const renderExperience = (isSidebar = false) => {
    if (data.experience.length === 0) return null;
    const dateColor = isSidebar ? '#ffffff' : accentColor;
    return (
      <section style={sectionStyle} key="experience">
        <SectionHeader title="Experience" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="space-y-3">
          {data.experience.map((exp) => (
            <div key={exp.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[0.92em]">{exp.position || 'Position'}</h3>
                {showDates && (exp.startDate || exp.endDate) && (
                  <span className="text-[0.8em] font-semibold" style={{ color: dateColor }}>
                    {exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}
                  </span>
                )}
              </div>
              <div className="text-[0.88em] font-medium opacity-85 mb-1">{exp.company || 'Company'}</div>
              {exp.description && (
                <p className="text-[0.82em] whitespace-pre-wrap leading-relaxed opacity-80 pl-2.5 border-l-2 border-gray-200">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = (isSidebar = false) => {
    if (data.education.length === 0) return null;
    const dateColor = isSidebar ? '#ffffff' : accentColor;
    return (
      <section style={sectionStyle} key="education">
        <SectionHeader title="Education" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} style={itemStyle}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[0.92em]">{edu.degree || 'Degree'}</h3>
                {showDates && (edu.startDate || edu.endDate) && (
                  <span className="text-[0.8em] font-semibold" style={{ color: dateColor }}>
                    {edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[0.85em] opacity-85">
                <span>{edu.school || 'School'}</span>
                {edu.grade && <span className="font-medium bg-gray-100/10 px-1.5 py-0.5 rounded">{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = (isSidebar = false) => {
    const hasTechnical = data.skills.technical.some(s => s);
    const hasSoft = data.skills.soft.some(s => s);
    const hasLanguages = data.skills.languages.some(s => s);
    if (!hasTechnical && !hasSoft && !hasLanguages) return null;

    const pillClass = isSidebar 
      ? "bg-white/20 text-white text-[0.78em] px-2 py-0.5 rounded" 
      : "bg-gray-100 text-gray-800 text-[0.8em] px-2.5 py-0.5 rounded border border-gray-200";

    return (
      <section style={sectionStyle} key="skills">
        <SectionHeader title="Skills" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
        <div className="text-[0.85em] space-y-3">
          {hasTechnical && (
            <div>
              <div className="font-semibold mb-1">Technical</div>
              <div className="flex flex-wrap gap-1">
                {data.skills.technical.filter(s => s).map((s, i) => (
                  <span key={i} className={pillClass}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {hasSoft && (
            <div>
              <div className="font-semibold mb-1">Soft Skills</div>
              <ul className="list-disc list-inside text-[0.95em] space-y-0.5 opacity-90">
                {data.skills.soft.filter(s => s).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {hasLanguages && (
            <div>
              <div className="font-semibold mb-1">Languages</div>
              <ul className="list-disc list-inside text-[0.95em] space-y-0.5 opacity-90">
                {data.skills.languages.filter(s => s).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
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
        <SectionHeader title="Projects" color={accentColor} styleType={customization.headingStyle} isSidebar={isSidebar} />
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

  // Render Contact Info Block
  const renderContactInfo = (isSidebar = false) => {
    const wrapperClass = isSidebar ? "space-y-2.5 mt-5" : "flex flex-wrap gap-x-4 gap-y-1 text-[0.85em] opacity-85 mt-2";
    const itemClass = isSidebar ? "break-all" : "";
    return (
      <div className={wrapperClass}>
        {data.personalInfo.email && <div className={itemClass}>{showIcons ? '✉ ' : ''}{data.personalInfo.email}</div>}
        {data.personalInfo.phone && <div className={itemClass}>{showIcons ? '☎ ' : ''}{data.personalInfo.phone}</div>}
        {data.personalInfo.address && <div className={itemClass}>{showIcons ? '📍 ' : ''}{data.personalInfo.address}</div>}
        {data.personalInfo.linkedin && <div className={itemClass}>{showIcons ? '💼 ' : ''}{data.personalInfo.linkedin}</div>}
        {data.personalInfo.github && <div className={itemClass}>{showIcons ? '⌨ ' : ''}{data.personalInfo.github}</div>}
        {data.personalInfo.portfolio && <div className={itemClass}>{showIcons ? '🌐 ' : ''}{data.personalInfo.portfolio}</div>}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex" id="resume-preview" style={fontStyle}>
      {customization.layout === '1-column' ? (
        // 1-column layout
        <div className="w-full flex flex-col" style={{ padding: pagePadding }}>
          <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
            <h1 className="text-[2.2em] font-bold tracking-tight mb-1" style={{ lineHeight: 1.1 }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
            {renderContactInfo(false)}
          </header>
          <div className="space-y-1 flex-grow">
            {orderList.map(id => renderSection(id, false))}
          </div>
        </div>
      ) : (
        // 2-column layout (default signature Professional layout)
        <>
          {/* Sidebar */}
          <aside className={`${sidebarWidth} text-white flex flex-col`} style={{ backgroundColor: accentColor, padding: pagePadding }}>
            <div className="mb-6">
              <h1 className="text-[1.8em] font-bold tracking-tight leading-tight mb-1">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
              <div className="text-[0.7em] font-bold uppercase tracking-wider opacity-75 border-b border-white/20 pb-1.5 mt-4">Contact</div>
              {renderContactInfo(true)}
            </div>
            <div className="space-y-2 flex-grow mt-4">
              {sidebarList.map(id => renderSection(id, true))}
            </div>
          </aside>

          {/* Main Content */}
          <main className={`${mainWidth} flex flex-col bg-white`} style={{ padding: pagePadding }}>
            <div className="space-y-2 flex-grow">
              {mainList.map(id => renderSection(id, false))}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
