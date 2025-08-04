import express from 'express';
import { Starship } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validatePagination, validateSearch, validateEntityCreation, validateUUID } from '../middleware/validation.js';
import { Op } from 'sequelize';

const router = express.Router();

// @desc    Get all starships
// @route   GET /api/v1/starships
// @access  Public
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: starships } = await Starship.findAndCountAll({
    limit,
    offset,
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      starships,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Search starships
// @route   GET /api/v1/starships/search
// @access  Public
router.get('/search', validateSearch, asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: starships } = await Starship.findAndCountAll({
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
      starships,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Get starship by ID
// @route   GET /api/v1/starships/:id
// @access  Public
router.get('/:id', validateUUID, asyncHandler(async (req, res) => {
  const starship = await Starship.findByPk(req.params.id);

  if (!starship) {
    return res.status(404).json({
      success: false,
      message: 'Starship not found'
    });
  }

  res.json({
    success: true,
    data: {
      starship
    }
  });
}));

// @desc    Get starship by UID
// @route   GET /api/v1/starships/uid/:uid
// @access  Public
router.get('/uid/:uid', asyncHandler(async (req, res) => {
  const starship = await Starship.findOne({
    where: { uid: req.params.uid }
  });

  if (!starship) {
    return res.status(404).json({
      success: false,
      message: 'Starship not found'
    });
  }

  res.json({
    success: true,
    data: {
      starship
    }
  });
}));

// @desc    Create new starship
// @route   POST /api/v1/starships
// @access  Private/Admin
router.post('/', authenticate, requireAdmin, validateEntityCreation, asyncHandler(async (req, res) => {
  const starship = await Starship.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Starship created successfully',
    data: {
      starship
    }
  });
}));

// @desc    Update starship
// @route   PUT /api/v1/starships/:id
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const starship = await Starship.findByPk(req.params.id);

  if (!starship) {
    return res.status(404).json({
      success: false,
      message: 'Starship not found'
    });
  }

  const updatedStarship = await starship.update(req.body);

  res.json({
    success: true,
    message: 'Starship updated successfully',
    data: {
      starship: updatedStarship
    }
  });
}));

// @desc    Delete starship
// @route   DELETE /api/v1/starships/:id
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const starship = await Starship.findByPk(req.params.id);

  if (!starship) {
    return res.status(404).json({
      success: false,
      message: 'Starship not found'
    });
  }

  await starship.destroy();

  res.json({
    success: true,
    message: 'Starship deleted successfully'
  });
}));

export default router;