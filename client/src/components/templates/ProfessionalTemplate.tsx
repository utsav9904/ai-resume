import type { ResumeState } from '../../store/useResumeStore';

interface TemplateProps {
  data: ResumeState;
}

const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const color = data.templateColor || '#1e3a8a'; // Default dark blue

  return (
    <div className="w-full h-full bg-white flex font-sans text-gray-800" id="resume-preview">
      {/* Sidebar */}
      <aside className="w-1/3 text-white p-6" style={{ backgroundColor: color }}>
        <h1 className="text-2xl font-bold tracking-tight mb-1">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        
        <div className="text-sm mt-6 space-y-3 opacity-90">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-100 border-b border-white/30 pb-1">Contact</h2>
          {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
          {data.personalInfo.linkedin && <div className="break-all">{data.personalInfo.linkedin}</div>}
          {data.personalInfo.github && <div className="break-all">{data.personalInfo.github}</div>}
          {data.personalInfo.portfolio && <div className="break-all">{data.personalInfo.portfolio}</div>}
        </div>

        {/* Skills */}
        {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0) && (
          <div className="text-sm mt-8 space-y-4 opacity-90">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-100 border-b border-white/30 pb-1">Skills</h2>
            {data.skills.technical.some(s => s) && (
              <div>
                <div className="font-semibold mb-1">Technical</div>
                <div className="flex flex-wrap gap-1">
                  {data.skills.technical.filter(s => s).map((s, i) => (
                    <span key={i} className="bg-white/20 px-2 py-0.5 rounded text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {data.skills.soft.some(s => s) && (
              <div>
                <div className="font-semibold mb-1">Soft Skills</div>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {data.skills.soft.filter(s => s).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {data.skills.languages.some(s => s) && (
              <div>
                <div className="font-semibold mb-1">Languages</div>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {data.skills.languages.filter(s => s).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-6 bg-white">
        {/* Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: color, color }}>Profile</h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: color, color }}>Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Position'}</h3>
                    <span className="text-xs font-semibold" style={{ color }}>
                      {exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{exp.company || 'Company'}</div>
                  {exp.description && (
                    <p className="text-xs whitespace-pre-wrap leading-relaxed text-gray-600 pl-3 border-l-2 border-gray-200">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: color, color }}>Education</h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree || 'Degree'}</h3>
                    <span className="text-xs font-semibold" style={{ color }}>
                      {edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-700 mt-1">
                    <span>{edu.school || 'School'}</span>
                    {edu.grade && <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">{edu.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProfessionalTemplate;
