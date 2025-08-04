import express from 'express';
import { Character } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validatePagination, validateSearch, validateEntityCreation, validateUUID } from '../middleware/validation.js';
import { Op } from 'sequelize';

const router = express.Router();

// @desc    Get all characters
// @route   GET /api/v1/characters
// @access  Public
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: characters } = await Character.findAndCountAll({
    limit,
    offset,
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      characters,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Search characters
// @route   GET /api/v1/characters/search
// @access  Public
router.get('/search', validateSearch, asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: characters } = await Character.findAndCountAll({
    where: {
      name: {
        [Op.iLike]: `%${q}%`
      }
    },
    limit,
    offset,
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      characters,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Get character by ID
// @route   GET /api/v1/characters/:id
// @access  Public
router.get('/:id', validateUUID, asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found'
    });
  }

  res.json({
    success: true,
    data: {
      character
    }
  });
}));

// @desc    Get character by UID
// @route   GET /api/v1/characters/uid/:uid
// @access  Public
router.get('/uid/:uid', asyncHandler(async (req, res) => {
  const character = await Character.findOne({
    where: { uid: req.params.uid }
  });

  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found'
    });
  }

  res.json({
    success: true,
    data: {
      character
    }
  });
}));

// @desc    Create new character
// @route   POST /api/v1/characters
// @access  Private/Admin
router.post('/', authenticate, requireAdmin, validateEntityCreation, asyncHandler(async (req, res) => {
  const character = await Character.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Character created successfully',
    data: {
      character
    }
  });
}));

// @desc    Update character
// @route   PUT /api/v1/characters/:id
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found'
    });
  }

  const updatedCharacter = await character.update(req.body);

  res.json({
    success: true,
    message: 'Character updated successfully',
    data: {
      character: updatedCharacter
    }
  });
}));

// @desc    Delete character
// @route   DELETE /api/v1/characters/:id
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found'
    });
  }

  await character.destroy();

  res.json({
    success: true,
    message: 'Character deleted successfully'
  });
}));

export default router;