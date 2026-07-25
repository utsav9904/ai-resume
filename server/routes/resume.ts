import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Resume from '../models/Resume';
import { isDbConnected, memDb } from '../models/memStore';

const router = express.Router();

// @route GET /api/resumes
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!isDbConnected()) {
      const resumes = memDb.getResumesByUser(req.user.id);
      return res.json(resumes);
    }

    const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST /api/resumes
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!isDbConnected()) {
      const resume = memDb.createResume(req.user.id, req.body);
      return res.json(resume);
    }

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
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!isDbConnected()) {
      const resume = memDb.getResumeById(req.params.id);
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      if (resume.userId !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
      return res.json(resume);
    }

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
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!isDbConnected()) {
      const updated = memDb.updateResume(req.params.id, req.user.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Resume not found' });
      return res.json(updated);
    }

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
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!isDbConnected()) {
      const ok = memDb.deleteResume(req.params.id, req.user.id);
      if (!ok) return res.status(404).json({ message: 'Resume not found' });
      return res.json({ message: 'Resume removed' });
    }

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
