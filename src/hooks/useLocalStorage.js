import { useState, useEffect } from 'react';
import { safeJsonParse, safeJsonStringify } from '../utils/helpers.js';

/**
 * Custom hook for localStorage management
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {[*, Function]} Value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? safeJsonParse(item, initialValue) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, safeJsonStringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook for managing favorites in localStorage
 * @returns {Object} Favorites management functions
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('starwars-favorites', []);

  const addFavorite = (entity) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.uid === entity.uid && item.type === entity.type);
      if (exists) return prev;
      return [...prev, entity];
    });
  };

  const removeFavorite = (uid, type) => {
    setFavorites(prev => prev.filter(item => !(item.uid === uid && item.type === type)));
  };

  const isFavorite = (uid, type) => {
    return favorites.some(item => item.uid === uid && item.type === type);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFavoritesByType = (type) => {
    return favorites.filter(item => item.type === type);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    getFavoritesByType,
    favoritesCount: favorites.length
  };
};

/**
 * Hook for managing user preferences
 * @returns {Object} Preferences management functions
 */
export const usePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('starwars-preferences', {
    theme: 'dark',
    itemsPerPage: 12,
    sortOrder: 'asc',
    showDescriptions: true,
    autoPlay: false
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      theme: 'dark',
      itemsPerPage: 12,
      sortOrder: 'asc',
      showDescriptions: true,
      autoPlay: false
    });
  };

  return {
    preferences,
    updatePreference,
    resetPreferences
  };
};