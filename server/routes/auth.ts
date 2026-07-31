import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { isDbConnected, memDb } from '../models/memStore';

const router = express.Router();

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isDbConnected()) {
      let existingUser = memDb.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const memUser = memDb.createUser({ name, email, password: hashedPassword });
      const payload = { user: { id: memUser.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

      return res.json({ token, user: { id: memUser.id, name: memUser.name, email: memUser.email, plan: memUser.plan } });
    }
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isDbConnected()) {
      let memUser = memDb.findUserByEmail(email);
      if (!memUser || !memUser.password) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, memUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const payload = { user: { id: memUser.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

      return res.json({ token, user: { id: memUser.id, name: memUser.name, email: memUser.email, plan: memUser.plan } });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    if (!user.password) {
       return res.status(400).json({ message: 'Invalid Credentials - use Google Login' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/auth/firebase-login
router.post('/firebase-login', async (req, res) => {
  try {
    const { uid, email, name, phoneNumber } = req.body;

    if (!uid) {
      return res.status(400).json({ message: 'Firebase UID is required' });
    }

    const userEmail = email || `${uid.substring(0, 8)}@phone.user`;
    const userName = name || phoneNumber || 'User';

    if (!isDbConnected()) {
      let memUser = memDb.findUserByEmail(userEmail);
      if (!memUser) {
        memUser = memDb.createUser({ name: userName, email: userEmail, plan: 'free' });
        memUser.firebaseUid = uid;
        if (phoneNumber) memUser.phoneNumber = phoneNumber;
      }

      const payload = { user: { id: memUser.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

      return res.json({
        token,
        user: { id: memUser.id, name: memUser.name, email: memUser.email, plan: memUser.plan, phoneNumber: memUser.phoneNumber }
      });
    }

    let user = await User.findOne({ $or: [{ email: userEmail }, { firebaseUid: uid }] });
    if (!user) {
      user = new User({
        name: userName,
        email: userEmail,
        firebaseUid: uid,
        phoneNumber: phoneNumber || undefined,
        plan: 'free',
      });
      await user.save();
    } else {
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, phoneNumber: user.phoneNumber }
    });
  } catch (err: any) {
    console.error('Firebase Login Error:', err.message);
    res.status(500).json({ message: 'Server error during social login' });
  }
});

// @route GET /api/auth/profile
router.get('/profile', async (req: any, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { user: { id: string } };
    
    if (!isDbConnected()) {
      const memUser = memDb.findUserById(decoded.user.id);
      if (!memUser) return res.status(404).json({ message: 'User not found' });
      const { password, ...userData } = memUser;
      return res.json(userData);
    }

    const user = await User.findById(decoded.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;

