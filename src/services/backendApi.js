// Future Backend API Service
import { createApiRequest, API_CONFIG } from '../config/api.js';

// Authentication
export const authService = {
  login: async (credentials) => {
    return createApiRequest(API_CONFIG.ENDPOINTS.BACKEND.AUTH + '/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  register: async (userData) => {
    return createApiRequest(API_CONFIG.ENDPOINTS.BACKEND.AUTH + '/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: async () => {
    return createApiRequest(API_CONFIG.ENDPOINTS.BACKEND.AUTH + '/logout', {
      method: 'POST'
    });
  }
};

// Characters
export const charactersService = {
  getAll: async (page = 1, limit = 20) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.CHARACTERS}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.CHARACTERS}/${id}`);
  },
  
  search: async (query) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.CHARACTERS}/search?q=${encodeURIComponent(query)}`);
  }
};

// Planets
export const planetsService = {
  getAll: async (page = 1, limit = 20) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.PLANETS}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.PLANETS}/${id}`);
  }
};

// Starships
export const starshipsService = {
  getAll: async (page = 1, limit = 20) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.STARSHIPS}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.STARSHIPS}/${id}`);
  }
};

// Vehicles
export const vehiclesService = {
  getAll: async (page = 1, limit = 20) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.VEHICLES}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.VEHICLES}/${id}`);
  }
};

// Favorites
export const favoritesService = {
  getUserFavorites: async (userId) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.FAVORITES}/${userId}`);
  },
  
  addFavorite: async (userId, entityData) => {
    return createApiRequest(API_CONFIG.ENDPOINTS.BACKEND.FAVORITES, {
      method: 'POST',
      body: JSON.stringify({ userId, ...entityData })
    });
  },
  
  removeFavorite: async (userId, entityId) => {
    return createApiRequest(`${API_CONFIG.ENDPOINTS.BACKEND.FAVORITES}/${userId}/${entityId}`, {
      method: 'DELETE'
    });
  }
};

// Generic service for future endpoints
export const createEntityService = (entityType) => ({
  getAll: async (page = 1, limit = 20) => {
    return createApiRequest(`/${entityType}?page=${page}&limit=${limit}`);
  },
  
  getById: async (id) => {
    return createApiRequest(`/${entityType}/${id}`);
  },
  
  create: async (data) => {
    return createApiRequest(`/${entityType}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return createApiRequest(`/${entityType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return createApiRequest(`/${entityType}/${id}`, {
      method: 'DELETE'
    });
  }
});