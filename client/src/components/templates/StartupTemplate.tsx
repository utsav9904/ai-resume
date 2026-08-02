import type { ResumeState } from '../../store/useResumeStore';
import React from 'react';
import { getPageCardDimensions } from '../../utils/pageSizeUtils';

interface TemplateProps {
  data: ResumeState;
}

const StartupTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    accentColor: data.templateColor || '#6366f1',
    pageSize: 'a4',
    showDates: true,
  };

  const accentColor = customization.accentColor || data.templateColor || '#6366f1';
  const showDates = customization.showDates !== false;
  const pageDim = getPageCardDimensions(customization.pageSize, customization.customPageSize);
  const { personalInfo } = data;

  const allSkills = [
    ...(data.skills?.technical || []),
    ...(data.skills?.soft || []),
    ...(data.skills?.languages || [])
  ];

  return (
    <div id="resume-preview" className="w-full space-y-8 font-sans">
      <div
        className="w-full bg-white shadow-2xl rounded-2xl p-8 border border-indigo-100 relative text-gray-800 text-sm"
        style={{
          minHeight: pageDim.minHeight,
          aspectRatio: pageDim.aspectRatio,
        }}
      >
        {/* Startup Header Card */}
        <header className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/30 border border-indigo-100/80">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {personalInfo?.fullName || 'Your Name'}
              </h1>
            </div>
            <div className="text-xs font-medium space-y-1 text-gray-600 text-right">
              {personalInfo?.email && <div>✉ {personalInfo.email}</div>}
              {personalInfo?.phone && <div>📞 {personalInfo.phone}</div>}
              {personalInfo?.address && <div>📍 {personalInfo.address}</div>}
              {personalInfo?.portfolio && <div>🌐 {personalInfo.portfolio}</div>}
              {personalInfo?.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
            </div>
          </div>
        </header>

        {/* Bio summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              🚀 Overview
            </h2>
            <p className="text-xs leading-relaxed text-gray-600 p-4 rounded-xl bg-gray-50 border border-gray-100">
              {data.summary}
            </p>
          </section>
        )}

        {/* Skills pill tags */}
        {allSkills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              ⚡ Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 rounded-full border shadow-xs"
                  style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}40`, color: accentColor }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2" style={{ color: accentColor }}>
              💼 Work History
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 transition shadow-2xs">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-sm text-gray-900">{exp.position}</span>
                    {showDates && (
                      <span className="text-[11px] font-semibold text-gray-400 font-mono">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-indigo-600 mb-2" style={{ color: accentColor }}>
                    {exp.company}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2" style={{ color: accentColor }}>
              💡 Ventures & Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="font-bold text-xs text-gray-900 flex justify-between">
                    <span>{proj.name}</span>
                    {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-indigo-600 underline text-[11px]">Link ↗</a>}
                  </div>
                  {proj.description && <p className="text-[11px] text-gray-500 mt-1">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-2" style={{ color: accentColor }}>
              🎓 Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between text-xs">
                  <span className="font-bold text-gray-900">{edu.degree} — <span className="font-normal text-gray-600">{edu.school}</span></span>
                  {showDates && <span className="text-gray-400 font-mono">{edu.startDate} - {edu.endDate}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StartupTemplate;
