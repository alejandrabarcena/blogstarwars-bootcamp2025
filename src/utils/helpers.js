// Utility Helper Functions
import { ENTITY_TYPES, ERROR_MESSAGES, UI_CONFIG } from './constants.js';

/**
 * Format entity name for display
 * @param {string} name - Entity name
 * @param {string} type - Entity type
 * @returns {string} Formatted name
 */
export const formatEntityName = (name, type) => {
  if (!name) return 'Unknown';
  
  // Special handling for films (use title)
  if (type === ENTITY_TYPES.FILMS && name.includes('Episode')) {
    return name;
  }
  
  return name.trim();
};

/**
 * Get entity type display name
 * @param {string} type - Entity type
 * @returns {string} Display name
 */
export const getEntityTypeDisplayName = (type) => {
  const typeMap = {
    [ENTITY_TYPES.FILMS]: 'Films',
    [ENTITY_TYPES.PEOPLE]: 'Characters',
    [ENTITY_TYPES.PLANETS]: 'Planets',
    [ENTITY_TYPES.SPECIES]: 'Species',
    [ENTITY_TYPES.STARSHIPS]: 'Starships',
    [ENTITY_TYPES.VEHICLES]: 'Vehicles',
    [ENTITY_TYPES.TRANSPORTS]: 'Transports'
  };
  
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = UI_CONFIG.SEARCH_DEBOUNCE) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format number with commas
 * @param {number|string} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (!num || num === 'unknown' || num === 'n/a') return 'Unknown';
  
  const number = parseInt(num.toString().replace(/,/g, ''));
  if (isNaN(number)) return num;
  
  return number.toLocaleString();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Check if data is expired
 * @param {number} timestamp - Timestamp to check
 * @param {number} duration - Cache duration in milliseconds
 * @returns {boolean} True if expired
 */
export const isDataExpired = (timestamp, duration = UI_CONFIG.CACHE_DURATION) => {
  if (!timestamp) return true;
  return Date.now() - timestamp > duration;
};

/**
 * Safe JSON parse
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed value or default
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
};

/**
 * Safe JSON stringify
 * @param {*} value - Value to stringify
 * @param {string} defaultValue - Default value if stringify fails
 * @returns {string} Stringified value or default
 */
export const safeJsonStringify = (value, defaultValue = '{}') => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('JSON stringify error:', error);
    return defaultValue;
  }
};

/**
 * Get error message from error object
 * @param {Error|string} error - Error object or string
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return ERROR_MESSAGES.GENERIC;
};

/**
 * Validate entity data
 * @param {Object} entity - Entity to validate
 * @returns {boolean} True if valid
 */
export const validateEntity = (entity) => {
  if (!entity || typeof entity !== 'object') return false;
  
  const requiredFields = ['uid', 'name', 'type'];
  return requiredFields.every(field => 
    entity[field] !== undefined && 
    entity[field] !== null && 
    entity[field] !== ''
  );
};

/**
 * Sort entities by name
 * @param {Array} entities - Array of entities
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted entities
 */
export const sortEntitiesByName = (entities, order = 'asc') => {
  if (!Array.isArray(entities)) return [];
  
  return [...entities].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    
    if (order === 'desc') {
      return nameB.localeCompare(nameA);
    }
    return nameA.localeCompare(nameB);
  });
};

/**
 * Filter entities by search term
 * @param {Array} entities - Array of entities
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered entities
 */
export const filterEntitiesBySearch = (entities, searchTerm) => {
  if (!Array.isArray(entities) || !searchTerm) return entities;
  
  const term = searchTerm.toLowerCase().trim();
  
  return entities.filter(entity => {
    const name = (entity.name || '').toLowerCase();
    const type = (entity.type || '').toLowerCase();
    
    return name.includes(term) || type.includes(term);
  });
};

/**
 * Get random items from array
 * @param {Array} array - Source array
 * @param {number} count - Number of items to get
 * @returns {Array} Random items
 */
export const getRandomItems = (array, count = 5) => {
  if (!Array.isArray(array) || array.length === 0) return [];
  
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Create URL slug from text
 * @param {string} text - Text to convert
 * @returns {string} URL slug
 */
export const createSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile
 */
export const isMobile = () => {
  return window.innerWidth < 768;
};

/**
 * Scroll to top of page
 * @param {boolean} smooth - Use smooth scrolling
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};