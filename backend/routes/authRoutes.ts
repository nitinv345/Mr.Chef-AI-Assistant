import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_chef_key_123';

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Signup attempt for: ${email}`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    const userObj = user.toObject();
    delete (userObj as any).password;
    const token = jwt.sign({ id: user._id.toString() }, getJwtSecret(), { expiresIn: '1d' });
    res.status(201).json({ token, user: userObj });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during signup' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Login attempt for: ${email}`);
    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const userObj = user.toObject();
    delete userObj.password;
    const token = jwt.sign({ id: user._id.toString() }, getJwtSecret(), { expiresIn: '1d' });
    res.json({ token, user: userObj });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
});

export default router;
