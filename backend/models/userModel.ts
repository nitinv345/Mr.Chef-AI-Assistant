import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Prasad'
  },
  profilePicture: {
    type: String,
    default: 'https://res.cloudinary.com/dvkfhijxs/image/upload/v1772007443/images_hbiu5q.jpg'
  },
  language: {
    type: String,
    default: 'English'
  },
  dietType: {
    type: String,
    default: 'Non-Veg'
  },
  skillLevel: {
    type: String,
    default: 'Intermediate'
  },
  cuisinePreferences: {
    type: [String],
    default: ['Indian']
  },
  notifications: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(this: any) {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err: any) {
    throw err;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
