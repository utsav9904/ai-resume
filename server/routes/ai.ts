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

export default router;
