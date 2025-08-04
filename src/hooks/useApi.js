import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage, isDataExpired } from '../utils/helpers.js';
import { UI_CONFIG, STORAGE_KEYS } from '../utils/constants.js';

/**
 * Custom hook for API data fetching with caching
 * @param {Function} fetchFunction - Function to fetch data
 * @param {string} cacheKey - Cache key for localStorage
 * @param {Object} options - Options object
 * @returns {Object} API state and functions
 */
export const useApi = (fetchFunction, cacheKey, options = {}) => {
  const {
    initialData = null,
    cacheDuration = UI_CONFIG.CACHE_DURATION,
    autoFetch = true,
    dependencies = []
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          const { data: cachedData, timestamp } = parsedCache;
          
          if (!isDataExpired(timestamp, cacheDuration)) {
            setData(cachedData);
            setLastFetch(timestamp);
            return true; // Data loaded from cache
          }
        }
      } catch (error) {
        console.warn(`Error loading cached data for ${cacheKey}:`, error);
        localStorage.removeItem(cacheKey);
      }
      return false; // No valid cached data
    };

    const hasValidCache = loadCachedData();
    
    // Auto-fetch if no valid cache and autoFetch is enabled
    if (!hasValidCache && autoFetch) {
      fetchData();
    }
  }, [cacheKey, cacheDuration, autoFetch]);

  // Fetch data function
  const fetchData = useCallback(async (force = false) => {
    // Don't fetch if already loading
    if (loading) return;

    // Check cache first (unless forced)
    if (!force && data && lastFetch && !isDataExpired(lastFetch, cacheDuration)) {
      return data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      const timestamp = Date.now();
      
      setData(result);
      setLastFetch(timestamp);
      
      // Cache the result
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: result,
          timestamp
        }));
      } catch (cacheError) {
        console.warn(`Error caching data for ${cacheKey}:`, cacheError);
      }
      
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error(`API fetch error for ${cacheKey}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheKey, cacheDuration, loading, data, lastFetch]);

  // Refresh data (force fetch)
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Clear cache
  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
    setData(initialData);
    setLastFetch(null);
    setError(null);
  }, [cacheKey, initialData]);

  // Auto-refetch when dependencies change
  useEffect(() => {
    if (dependencies.length > 0 && autoFetch) {
      fetchData();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    lastFetch,
    fetchData,
    refresh,
    clearCache,
    isStale: lastFetch ? isDataExpired(lastFetch, cacheDuration) : true
  };
};

/**
 * Hook for managing multiple API endpoints
 * @param {Object} endpoints - Object with endpoint configurations
 * @returns {Object} Combined API state
 */
export const useMultipleApi = (endpoints) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  
  const apiHooks = {};
  
  // Create individual API hooks for each endpoint
  Object.keys(endpoints).forEach(key => {
    const { fetchFunction, cacheKey, options = {} } = endpoints[key];
    apiHooks[key] = useApi(fetchFunction, cacheKey, options);
  });

  // Calculate global loading state
  useEffect(() => {
    const isAnyLoading = Object.values(apiHooks).some(hook => hook.loading);
    setGlobalLoading(isAnyLoading);
  }, [Object.values(apiHooks).map(hook => hook.loading)]);

  // Calculate global error state
  useEffect(() => {
    const errors = Object.values(apiHooks)
      .map(hook => hook.error)
      .filter(Boolean);
    
    setGlobalError(errors.length > 0 ? errors[0] : null);
  }, [Object.values(apiHooks).map(hook => hook.error)]);

  // Fetch all data
  const fetchAll = async (force = false) => {
    const promises = Object.values(apiHooks).map(hook => 
      hook.fetchData(force).catch(err => ({ error: err }))
    );
    
    const results = await Promise.allSettled(promises);
    return results;
  };

  // Refresh all data
  const refreshAll = () => fetchAll(true);

  // Clear all caches
  const clearAllCaches = () => {
    Object.values(apiHooks).forEach(hook => hook.clearCache());
  };

  return {
    ...apiHooks,
    globalLoading,
    globalError,
    fetchAll,
    refreshAll,
    clearAllCaches
  };
};