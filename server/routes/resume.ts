import express from 'express';
// import { authMiddleware } from '../middleware/auth';
import Resume from '../models/Resume';

const router = express.Router();

// Mock auth middleware for now (will implement properly later)
const mockAuth = (req: any, res: any, next: any) => {
  // Assume a fixed user ID for testing without token
  req.user = { id: '60d0fe4f5311236168a109ca' }; 
  next();
};

// @route GET /api/resumes
router.get('/', mockAuth, async (req: any, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST /api/resumes
router.post('/', mockAuth, async (req: any, res) => {
  try {
    const newResume = new Resume({
      ...req.body,
      userId: req.user.id
    });
    const resume = await newResume.save();
    res.json(resume);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/resumes/:id
router.get('/:id', mockAuth, async (req: any, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    res.json(resume);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT /api/resumes/:id
router.put('/:id', mockAuth, async (req: any, res) => {
  try {
    let resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    resume = await Resume.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(resume);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE /api/resumes/:id
router.delete('/:id', mockAuth, async (req: any, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await resume.deleteOne();
    res.json({ message: 'Resume removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
