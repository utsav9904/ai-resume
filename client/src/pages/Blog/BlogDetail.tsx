import { Link, useParams } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { posts, categoryColors } from './blogData';

const BlogDetail = () => {
  const { slug } = useParams();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-gray-900 font-semibold">
            <Sparkles size={16} className="text-teal-600" /> ResumeAI
          </Link>
        </nav>
        <main className="pt-28 px-6 flex-grow flex items-center justify-center">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article not found</h1>
            <p className="text-gray-500 mb-8">The requested blog post could not be found. Please return to the blog page and choose a different article.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700 transition">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-gray-900 font-semibold">
          <Sparkles size={16} className="text-teal-600" /> ResumeAI
        </Link>
        <Link to="/blog" className="text-sm text-gray-600 hover:text-teal-600 transition">Back to Blog</Link>
      </nav>

      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
            {post.category}
          </span>
        </div>
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-gray-500 text-lg max-w-3xl">{post.excerpt}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100 pt-6 text-sm text-gray-500">
            <div>{post.author}</div>
            <div>{post.date} · {post.readTime}</div>
          </div>

          <section className="mt-10 space-y-8 text-gray-700 leading-relaxed">
            <p>Welcome to the ResumeAI blog. This article is a placeholder for the full published content. Add your full blog post copy here to provide visitors with helpful career advice and showcase the product value.</p>
            <h2 className="text-2xl font-semibold text-gray-900">Why this matters</h2>
            <p>Explain how AI resume building helps job seekers, why ATS-friendly formatting is important, and how a guided workflow can save time during the job search.</p>
            <h3 className="text-xl font-semibold text-gray-900">What to include</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Problem statement and why traditional resumes fail.</li>
              <li>How your AI features solve those problems.</li>
              <li>Examples, statistics, or user outcomes.</li>
            </ul>
            <p>Finish with a strong call to action, such as encouraging readers to register and build their own resume with AI.</p>
          </section>

          <div className="mt-12 flex flex-col sm:flex-row sm:justify-between gap-4">
            <Link to="/blog" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-semibold transition">
              Start Building Your Resume
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;
