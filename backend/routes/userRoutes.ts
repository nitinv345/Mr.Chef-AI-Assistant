import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

// Update User Settings
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedUpdates = [
      'name', 'profilePicture', 'language', 'dietType',
      'skillLevel', 'cuisinePreferences', 'notifications'
    ];

    const filteredUpdates: any = {};
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    });

    const user = await User.findByIdAndUpdate(id, filteredUpdates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    delete (userObj as any).password;
    res.json(userObj);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during settings update' });
  }
});

export default router;
