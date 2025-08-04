// Star Wars API Service
import { API_ENDPOINTS, UI_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { getErrorMessage, isDataExpired } from '../utils/helpers';

const BASE_URL = API_ENDPOINTS.SWAPI.BASE_URL;

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = UI_CONFIG.CACHE_DURATION;

// Request queue for rate limiting
const requestQueue = [];
let isProcessingQueue = false;
const REQUEST_DELAY = 10; // 10ms between requests (ultra fast)

// Helper function to make API requests with caching
const apiRequest = async (url, options = {}) => {
  // Check cache first
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  if (cached && !isDataExpired(cached.timestamp, CACHE_DURATION)) {
    return cached.data;
  }

  // Add to queue for rate limiting
  return new Promise((resolve, reject) => {
    requestQueue.push({ url, options, resolve, reject });
    processQueue();
  });
};

// Process request queue with rate limiting
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const { url, options, resolve, reject } = requestQueue.shift();
    
    try {
      const data = await makeRequest(url, options);
      resolve(data);
    } catch (error) {
      reject(error);
    }
    
    // Wait before next request to avoid rate limiting
    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
    }
  }
  
  isProcessingQueue = false;
};

// Make actual HTTP request
const makeRequest = async (url, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(ERROR_MESSAGES.RATE_LIMIT);
      }
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    cache.set(url, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    const errorMessage = getErrorMessage(error);
    console.error(`API request failed for ${url}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Generic function to fetch all entities from any endpoint
export const fetchAllEntities = async (endpoint) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Fetching ${endpoint}...`);
    }
    const url = `${BASE_URL}/${endpoint}`;
    const data = await apiRequest(url);
    
    if (!data || !data.results) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Invalid response format for ${endpoint}:`, data);
      }
      return [];
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${endpoint}: Found ${data.results.length} items`);
    }

    // Return only first 6 items for ultra-fast loading
    return data.results.slice(0, 6);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching ${endpoint}:`, error);
    }
    return [];
  }
};

// Specific fetch functions for each entity type
export const fetchFilms = () => fetchAllEntities('films');
export const fetchCharacters = () => fetchAllEntities('people');
export const fetchPlanets = () => fetchAllEntities('planets');
export const fetchSpecies = () => fetchAllEntities('species');
export const fetchStarships = () => fetchAllEntities('starships');
export const fetchVehicles = () => fetchAllEntities('vehicles');

// Fetch entity details by type and ID
export const fetchEntityDetails = async (type, id) => {
  try {
    const url = `${BASE_URL}/${type}/${id}`;
    const data = await apiRequest(url);
    
    if (!data || !data.result) {
      throw new Error(`No data found for ${type}/${id}`);
    }
    
    return data.result;
  } catch (error) {
    console.error(`Error fetching ${type}/${id}:`, error);
    return null;
  }
};

// Search characters (most common search)
export const searchCharacters = async (query) => {
  try {
    const characters = await fetchCharacters();
    return characters.filter(character => 
      character.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  } catch (error) {
    console.error('Error searching characters:', error);
    return [];
  }
};

// Image URL generation with multiple fallbacks
export const getImageUrl = (type, uid, name) => {
  // Clean name for URL usage
  const cleanName = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '-') : '';
  
  return {
    // Local images (highest priority)
    local: `/images/${type}/${uid}.jpg`,
    
    // Star Wars Visual Guide (excellent quality)
    primary: `https://starwars-visualguide.com/assets/img/${type}/${uid}.jpg`,
    
    // Alternative Visual Guide endpoints
    secondary: type === 'people' 
      ? `https://starwars-visualguide.com/assets/img/characters/${uid}.jpg`
      : `https://starwars-visualguide.com/assets/img/${type}/${uid}.jpg`,
    
    // Wikia/Fandom images (good fallback)
    wikia: `https://static.wikia.nocookie.net/starwars/images/${uid}/${cleanName}.jpg`,
    
    // Random Star Wars themed placeholder
    placeholder: `https://picsum.photos/400/250?random=${uid}&grayscale`,
    
    // Final fallback with entity info
    fallback: `https://via.placeholder.com/400x250/1a1a1a/ffc107?text=${encodeURIComponent(name || 'Star Wars')}`
  };
};

// Utility function to get entity type display name
export const getEntityTypeDisplayName = (type) => {
  const typeMap = {
    'people': 'Characters',
    'films': 'Films',
    'planets': 'Planets',
    'species': 'Species',
    'starships': 'Starships',
    'vehicles': 'Vehicles',
    'transports': 'Transports'
  };
  
  return typeMap[type] || type;
};

// Utility function to format entity data
export const formatEntityData = (rawData, type) => {
  if (!rawData) return null;
  
  return {
    uid: rawData.uid,
    name: type === 'films' ? rawData.properties?.title : rawData.name,
    type: type,
    properties: rawData.properties || {},
    description: rawData.description || ''
  };
};

// Health check for API
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/people/1`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Clear cache (useful for development)
export const clearCache = () => {
  cache.clear();
  console.log('API cache cleared');
};

// Get cache stats (useful for debugging)
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};