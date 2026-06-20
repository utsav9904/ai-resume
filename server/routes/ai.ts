import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// @route POST /api/ai/generate-summary
router.post('/generate-summary', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Check if real key is provided, else return mock
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
       return res.json({ summary: "This is a mocked AI professional summary generated because no valid OpenAI API key was found in the server's .env file." });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error generating summary' });
  }
});

// @route POST /api/ai/improve-bullet
router.post('/improve-bullet', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
       return res.json({ improvedText: "Developed robust and scalable systems (Mocked AI Improvement)" });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume writer. Improve the following bullet point to be more professional, impactful, and action-oriented." },
        { role: "user", content: text }
      ],
      model: "gpt-3.5-turbo",
    });

    res.json({ improvedText: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error improving bullet point' });
  }
});

// @route POST /api/ai/suggest-skills
router.post('/suggest-skills', async (req, res) => {
  try {
    const { experience, currentSkills } = req.body;
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
       return res.json({ 
         technical: ['React', 'Node.js', 'TypeScript', 'Mocked Skill'],
         soft: ['Communication', 'Leadership', 'Mocked Skill']
       });
    }

    const prompt = `Based on the following experience: ${JSON.stringify(experience)} and current skills: ${JSON.stringify(currentSkills)}, suggest a list of technical and soft skills. Return ONLY a valid JSON object with the format: {"technical": ["skill1", "skill2"], "soft": ["skill1", "skill2"]}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const content = completion.choices[0].message.content;
    res.json(JSON.parse(content || '{"technical":[],"soft":[]}'));
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error suggesting skills' });
  }
});

// @route POST /api/ai/generate-cover-letter
router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
       return res.json({ coverLetter: "Dear Hiring Manager,\n\nThis is a mocked cover letter generated because no valid OpenAI API key was found.\n\nSincerely,\nApplicant" });
    }

    const prompt = `Write a professional cover letter for a candidate with this resume data: ${JSON.stringify(resumeData)}. The job description they are applying for is: ${jobDescription}. Make it persuasive, well-formatted, and highlight how their experience matches the job description.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    res.json({ coverLetter: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error generating cover letter' });
  }
});

// @route POST /api/ai/tailor-resume
router.post('/tailor-resume', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
       return res.json({ 
         suggestions: ["Include more keywords related to the job description (Mocked)"],
         improvedSummary: "A tailored summary matching the job (Mocked)"
       });
    }

    const prompt = `Analyze this resume: ${JSON.stringify(resumeData)} against this job description: ${jobDescription}. Suggest 3-5 specific improvements or keywords to add. Also provide a tailored professional summary. Return ONLY a valid JSON object with the format: {"suggestions": ["suggestion 1", "suggestion 2"], "improvedSummary": "tailored summary text"}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const content = completion.choices[0].message.content;
    res.json(JSON.parse(content || '{"suggestions":[],"improvedSummary":""}'));
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error tailoring resume' });
  }
});

export default router;
