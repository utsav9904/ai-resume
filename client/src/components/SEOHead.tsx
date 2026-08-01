import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

export const SEOHead = ({
  title = 'ResumeAI — Free AI-Powered Resume Builder | Create ATS-Friendly Resumes',
  description = 'Build professional, ATS-optimized resumes in minutes with AI. Get AI-generated summaries, cover letters, and skill suggestions. Choose from 3 premium templates. Free forever.',
  keywords = 'AI resume builder, free resume builder, ATS resume, professional resume, cover letter generator, resume templates, AI career tools, job application, resume maker',
  noIndex = false,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://ai-resume-builder.vercel.app/og-image.png'
}: SEOHeadProps) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or update meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Helper for link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 4. Update Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    
    // Robots tag for indexing vs noindex
    const isAppRoute = location.pathname.startsWith('/builder') || location.pathname.startsWith('/dashboard');
    const shouldNoIndex = noIndex || isAppRoute;
    const robotsContent = shouldNoIndex ? 'noindex, nofollow' : 'index, follow';
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsContent);

    // OpenGraph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);

    // Twitter
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // Canonical
    const currentUrl = canonicalUrl || `https://ai-resume-builder.vercel.app${location.pathname}`;
    setLinkTag('canonical', currentUrl);

  }, [title, description, keywords, noIndex, canonicalUrl, ogType, ogImage, location.pathname]);

  return null;
};

export default SEOHead;
