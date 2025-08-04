import express from 'express';
import { Planet } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validatePagination, validateSearch, validateEntityCreation, validateUUID } from '../middleware/validation.js';
import { Op } from 'sequelize';

const router = express.Router();

// @desc    Get all planets
// @route   GET /api/v1/planets
// @access  Public
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: planets } = await Planet.findAndCountAll({
    limit,
    offset,
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      planets,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Search planets
// @route   GET /api/v1/planets/search
// @access  Public
router.get('/search', validateSearch, asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: planets } = await Planet.findAndCountAll({
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
      planets,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Get planet by ID
// @route   GET /api/v1/planets/:id
// @access  Public
router.get('/:id', validateUUID, asyncHandler(async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);

  if (!planet) {
    return res.status(404).json({
      success: false,
      message: 'Planet not found'
    });
  }

  res.json({
    success: true,
    data: {
      planet
    }
  });
}));

// @desc    Get planet by UID
// @route   GET /api/v1/planets/uid/:uid
// @access  Public
router.get('/uid/:uid', asyncHandler(async (req, res) => {
  const planet = await Planet.findOne({
    where: { uid: req.params.uid }
  });

  if (!planet) {
    return res.status(404).json({
      success: false,
      message: 'Planet not found'
    });
  }

  res.json({
    success: true,
    data: {
      planet
    }
  });
}));

// @desc    Create new planet
// @route   POST /api/v1/planets
// @access  Private/Admin
router.post('/', authenticate, requireAdmin, validateEntityCreation, asyncHandler(async (req, res) => {
  const planet = await Planet.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Planet created successfully',
    data: {
      planet
    }
  });
}));

// @desc    Update planet
// @route   PUT /api/v1/planets/:id
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);

  if (!planet) {
    return res.status(404).json({
      success: false,
      message: 'Planet not found'
    });
  }

  const updatedPlanet = await planet.update(req.body);

  res.json({
    success: true,
    message: 'Planet updated successfully',
    data: {
      planet: updatedPlanet
    }
  });
}));

// @desc    Delete planet
// @route   DELETE /api/v1/planets/:id
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);

  if (!planet) {
    return res.status(404).json({
      success: false,
      message: 'Planet not found'
    });
  }

  await planet.destroy();

  res.json({
    success: true,
    message: 'Planet deleted successfully'
  });
}));

export default router;