import { Link } from 'react-router-dom';
import { Sparkles, Shield, Target, ArrowRight, Zap, Star, Mail } from 'lucide-react';

const features = [
  {
    title: 'AI Resume Reviewer',
    desc: 'Receive feedback on strengths, weaknesses, measurable achievements, and writing quality.',
    icon: <Sparkles size={24} className="text-teal-600" />,
  },
  {
    title: 'ATS Compatibility Checker',
    desc: 'Analyze keyword matching, formatting issues, and resume compatibility with applicant tracking systems.',
    icon: <Shield size={24} className="text-teal-600" />,
  },
  {
    title: 'Job Description Analyzer',
    desc: 'Compare your resume against a job posting and highlight missing skills, keywords, and improvement opportunities.',
    icon: <Target size={24} className="text-teal-600" />,
  },
  {
    title: 'AI Cover Letter Generator',
    desc: 'Generate tailored cover letters for roles at Google, Amazon, Microsoft, startups, and more.',
    icon: <Mail size={24} className="text-teal-600" />,
  },
  {
    title: 'AI Project Description Generator',
    desc: 'Turn short project inputs into polished bullets that showcase technical impact and results.',
    icon: <Zap size={24} className="text-teal-600" />,
  },
  {
    title: 'AI Career Copilot',
    desc: 'Review your resume, suggest skills, prepare interview questions, and generate job-targeted content from one assistant.',
    icon: <Star size={24} className="text-teal-600" />,
  },
];

const FutureFeatures = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 py-6 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-teal-600 font-semibold">Future Roadmap</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">AI Career Features Coming Soon</h1>
            <p className="mt-4 max-w-2xl text-base text-gray-600">These features are not currently live on the website yet, but they are the next major additions that will make ResumeAI a differentiated AI career platform.</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-teal-600 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-100 transition">
            Back to Home <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <section className="grid gap-6 lg:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <div className="inline-flex items-center justify-center rounded-3xl bg-teal-50 p-3 mb-5">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{feature.desc}</p>
              <div className="inline-flex items-center gap-2 text-teal-600 font-medium">
                <span>Coming soon</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-[2rem] border border-teal-100 bg-teal-50 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">Roadmap update</p>
              <h3 className="mt-3 text-3xl font-bold text-teal-900">Building an AI career copilot, not just a resume builder.</h3>
              <p className="mt-4 max-w-2xl text-gray-700">Next we’ll add the ability to review resumes, compare them to job descriptions, analyze ATS compatibility, and generate tailored career content from one unified assistant.</p>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>Priority features:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>AI Resume Reviewer</li>
                <li>ATS Compatibility Checker</li>
                <li>Job Description Analyzer</li>
                <li>AI Cover Letter Generator</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FutureFeatures;
