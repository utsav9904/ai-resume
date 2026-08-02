import type { ResumeState } from '../../store/useResumeStore';
import React from 'react';
import { getPageCardDimensions } from '../../utils/pageSizeUtils';

interface TemplateProps {
  data: ResumeState;
}

const AcademicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const customization = data.customization || {
    pageSize: 'a4',
    showDates: true,
  };

  const showDates = customization.showDates !== false;
  const pageDim = getPageCardDimensions(customization.pageSize, customization.customPageSize);
  const { personalInfo } = data;

  const allSkills = [
    ...(data.skills?.technical || []),
    ...(data.skills?.soft || []),
    ...(data.skills?.languages || [])
  ];

  return (
    <div id="resume-preview" className="w-full space-y-8 font-serif">
      <div
        className="w-full bg-white shadow-2xl rounded-sm p-10 border border-gray-300 relative text-gray-900 leading-relaxed text-sm"
        style={{
          minHeight: pageDim.minHeight,
          aspectRatio: pageDim.aspectRatio,
        }}
      >
        {/* Header */}
        <header className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-black mb-1">
            {personalInfo?.fullName || 'Academic Curriculum Vitae'}
          </h1>
          <div className="text-xs text-gray-700 space-x-3 font-sans mt-2">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo?.address && <span>• {personalInfo.address}</span>}
            {personalInfo?.portfolio && <span>• {personalInfo.portfolio}</span>}
            {personalInfo?.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              Research Profile & Summary
            </h2>
            <p className="text-xs text-gray-800 text-justify leading-normal">
              {data.summary}
            </p>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              Education & Academic Credentials
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-black">
                    <span>{edu.school}</span>
                    {showDates && <span>{edu.startDate} – {edu.endDate}</span>}
                  </div>
                  <div className="italic text-gray-800">
                    {edu.degree}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              Academic & Professional Appointments
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-black">
                    <span>{exp.position}, <span className="font-normal italic">{exp.company}</span></span>
                    {showDates && <span>{exp.startDate} – {exp.endDate}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-gray-800 text-justify mt-1 whitespace-pre-line leading-relaxed pl-3 border-l border-gray-300">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Publications */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              Publications & Key Research Projects
            </h2>
            <div className="space-y-3 text-xs">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <span className="font-bold text-black">"{proj.name}"</span>
                  {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-blue-800 underline ml-1">[Link]</a>}
                  {proj.description && <p className="text-gray-800 text-justify mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {allSkills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              Areas of Expertise & Methodologies
            </h2>
            <p className="text-xs text-gray-800 font-sans">
              {allSkills.join(' • ')}
            </p>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              Honors, Awards & Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <span><strong className="text-black">{cert.name}</strong> — {cert.organization}</span>
                  {cert.date && <span className="font-mono text-gray-600">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AcademicTemplate;
