import type { ResumeState } from '../../store/useResumeStore';

interface TemplateProps {
  data: ResumeState;
}

const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
  const color = data.templateColor || '#000000'; // Default black

  return (
    <div className="w-full h-full bg-white p-10 font-serif text-gray-800" id="resume-preview">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-widest uppercase text-gray-900 mb-2" style={{ color }}>
          {data.personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-500 uppercase tracking-wide">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>| {data.personalInfo.address}</span>}
          {data.personalInfo.linkedin && <span>| {data.personalInfo.linkedin}</span>}
          {data.personalInfo.github && <span>| {data.personalInfo.github}</span>}
          {data.personalInfo.portfolio && <span>| {data.personalInfo.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3" style={{ color }}>Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900 text-sm">{exp.position || 'Position'} <span className="font-normal text-gray-600">at {exp.company || 'Company'}</span></h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs whitespace-pre-wrap leading-relaxed text-gray-600">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3" style={{ color }}>Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900 text-sm">{edu.degree || 'Degree'}</h3>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{edu.school || 'School'}</span>
                  {edu.grade && <span>{edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0) && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3" style={{ color }}>Skills</h2>
          <div className="text-xs text-gray-700 space-y-1">
            {data.skills.technical.some(s => s) && (
               <div><span className="font-medium">Technical: </span>{data.skills.technical.filter(s => s).join(', ')}</div>
            )}
            {data.skills.soft.some(s => s) && (
               <div><span className="font-medium">Soft: </span>{data.skills.soft.filter(s => s).join(', ')}</div>
            )}
            {data.skills.languages.some(s => s) && (
               <div><span className="font-medium">Languages: </span>{data.skills.languages.filter(s => s).join(', ')}</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalistTemplate;
