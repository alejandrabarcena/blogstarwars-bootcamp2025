import express from 'express';
import { User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validatePagination, validateUUID } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users
// @access  Private/Admin
router.get('/', authenticate, requireAdmin, validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: users } = await User.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] }
  });

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Get user by ID (Admin only)
// @route   GET /api/v1/users/:id
// @access  Private/Admin
router.get('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        association: 'favorites',
        limit: 10,
        order: [['createdAt', 'DESC']]
      }
    ]
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
}));

// @desc    Update user (Admin only)
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const { username, email, firstName, lastName, role, isActive } = req.body;

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const updatedUser = await user.update({
    username,
    email,
    firstName,
    lastName,
    role,
    isActive
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: updatedUser
    }
  });
}));

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Soft delete by setting isActive to false
  await user.update({ isActive: false });

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

// @desc    Get user statistics (Admin only)
// @route   GET /api/v1/users/stats
// @access  Private/Admin
router.get('/stats', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const totalUsers = await User.count();
  const activeUsers = await User.count({ where: { isActive: true } });
  const adminUsers = await User.count({ where: { role: 'admin' } });
  
  // Users registered in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentUsers = await User.count({
    where: {
      createdAt: {
        $gte: thirtyDaysAgo
      }
    }
  });

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      adminUsers,
      recentUsers,
      inactiveUsers: totalUsers - activeUsers
    }
  });
}));

export default router;