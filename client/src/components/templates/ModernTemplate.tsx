import type { ResumeState } from '../../store/useResumeStore';

interface TemplateProps {
  data: ResumeState;
}

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const color = data.templateColor || '#0d9488'; // Default teal

  return (
    <div className="w-full h-full bg-white p-8 font-sans text-gray-800" id="resume-preview">
      {/* Header */}
      <header className="border-b-2 pb-4 mb-6" style={{ borderColor: color }}>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>• {data.personalInfo.address}</span>}
          {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
          {data.personalInfo.github && <span>• {data.personalInfo.github}</span>}
          {data.personalInfo.portfolio && <span>• {data.personalInfo.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.position || 'Position Title'}</h3>
                  <span className="text-sm font-medium" style={{ color }}>
                    {exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{exp.company || 'Company Name'}</div>
                {exp.description && (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                  <span className="text-sm font-medium" style={{ color }}>
                    {edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{edu.school || 'School / University'}</span>
                  {edu.grade && <span className="font-medium text-gray-500">{edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Skills</h2>
          <div className="text-sm text-gray-700 space-y-2">
            {data.skills.technical.some(s => s) && (
               <div><span className="font-semibold text-gray-900">Technical: </span>{data.skills.technical.filter(s => s).join(', ')}</div>
            )}
            {data.skills.soft.some(s => s) && (
               <div><span className="font-semibold text-gray-900">Soft Skills: </span>{data.skills.soft.filter(s => s).join(', ')}</div>
            )}
            {data.skills.languages.some(s => s) && (
               <div><span className="font-semibold text-gray-900">Languages: </span>{data.skills.languages.filter(s => s).join(', ')}</div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Projects</h2>
          <div className="space-y-3">
            {(data.projects as any[]).map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold text-gray-900">{proj.name || 'Project Name'}</h3>
                  {proj.githubLink && <span className="text-xs" style={{ color }}>{proj.githubLink}</span>}
                </div>
                {proj.technologies && <div className="text-xs text-gray-500 mb-1">{proj.technologies}</div>}
                {proj.description && <p className="text-sm leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Certifications</h2>
          <div className="space-y-2">
            {(data.certifications as any[]).map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-sm">{cert.name || 'Certificate Name'}</span>
                  {cert.organization && <span className="text-xs text-gray-500 ml-2">— {cert.organization}</span>}
                </div>
                {cert.date && <span className="text-xs font-medium" style={{ color }}>{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;
