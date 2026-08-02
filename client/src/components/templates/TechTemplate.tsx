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

const TechTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    fontFamily: 'fira-code',
    accentColor: data.templateColor || '#0284c7',
    showDates: true,
    pageBreaks: [],
  };

  const accentColor = customization.accentColor || data.templateColor || '#0284c7';
  const pageBreaks = customization.pageBreaks || [];
  const showDates = customization.showDates !== false;

  const fontStyle = {
    fontFamily: fontMap[customization.fontFamily] || fontMap['fira-code'],
    fontSize: '13px',
    color: '#0f172a',
  };

  const SectionHeader: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
      <span className="font-mono text-sm font-bold" style={{ color: accentColor }}>{icon}</span>
      <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
        {title}
      </h2>
    </div>
  );

  const renderHeader = () => {
    const { personalInfo } = data;
    return (
      <header className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-sky-600 mb-1" style={{ color: accentColor }}>
              // DEVELOPER PROFILE
            </div>
            <h1 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {personalInfo?.fullName || 'Dev Name'}
            </h1>
          </div>
          <div className="font-mono text-xs space-y-1 text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
            {personalInfo?.email && <div><span className="text-slate-400">email:</span> "{personalInfo.email}"</div>}
            {personalInfo?.phone && <div><span className="text-slate-400">phone:</span> "{personalInfo.phone}"</div>}
            {personalInfo?.address && <div><span className="text-slate-400">location:</span> "{personalInfo.address}"</div>}
            {personalInfo?.github && <div><span className="text-slate-400">github:</span> "{personalInfo.github}"</div>}
            {personalInfo?.portfolio && <div><span className="text-slate-400">site:</span> "{personalInfo.portfolio}"</div>}
          </div>
        </div>
      </header>
    );
  };

  const renderSummary = () => {
    if (!data.summary) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Bio / Summary" icon="const bio =" />
        <p className="font-sans text-xs leading-relaxed text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-100">
          "{data.summary}"
        </p>
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
        <SectionHeader title="Tech Stack & Tools" icon="import { skills }" />
        <div className="flex flex-wrap gap-1.5 font-mono">
          {allSkills.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-100 border"
              style={{ borderColor: accentColor }}
            >
              <span style={{ color: accentColor }}>#</span>{skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Engineering Experience" icon="function Experience()" />
        <div className="space-y-4 font-sans">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <div className="flex justify-between items-baseline flex-wrap font-mono mb-1">
                <span className="font-bold text-sm text-slate-900">{exp.position}</span>
                {showDates && (
                  <span className="text-[11px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-100">
                    [{exp.startDate} → {exp.endDate}]
                  </span>
                )}
              </div>
              <div className="text-xs font-mono font-bold mb-2" style={{ color: accentColor }}>
                @{exp.company}
              </div>
              {exp.description && (
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <div className="mb-5">
        <SectionHeader title="Projects & Repos" icon="git clone" />
        <div className="grid grid-cols-1 gap-3 font-sans">
          {data.projects.map((proj) => (
            <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-baseline font-mono">
                <span className="font-bold text-xs text-slate-900">🚀 {proj.name}</span>
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[11px] font-bold underline" style={{ color: accentColor }}>
                    [repo ↗]
                  </a>
                )}
              </div>
              {proj.description && <p className="text-xs text-slate-600 mt-1">{proj.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!data.education || data.education.length === 0) return null;
    return (
      <div className="mb-5 font-mono">
        <SectionHeader title="Education" icon="class Education" />
        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">{edu.degree} — <span className="font-normal text-slate-600">{edu.school}</span></span>
              {showDates && <span className="text-slate-500">{edu.startDate} - {edu.endDate}</span>}
            </div>
          ))}
        </div>
      </div>
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
          className="w-full bg-white shadow-2xl rounded-sm p-8 border border-slate-300 relative transition-all duration-300"
          style={{
            ...fontStyle,
            minHeight: pageDim.minHeight,
            aspectRatio: pageDim.aspectRatio,
          }}
        >
          <div className="absolute top-3 right-4 px-2 py-0.5 bg-slate-900 text-sky-400 rounded font-mono text-[10px] font-bold select-none print:hidden flex items-center gap-1">
            <span>⚡ Tech Theme · P{pageIndex + 1}</span>
          </div>

          {pageIndex === 0 && renderHeader()}
          {renderSkills()}
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
        </div>
      ))}
    </div>
  );
};

export default TechTemplate;
