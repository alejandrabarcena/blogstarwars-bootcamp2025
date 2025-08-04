import express from 'express';
import { Vehicle } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validatePagination, validateSearch, validateEntityCreation, validateUUID } from '../middleware/validation.js';
import { Op } from 'sequelize';

const router = express.Router();

// @desc    Get all vehicles
// @route   GET /api/v1/vehicles
// @access  Public
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: vehicles } = await Vehicle.findAndCountAll({
    limit,
    offset,
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      vehicles,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Search vehicles
// @route   GET /api/v1/vehicles/search
// @access  Public
router.get('/search', validateSearch, asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: vehicles } = await Vehicle.findAndCountAll({
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
      vehicles,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
}));

// @desc    Get vehicle by ID
// @route   GET /api/v1/vehicles/:id
// @access  Public
router.get('/:id', validateUUID, asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }

  res.json({
    success: true,
    data: {
      vehicle
    }
  });
}));

// @desc    Get vehicle by UID
// @route   GET /api/v1/vehicles/uid/:uid
// @access  Public
router.get('/uid/:uid', asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    where: { uid: req.params.uid }
  });

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }

  res.json({
    success: true,
    data: {
      vehicle
    }
  });
}));

// @desc    Create new vehicle
// @route   POST /api/v1/vehicles
// @access  Private/Admin
router.post('/', authenticate, requireAdmin, validateEntityCreation, asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: {
      vehicle
    }
  });
}));

// @desc    Update vehicle
// @route   PUT /api/v1/vehicles/:id
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }

  const updatedVehicle = await vehicle.update(req.body);

  res.json({
    success: true,
    message: 'Vehicle updated successfully',
    data: {
      vehicle: updatedVehicle
    }
  });
}));

// @desc    Delete vehicle
// @route   DELETE /api/v1/vehicles/:id
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, validateUUID, asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }

  await vehicle.destroy();

  res.json({
    success: true,
    message: 'Vehicle deleted successfully'
  });
}));

export default router;