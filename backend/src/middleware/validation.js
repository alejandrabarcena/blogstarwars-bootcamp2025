import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Entity validation rules
export const validateEntityCreation = [
  body('uid')
    .notEmpty()
    .withMessage('UID is required')
    .isLength({ max: 50 })
    .withMessage('UID must be less than 50 characters'),
  
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name must be less than 255 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters'),
  
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  handleValidationErrors
];

// Favorite validation rules
export const validateFavorite = [
  body('entityType')
    .isIn(['people', 'planets', 'starships', 'vehicles'])
    .withMessage('Entity type must be one of: people, planets, starships, vehicles'),
  
  body('entityUid')
    .notEmpty()
    .withMessage('Entity UID is required'),
  
  body('entityName')
    .notEmpty()
    .withMessage('Entity name is required'),
  
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// Search validation
export const validateSearch = [
  query('q')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  handleValidationErrors
];

// UUID parameter validation
export const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];