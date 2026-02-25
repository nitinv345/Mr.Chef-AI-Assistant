import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = express.Router();

// Helper to get JWT secret, ensuring it's loaded from env
const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_chef_key_123';

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Signup attempt for: ${email}`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Signup failed: User already exists for ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();
    console.log(`Signup success for: ${email}`);

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for: ${email}`);
    const user: any = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found for ${email}`);
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login failed: Invalid password for ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`Login success for: ${email}`);
    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
