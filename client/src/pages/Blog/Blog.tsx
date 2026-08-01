import SEOHead from '../../components/SEOHead';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Clock, User, Menu, X } from 'lucide-react';
import { categories, categoryColors, posts } from './blogData';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans transition-colors duration-200">
      <SEOHead
        title="Resume & Career Tips — ResumeAI Blog"
        description="Expert career advice, ATS optimization strategies, and resume writing guides to help you land your dream job."
        keywords="resume tips, ATS resume guide, cover letter tips, career advice, job search"
      />
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3.5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-xs">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">ResumeAI</span>
        </Link>
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition">Home</Link>
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Log in</Link>
          <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition shadow-xs">
            Get Started Free
          </Link>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-gray-600 hover:text-teal-600 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden pt-16 bg-white flex flex-col p-6 space-y-4 border-b border-gray-200 shadow-xl animate-in slide-in-from-top duration-200">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-teal-600 py-2 border-b border-gray-100">Home</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-teal-600 py-2 border-b border-gray-100">Log in</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-md mt-4">
            Get Started Free
          </Link>
        </div>
      )}

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

      {/* Category Filter */}
      <div className="max-w-5xl mx-auto px-6 mb-8 flex gap-2 flex-wrap justify-center" role="tablist" aria-label="Blog categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${selectedCategory === cat ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700'}`}
            onClick={() => setSelectedCategory(cat)}
            aria-current={selectedCategory === cat ? 'page' : undefined}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <main className="max-w-5xl mx-auto px-6 pb-24 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
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
              {/* Read More link */}
              <div className="px-6 pb-5">
                <Link
                  to={`/blog/${post.slug}`}
                  className="w-full flex items-center justify-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-semibold hover:underline transition"
                  aria-label={`Read full article: ${post.title}`}
                >
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state when no posts match */}
        {filteredPosts.length === 0 && (
          <div className="mt-12 rounded-3xl border border-gray-200 bg-gray-50 p-10 text-center text-gray-600">
            No posts match this category yet. Try another filter or check back soon.
          </div>
        )}

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
