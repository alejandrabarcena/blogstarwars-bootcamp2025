import express from 'express';
import { Favorite, User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { validateFavorite, validatePagination, validateUUID } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get user's favorites
// @route   GET /api/v1/favorites
// @access  Private
router.get('/', authenticate, validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: favorites } = await Favorite.findAndCountAll({
    where: { userId: req.user.id },
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    data: {
      favorites,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Add to favorites
// @route   POST /api/v1/favorites
// @access  Private
router.post('/', authenticate, validateFavorite, asyncHandler(async (req, res) => {
  const { entityType, entityUid, entityName, entityData } = req.body;

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({
    where: {
      userId: req.user.id,
      entityType,
      entityUid
    }
  });

  if (existingFavorite) {
    return res.status(409).json({
      success: false,
      message: 'Item already in favorites'
    });
  }

  const favorite = await Favorite.create({
    userId: req.user.id,
    entityType,
    entityUid,
    entityName,
    entityData
  });

  res.status(201).json({
    success: true,
    message: 'Added to favorites successfully',
    data: {
      favorite
    }
  });
}));

// @desc    Remove from favorites
// @route   DELETE /api/v1/favorites/:id
// @access  Private
router.delete('/:id', authenticate, validateUUID, asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });

  if (!favorite) {
    return res.status(404).json({
      success: false,
      message: 'Favorite not found'
    });
  }

  await favorite.destroy();

  res.json({
    success: true,
    message: 'Removed from favorites successfully'
  });
}));

// @desc    Remove from favorites by entity
// @route   DELETE /api/v1/favorites/entity/:type/:uid
// @access  Private
router.delete('/entity/:type/:uid', authenticate, asyncHandler(async (req, res) => {
  const { type, uid } = req.params;

  const favorite = await Favorite.findOne({
    where: {
      userId: req.user.id,
      entityType: type,
      entityUid: uid
    }
  });

  if (!favorite) {
    return res.status(404).json({
      success: false,
      message: 'Favorite not found'
    });
  }

  await favorite.destroy();

  res.json({
    success: true,
    message: 'Removed from favorites successfully'
  });
}));

// @desc    Check if item is in favorites
// @route   GET /api/v1/favorites/check/:type/:uid
// @access  Private
router.get('/check/:type/:uid', authenticate, asyncHandler(async (req, res) => {
  const { type, uid } = req.params;

  const favorite = await Favorite.findOne({
    where: {
      userId: req.user.id,
      entityType: type,
      entityUid: uid
    }
  });

  res.json({
    success: true,
    data: {
      isFavorite: !!favorite,
      favorite: favorite || null
    }
  });
}));

// @desc    Get favorites by type
// @route   GET /api/v1/favorites/type/:type
// @access  Private
router.get('/type/:type', authenticate, validatePagination, asyncHandler(async (req, res) => {
  const { type } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: favorites } = await Favorite.findAndCountAll({
    where: {
      userId: req.user.id,
      entityType: type
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    data: {
      favorites,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Clear all favorites
// @route   DELETE /api/v1/favorites
// @access  Private
router.delete('/', authenticate, asyncHandler(async (req, res) => {
  await Favorite.destroy({
    where: { userId: req.user.id }
  });

  res.json({
    success: true,
    message: 'All favorites cleared successfully'
  });
}));

export default router;