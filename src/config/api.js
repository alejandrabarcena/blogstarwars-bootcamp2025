// API Configuration
export const API_CONFIG = {
  // Current external API
  SWAPI_BASE_URL: 'https://www.swapi.tech/api',
  
  // Future backend API (when implemented)
  BACKEND_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-api.com/api'
    : 'http://localhost:3001/api',
  
  // API endpoints
  ENDPOINTS: {
    // External SWAPI
    SWAPI: {
      PEOPLE: '/people',
      PLANETS: '/planets',
      STARSHIPS: '/starships',
      VEHICLES: '/vehicles',
      FILMS: '/films'
    },
    
    // Future backend endpoints
    BACKEND: {
      CHARACTERS: '/characters',
      PLANETS: '/planets',
      STARSHIPS: '/starships',
      VEHICLES: '/vehicles',
      FAVORITES: '/favorites',
      USERS: '/users',
      AUTH: '/auth'
    }
  },
  
  // Request configuration
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Pagination
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// Helper function to get API URL
export const getApiUrl = (useBackend = false) => {
  return useBackend ? API_CONFIG.BACKEND_BASE_URL : API_CONFIG.SWAPI_BASE_URL;
};

// Helper function for future backend requests
export const createApiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BACKEND_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers
    },
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};