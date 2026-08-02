import type { ResumeState } from '../../store/useResumeStore';
import React from 'react';
import { getPageCardDimensions } from '../../utils/pageSizeUtils';

interface TemplateProps {
  data: ResumeState;
}

const CompactTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    accentColor: data.templateColor || '#334155',
    pageSize: 'a4',
    showDates: true,
  };

  const accentColor = customization.accentColor || data.templateColor || '#334155';
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
        className="w-full bg-white shadow-2xl rounded-sm p-6 border border-slate-300 relative text-slate-800 text-[12px] leading-snug"
        style={{
          minHeight: pageDim.minHeight,
          aspectRatio: pageDim.aspectRatio,
        }}
      >
        {/* Compact Header */}
        <header className="border-b-2 pb-3 mb-4" style={{ borderColor: accentColor }}>
          <div className="flex justify-between items-baseline">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {personalInfo?.fullName || 'Your Name'}
            </h1>
          </div>
          <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-600 mt-1 font-medium">
            {personalInfo?.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo?.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo?.address && <span>📍 {personalInfo.address}</span>}
            {personalInfo?.portfolio && <span>🌐 {personalInfo.portfolio}</span>}
            {personalInfo?.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* 2-Column Compact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main Column (2/3) */}
          <div className="md:col-span-2 space-y-4">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-2" style={{ borderColor: accentColor }}>
                  Professional Experience
                </h2>
                <div className="space-y-3">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{exp.position}</span>
                        {showDates && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mb-0.5">{exp.company}</div>
                      {exp.description && (
                        <p className="text-[11px] text-slate-700 whitespace-pre-line leading-tight">
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
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-2" style={{ borderColor: accentColor }}>
                  Projects & Highlights
                </h2>
                <div className="space-y-2">
                  {data.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">{proj.name}</span>
                        {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[10px] underline text-blue-700 font-mono">Link ↗</a>}
                      </div>
                      {proj.description && <p className="text-[10px] text-slate-600">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column (1/3) */}
          <div className="space-y-4">
            {/* Summary */}
            {data.summary && (
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5" style={{ borderColor: accentColor }}>
                  Summary
                </h2>
                <p className="text-[10px] text-slate-700 leading-normal">
                  {data.summary}
                </p>
              </section>
            )}

            {/* Skills */}
            {allSkills.length > 0 && (
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5" style={{ borderColor: accentColor }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1">
                  {allSkills.map((s, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5" style={{ borderColor: accentColor }}>
                  Education
                </h2>
                <div className="space-y-1.5">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="text-[10px]">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-600">{edu.school}</div>
                      {showDates && <div className="text-slate-400 font-mono">{edu.startDate} - {edu.endDate}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5" style={{ borderColor: accentColor }}>
                  Certifications
                </h2>
                <div className="space-y-1 text-[10px]">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="text-slate-800">
                      <div className="font-bold">{cert.name}</div>
                      <div className="text-slate-500">{cert.organization}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactTemplate;
