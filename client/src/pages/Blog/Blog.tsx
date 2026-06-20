import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Clock, User } from 'lucide-react';

const posts = [
  {
    slug: 'how-to-beat-ats',
    title: 'How to Beat ATS and Get Your Resume to Human Eyes in 2025',
    excerpt: 'Applicant Tracking Systems reject up to 75% of resumes before a human ever sees them. Learn the exact formatting tricks, keyword strategies, and layout choices that guarantee your resume gets through.',
    category: 'Resume Tips',
    readTime: '6 min read',
    date: 'June 18, 2026',
    author: 'ResumeAI Team',
  },
  {
    slug: 'ai-resume-writing',
    title: 'How AI is Changing the Way We Write Resumes',
    excerpt: 'From AI-generated summaries to real-time job tailoring, artificial intelligence is transforming the job hunt. Here\'s how to use AI tools to write a resume that stands out — without sounding robotic.',
    category: 'AI & Careers',
    readTime: '5 min read',
    date: 'June 15, 2026',
    author: 'ResumeAI Team',
  },
  {
    slug: 'cover-letter-tips',
    title: '7 Cover Letter Mistakes That Are Killing Your Job Applications',
    excerpt: 'A great resume gets you noticed. A great cover letter gets you interviewed. Discover the 7 most common cover letter mistakes and how to fix them — including how AI can do the heavy lifting for you.',
    category: 'Cover Letters',
    readTime: '7 min read',
    date: 'June 12, 2026',
    author: 'ResumeAI Team',
  },
  {
    slug: 'resume-skills-section',
    title: 'The Skills Section Recruiters Actually Want to See (With Examples)',
    excerpt: 'Your skills section is prime real estate. Recruiters spend just 6 seconds on a resume — make sure your skills section grabs attention and matches the job description perfectly.',
    category: 'Resume Tips',
    readTime: '4 min read',
    date: 'June 10, 2026',
    author: 'ResumeAI Team',
  },
  {
    slug: 'job-tailoring-guide',
    title: 'Why You Should Never Send the Same Resume Twice',
    excerpt: 'Customizing your resume for every job application increases your interview rate by up to 40%. Here\'s the step-by-step process to tailor your resume quickly — and how AI makes it effortless.',
    category: 'Job Search',
    readTime: '5 min read',
    date: 'June 8, 2026',
    author: 'ResumeAI Team',
  },
  {
    slug: 'resume-formats-2025',
    title: 'Chronological vs Functional vs Hybrid: Which Resume Format Is Right for You?',
    excerpt: 'The format of your resume matters as much as the content. Find out which of the three main formats fits your career stage and experience level — with real examples from each.',
    category: 'Resume Tips',
    readTime: '6 min read',
    date: 'June 5, 2026',
    author: 'ResumeAI Team',
  },
];

const categories = ['All', 'Resume Tips', 'AI & Careers', 'Cover Letters', 'Job Search'];

const categoryColors: Record<string, string> = {
  'Resume Tips': 'bg-teal-100 text-teal-700',
  'AI & Careers': 'bg-purple-100 text-purple-700',
  'Cover Letters': 'bg-blue-100 text-blue-700',
  'Job Search': 'bg-orange-100 text-orange-700',
};

const Blog = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">ResumeAI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Log in</Link>
          <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            📝 Career Advice & Resume Tips
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">ResumeAI Blog</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Expert career advice, resume writing tips, and AI productivity guides — written to help you land your next job faster.
          </p>
        </div>
      </section>

      {/* Category Filter (decorative — no filter logic for SEO static blog) */}
      <div className="max-w-5xl mx-auto px-6 mb-8 flex gap-2 flex-wrap justify-center">
        {categories.map(cat => (
          <span key={cat} className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer border ${cat === 'All' ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700'} transition`}>
            {cat}
          </span>
        ))}
      </div>

      {/* Posts Grid */}
      <main className="max-w-5xl mx-auto px-6 pb-24 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all duration-200 flex flex-col">
              {/* Color bar */}
              <div className="h-1.5 bg-gradient-to-r from-teal-500 to-teal-600" />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 leading-snug mb-2 text-base flex-1">{post.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
              </div>
              {/* Read More link (full URL for SEO) */}
              <div className="px-6 pb-5">
                <Link
                  to={`/blog/${post.slug}`}
                  className="w-full flex items-center justify-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-semibold hover:underline transition"
                >
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-10 text-center text-white">
          <Sparkles size={32} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Ready to build your resume?</h2>
          <p className="text-teal-100 mb-6">Use AI to create an ATS-optimized resume in under 10 minutes.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition">
            Start for Free <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link to="/" className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-teal-600 rounded flex items-center justify-center">
            <Sparkles size={10} className="text-white" />
          </div>
          <span className="font-semibold text-gray-700">ResumeAI</span>
        </Link>
        <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Link to="/" className="hover:text-teal-600 transition">Home</Link>
          <Link to="/blog" className="hover:text-teal-600 transition">Blog</Link>
          <Link to="/register" className="hover:text-teal-600 transition">Get Started</Link>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
