import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', validateUserRegistration, asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      $or: [{ email }, { username }]
    }
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email or username already exists'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName
  });

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
}));

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', validateUserLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ where: { email } });

  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  // Generate token
  const token = generateToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
}));

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

// @desc    Update current user
// @route   PUT /api/v1/auth/me
// @access  Private
router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const { firstName, lastName, avatar } = req.body;

  const updatedUser = await req.user.update({
    firstName,
    lastName,
    avatar
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
}));

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
router.put('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate current password
  const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);

  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  await req.user.update({ password: newPassword });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @desc    Logout user (client-side token removal)
// @route   POST /api/v1/auth/logout
// @access  Private
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

export default router;