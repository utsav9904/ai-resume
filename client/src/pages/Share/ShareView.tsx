import SEOHead from '../../components/SEOHead';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { resumeService, type ResumeData } from '../../services/resumeService';
import ModernTemplate from '../../components/templates/ModernTemplate';
import MinimalistTemplate from '../../components/templates/MinimalistTemplate';
import ProfessionalTemplate from '../../components/templates/ProfessionalTemplate';
import ExecutiveTemplate from '../../components/templates/ExecutiveTemplate';
import CreativeTemplate from '../../components/templates/CreativeTemplate';
import TechTemplate from '../../components/templates/TechTemplate';
import AcademicTemplate from '../../components/templates/AcademicTemplate';
import StartupTemplate from '../../components/templates/StartupTemplate';
import CompactTemplate from '../../components/templates/CompactTemplate';
import { generatePDF, printVectorPDF } from '../../utils/pdfExport';
import { toast } from 'react-hot-toast';

const ShareView = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const autoDownload = searchParams.get('download') === 'true';

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    resumeService.getPublicResumeById(id)
      .then((data) => {
        if (data) {
          setResumeData(data);
        } else {
          toast.error('Shared resume not found.');
        }
      })
      .catch((err) => {
        console.error('Error fetching public resume:', err);
        toast.error('Failed to load shared resume.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handle auto-download if requested in URL query string
  useEffect(() => {
    if (autoDownload && resumeData && !loading) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [autoDownload, resumeData, loading]);

  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    setDownloading(true);
    const toastId = toast.loading('Downloading your PDF resume...');
    try {
      const fullName = resumeData.personalInfo?.fullName || 'resume';
      const filename = `${fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`;
      const pageSize = resumeData.customization?.pageSize || 'a4';
      const customSize = resumeData.customization?.customPageSize;

      await generatePDF('resume-preview', filename, pageSize, customSize);
      toast.success('PDF Resume downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to download PDF.', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-sm">Loading shared resume...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            ✕
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Resume Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">
            The shared resume link may have expired or is invalid.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition"
          >
            <ArrowLeft size={16} /> Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const template = resumeData.template || 'modern';
  const fullName = resumeData.personalInfo?.fullName || 'Shared';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      <SEOHead
        title={`${fullName}'s Resume — ResumeAI`}
        description={`View and download ${fullName}'s ATS-optimized resume created with ResumeAI.`}
      />
      {/* Top Header */}
      <header className="bg-white shadow-xs border-b border-gray-200 py-3.5 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs">
            ✦
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-3">
          {autoDownload && (
            <span className="hidden md:flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full font-medium">
              <CheckCircle size={14} /> Auto-downloading PDF...
            </span>
          )}
          <button
            onClick={() => printVectorPDF('resume-preview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5"
          >
            <span>🖨️ Vector ATS-PDF</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={16} />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </header>

      {/* Main Resume Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-1">
            {fullName}'s Resume
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Shared via ResumeAI · Click the download button to save as PDF.
          </p>
        </div>

        {/* Paper Container */}
        <div className="max-w-4xl mx-auto overflow-x-auto min-w-0 pb-16">
          {template === 'modern' && <ModernTemplate data={resumeData as any} />}
          {template === 'minimalist' && <MinimalistTemplate data={resumeData as any} />}
          {template === 'professional' && <ProfessionalTemplate data={resumeData as any} />}
          {template === 'executive' && <ExecutiveTemplate data={resumeData as any} />}
          {template === 'creative' && <CreativeTemplate data={resumeData as any} />}
          {template === 'tech' && <TechTemplate data={resumeData as any} />}
          {template === 'academic' && <AcademicTemplate data={resumeData as any} />}
          {template === 'startup' && <StartupTemplate data={resumeData as any} />}
          {template === 'compact' && <CompactTemplate data={resumeData as any} />}
        </div>
      </main>
    </div>
  );
};

export default ShareView;
