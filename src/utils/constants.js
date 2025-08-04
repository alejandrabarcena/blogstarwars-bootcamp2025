// Application Constants
export const APP_CONFIG = {
  NAME: 'Star Wars Universe',
  VERSION: '1.0.0',
  DESCRIPTION: 'Complete Star Wars blog application with React, Vite, and backend preparation',
  AUTHOR: 'Star Wars Fan',
  REPOSITORY: 'https://github.com/your-username/star-wars-blog'
};

// API Configuration
export const API_ENDPOINTS = {
  SWAPI: {
    BASE_URL: 'https://www.swapi.tech/api',
    ENDPOINTS: {
      FILMS: 'films',
      PEOPLE: 'people',
      PLANETS: 'planets',
      SPECIES: 'species',
      STARSHIPS: 'starships',
      VEHICLES: 'vehicles'
    }
  },
  BACKEND: {
    BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-api.com/api/v1'
      : 'http://localhost:3001/api/v1',
    ENDPOINTS: {
      AUTH: '/auth',
      USERS: '/users',
      FAVORITES: '/favorites',
      CHARACTERS: '/characters',
      PLANETS: '/planets',
      STARSHIPS: '/starships',
      VEHICLES: '/vehicles'
    }
  }
};

// Entity Types
export const ENTITY_TYPES = {
  FILMS: 'films',
  PEOPLE: 'people',
  PLANETS: 'planets',
  SPECIES: 'species',
  STARSHIPS: 'starships',
  VEHICLES: 'vehicles',
  TRANSPORTS: 'transports'
};

// UI Constants
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 12,
  SEARCH_DEBOUNCE: 300,
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  MAX_SEARCH_RESULTS: 10,
  IMAGE_FALLBACK_DELAY: 2000,
  ANIMATION_DURATION: 300
};

// Color Scheme
export const COLORS = {
  PRIMARY: '#ffc107', // Star Wars Yellow
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  DARK: '#343a40',
  LIGHT: '#f8f9fa'
};

// Breakpoints (Bootstrap compatible)
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'starwars-favorites',
  CACHE: 'starwars-data',
  USER_PREFERENCES: 'starwars-preferences',
  THEME: 'starwars-theme'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Unable to fetch data from the server.',
  NOT_FOUND: 'The requested item was not found.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  GENERIC: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FAVORITE_ADDED: 'Added to favorites successfully!',
  FAVORITE_REMOVED: 'Removed from favorites successfully!',
  DATA_LOADED: 'Data loaded successfully!',
  SEARCH_COMPLETE: 'Search completed!'
};