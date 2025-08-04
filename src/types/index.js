// Shared Types and Interfaces

// Entity Types
export const ENTITY_TYPES = {
  PEOPLE: 'people',
  PLANETS: 'planets',
  STARSHIPS: 'starships',
  VEHICLES: 'vehicles',
  FILMS: 'films'
};

// API Response Structure
export const createApiResponse = (data, meta = {}) => ({
  data,
  meta: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    ...meta
  },
  success: true,
  message: null
});

// Error Response Structure
export const createErrorResponse = (message, code = 500) => ({
  data: null,
  meta: {},
  success: false,
  message,
  code
});

// Entity Base Structure
export const createEntity = (type, uid, name, properties = {}) => ({
  uid,
  name,
  type,
  properties,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// User Structure (for future auth)
export const createUser = (id, email, username) => ({
  id,
  email,
  username,
  favorites: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Favorite Structure
export const createFavorite = (userId, entity) => ({
  id: `${userId}-${entity.type}-${entity.uid}`,
  userId,
  entityType: entity.type,
  entityUid: entity.uid,
  entityName: entity.name,
  createdAt: new Date().toISOString()
});

// Validation Helpers
export const validateEntity = (entity) => {
  const required = ['uid', 'name', 'type'];
  return required.every(field => entity[field] !== undefined && entity[field] !== null);
};

export const validateUser = (user) => {
  const required = ['email', 'username'];
  return required.every(field => user[field] !== undefined && user[field] !== null);
};

// Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};