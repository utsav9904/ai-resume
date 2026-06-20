import { Link } from 'react-router-dom';
import { Sparkles, FileText, Download, Zap, Shield, Palette, ArrowRight, CheckCircle, Star } from 'lucide-react';

const Landing = () => {
  const features = [
    { icon: <Sparkles size={24} />, title: 'AI-Powered Writing', desc: 'Generate professional summaries, improve bullet points, and get skill suggestions powered by OpenAI.' },
    { icon: <Palette size={24} />, title: '3 Premium Templates', desc: 'Choose from Modern, Minimalist, or Professional templates. Customize accent colors to match your style.' },
    { icon: <FileText size={24} />, title: 'Cover Letter Generator', desc: 'Paste any job description and AI instantly generates a tailored, persuasive cover letter for that role.' },
    { icon: <Zap size={24} />, title: 'Job Tailoring', desc: 'Analyze your resume against a job posting. Get specific keyword suggestions to beat ATS filters.' },
    { icon: <Download size={24} />, title: 'PDF Export', desc: 'Download your perfectly formatted resume as a high-quality PDF, ready to send to any employer.' },
    { icon: <Shield size={24} />, title: 'Secure & Private', desc: 'Your data is secured with JWT authentication and stored safely on MongoDB. Your resumes are always private.' },
  ];

  const steps = [
    { num: '01', title: 'Create Your Account', desc: 'Sign up for free in seconds. No credit card required.' },
    { num: '02', title: 'Fill in Your Details', desc: 'Add your experience, education, skills, and projects in our intuitive builder.' },
    { num: '03', title: 'Let AI Enhance It', desc: 'Use our AI tools to write powerful summaries and tailor it to any job description.' },
    { num: '04', title: 'Download & Apply', desc: 'Export as PDF and start applying to your dream jobs with confidence.' },
  ];

  const testimonials = [
    { name: 'Priya S.', role: 'Software Engineer', text: 'Got 3 interviews in the first week after using ResumeAI to tailor my resume. The AI suggestions were spot on!', rating: 5 },
    { name: 'Arjun M.', role: 'Product Manager', text: 'The cover letter generator saved me hours. The AI perfectly matched my experience to the job requirements.', rating: 5 },
    { name: 'Fatima K.', role: 'Data Analyst', text: 'Clean templates and incredibly easy to use. Best resume builder I\'ve tried — and I\'ve tried many!', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">ResumeAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/blog" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition">Blog</Link>
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Log in</Link>
          <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition shadow-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40 -translate-x-1/2" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40 translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles size={14} /> AI-Powered Resume Builder
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Build Resumes That<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">
              Get You Hired
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create ATS-optimized resumes with AI assistance. Generate professional summaries, tailor your resume to any job, and download as PDF in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition shadow-xl shadow-teal-600/25">
              Start Building for Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:border-teal-300 hover:text-teal-700 px-8 py-4 rounded-2xl font-bold text-lg transition">
              Sign In
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-400">No credit card required · Free forever</p>
        </div>

        {/* Hero visual */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex gap-4">
              {/* Sidebar mock */}
              <div className="w-44 bg-white rounded-xl border border-gray-100 p-4 space-y-2 hidden sm:block flex-shrink-0">
                {['Personal Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'].map(item => (
                  <div key={item} className={`text-xs font-medium py-2 px-3 rounded-lg ${item === 'Experience' ? 'bg-teal-50 text-teal-700' : 'text-gray-500'}`}>{item}</div>
                ))}
              </div>
              {/* Form mock */}
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-100 rounded-lg w-3/4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-8 bg-gray-100 rounded-lg" />
                  <div className="h-8 bg-gray-100 rounded-lg" />
                </div>
                <div className="h-24 bg-gray-100 rounded-lg" />
                <div className="flex gap-2">
                  <div className="h-8 bg-purple-100 rounded-lg w-36 flex items-center justify-center">
                    <span className="text-xs text-purple-600 font-semibold">✨ AI Improve</span>
                  </div>
                </div>
              </div>
              {/* Preview mock */}
              <div className="w-52 bg-white rounded-xl border border-gray-200 p-4 hidden lg:block flex-shrink-0">
                <div className="h-3 bg-teal-500 rounded w-full mb-2" />
                <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-2 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-1.5 bg-teal-400 rounded w-1/2 mb-2 opacity-60" />
                <div className="h-1.5 bg-gray-200 rounded w-full mb-1" />
                <div className="h-1.5 bg-gray-200 rounded w-5/6 mb-1" />
                <div className="h-1.5 bg-gray-200 rounded w-4/6 mb-3" />
                <div className="h-1.5 bg-teal-400 rounded w-1/2 mb-2 opacity-60" />
                <div className="h-1.5 bg-gray-200 rounded w-full mb-1" />
                <div className="h-1.5 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to land your next job</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Professional tools powered by AI, designed to help you stand out from the competition.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-200 group">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500 text-lg">From sign-up to job application in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-teal-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by job seekers</h2>
            <p className="text-teal-100 text-lg">Join thousands of professionals who landed their dream jobs with ResumeAI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-teal-200 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">Ready to get hired?</h2>
          <p className="text-gray-500 text-lg mb-8">Create your first AI-powered resume in minutes. It's completely free.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition shadow-xl shadow-teal-600/25">
            Build My Resume Now <ArrowRight size={20} />
          </Link>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-teal-500" /> Free to use</div>
            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-teal-500" /> No credit card</div>
            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-teal-500" /> AI-powered</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-teal-600 rounded flex items-center justify-center">
            <Sparkles size={10} className="text-white" />
          </div>
          <span className="font-semibold text-gray-700">ResumeAI</span>
        </div>
        <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Link to="/" className="hover:text-teal-600 transition">Home</Link>
          <Link to="/blog" className="hover:text-teal-600 transition">Blog</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
