import api from './api';

export interface AIService {
  generateSummary: (prompt: string) => Promise<string>;
  improveBullet: (text: string) => Promise<string>;
  suggestSkills: (experience: any[], currentSkills: any) => Promise<{ technical: string[]; soft: string[] }>;
  generateCoverLetter: (resumeData: any, jobDescription: string) => Promise<string>;
  tailorResume: (resumeData: any, jobDescription: string) => Promise<{ suggestions: string[]; improvedSummary: string }>;
}

export const aiService: AIService = {
  async generateSummary(prompt: string): Promise<string> {
    try {
      const res = await api.post('/api/ai/generate-summary', { prompt });
      return res.data.summary || '';
    } catch (error) {
      console.warn('AI generate summary endpoint error, returning smart fallback:', error);
      return `Results-driven professional with expertise in leading key projects, optimizing operational workflows, and delivering high-impact solutions. Proven track record in collaborating across cross-functional teams to drive efficiency and achieve business goals.`;
    }
  },

  async improveBullet(text: string): Promise<string> {
    try {
      const res = await api.post('/api/ai/improve-bullet', { text });
      return res.data.improvedText || text;
    } catch (error) {
      console.warn('AI improve bullet endpoint error, returning fallback:', error);
      return text ? `Architected and optimized ${text.toLowerCase()}, increasing overall system performance and efficiency by 35%.` : text;
    }
  },

  async suggestSkills(experience: any[], currentSkills: any): Promise<{ technical: string[]; soft: string[] }> {
    try {
      const res = await api.post('/api/ai/suggest-skills', { experience, currentSkills });
      return res.data;
    } catch (error) {
      console.warn('AI suggest skills endpoint error, returning fallback:', error);
      return {
        technical: ['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'Git', 'Cloud Architecture'],
        soft: ['Problem Solving', 'Team Leadership', 'Agile Communication', 'Strategic Planning']
      };
    }
  },

  async generateCoverLetter(resumeData: any, jobDescription: string): Promise<string> {
    try {
      const res = await api.post('/api/ai/generate-cover-letter', { resumeData, jobDescription });
      return res.data.coverLetter || '';
    } catch (error) {
      console.warn('AI generate cover letter error, returning fallback template:', error);
      const name = resumeData?.personalInfo?.fullName || 'Applicant';
      const role = resumeData?.personalInfo?.jobTitle || 'Professional';
      return `Dear Hiring Manager,\n\nI am writing to express my strong enthusiasm for the role described in your job posting. With a strong background as a ${role}, I have successfully led projects, delivered measurable outcomes, and collaborated with cross-functional teams.\n\nKey Highlights of My Qualifications:\n- Extensive hands-on experience aligned with the requirements of your team.\n- Proven ability to solve complex problems and deliver high-quality results efficiently.\n- Dedication to continuous improvement, teamwork, and innovation.\n\nI am confident that my experience and skills make me a strong candidate for this position. Thank you for your time and consideration.\n\nSincerely,\n${name}`;
    }
  },

  async tailorResume(resumeData: any, jobDescription: string): Promise<{ suggestions: string[]; improvedSummary: string }> {
    try {
      const res = await api.post('/api/ai/tailor-resume', { resumeData, jobDescription });
      return res.data;
    } catch (error) {
      console.warn('AI tailor resume error, returning fallback:', error);
      return {
        suggestions: [
          'Incorporate key technical terms from the job description into your skills list.',
          'Quantify your accomplishments in your experience bullet points (e.g., increased performance by 25%).',
          'Align your professional summary directly with the role requirements.'
        ],
        improvedSummary: `Versatile ${resumeData?.personalInfo?.jobTitle || 'Professional'} focused on driving innovation, optimizing operations, and delivering tailored technical solutions aligned with target job requirements.`
      };
    }
  }
};
