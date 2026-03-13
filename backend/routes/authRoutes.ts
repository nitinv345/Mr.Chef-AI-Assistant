import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_chef_key_123';

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Signup attempt for: ${normalizedEmail}`);
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ email: normalizedEmail, password });
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

  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Login attempt for: ${normalizedEmail}`);
    
    const user: any = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
