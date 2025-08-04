import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchCharacters, fetchFilms, fetchPlanets, fetchSpecies, fetchStarships, fetchVehicles } from '../services/swapi';
import { STORAGE_KEYS, UI_CONFIG } from '../utils/constants';
import { safeJsonParse, safeJsonStringify, isDataExpired, validateEntity } from '../utils/helpers';

const initialState = {
  characters: [],
  films: [],
  planets: [],
  species: [],
  starships: [],
  vehicles: [],
  favorites: [],
  loading: false,
  searchTerm: '',
  searchResults: [],
  lastFetch: null,
  error: null,
  retryCount: 0,
  isOnline: navigator.onLine
};

const starWarsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHARACTERS':
      return { ...state, characters: action.payload };
    case 'SET_FILMS':
      return { ...state, films: action.payload };
    case 'SET_PLANETS':
      return { ...state, planets: action.payload };
    case 'SET_SPECIES':
      return { ...state, species: action.payload };
    case 'SET_STARSHIPS':
      return { ...state, starships: action.payload };
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload };
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('starwars-favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(item => item.uid !== action.payload);
      localStorage.setItem('starwars-favorites', JSON.stringify(filteredFavorites));
      return { ...state, favorites: filteredFavorites };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    case 'SET_LAST_FETCH':
      return { ...state, lastFetch: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_RETRY_COUNT':
      return { ...state, retryCount: action.payload };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'RESET_STATE':
      return { ...initialState, favorites: state.favorites };
    default:
      return state;
  }
};

const StarWarsContext = createContext(undefined);

export const StarWarsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(starWarsReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.CACHE);
    if (savedData) {
      try {
        const parsedData = safeJsonParse(savedData);
        const now = new Date().getTime();
        const cacheTime = UI_CONFIG.CACHE_DURATION;
        
        // Check if data is not expired
        if (parsedData.lastFetch && !isDataExpired(parsedData.lastFetch, cacheTime)) {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedData });
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Data loaded from localStorage');
          }
          return;
        }
      } catch (error) {
        console.warn('Error loading from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.CACHE);
      }
    }

    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (savedFavorites) {
      try {
        dispatch({ type: 'SET_FAVORITES', payload: safeJsonParse(savedFavorites, []) });
      } catch (error) {
        console.warn('Error loading favorites from localStorage:', error);
        localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (state.characters.length > 0 || state.films.length > 0) {
      try {
        const dataToSave = {
          characters: state.characters,
          films: state.films,
          planets: state.planets,
          species: state.species,
          starships: state.starships,
          vehicles: state.vehicles,
          lastFetch: state.lastFetch
        };
        localStorage.setItem(STORAGE_KEYS.CACHE, safeJsonStringify(dataToSave));
      } catch (error) {
        console.warn('Error saving to localStorage:', error);
        // If storage is full, clear old data and try again
        localStorage.removeItem(STORAGE_KEYS.CACHE);
      }
    }
  }, [state.characters, state.films, state.planets, state.species, state.starships, state.transports, state.vehicles, state.lastFetch]);

  // Online/offline status monitoring
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addFavorite = (entity) => {
    if (validateEntity(entity) && !state.favorites.find(item => item.uid === entity.uid && item.type === entity.type)) {
      dispatch({ type: 'ADD_FAVORITE', payload: entity });
    }
  };

  const removeFavorite = (uid, type = null) => {
    if (type) {
      // Remove specific entity by uid and type
      const updatedFavorites = state.favorites.filter(item => !(item.uid === uid && item.type === type));
      dispatch({ type: 'SET_FAVORITES', payload: updatedFavorites });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, safeJsonStringify(updatedFavorites));
    } else {
      // Legacy: remove by uid only (for backward compatibility)
      dispatch({ type: 'REMOVE_FAVORITE', payload: uid });
    }
  };

  const isFavorite = (uid, type = null) => {
    if (type) {
      return state.favorites.some(item => item.uid === uid && item.type === type);
    }
    return state.favorites.some(item => item.uid === uid);
  };

  const getFavoritesByType = (type) => {
    return state.favorites.filter(item => item.type === type);
  };

  const clearFavorites = () => {
    dispatch({ type: 'SET_FAVORITES', payload: [] });
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  };

  const searchEntities = (term) => {
    if (!term.trim()) return [];
    
    const allEntities = [
      ...state.characters,
      ...state.films,
      ...state.planets,
      ...state.species,
      ...state.starships,
      ...state.vehicles
    ];
    
    return allEntities.filter(entity =>
      entity.name.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 10);
  };

  const clearCache = () => {
    localStorage.removeItem(STORAGE_KEYS.CACHE);
    dispatch({ type: 'RESET_STATE' });
  };

  const retryOperation = () => {
    dispatch({ type: 'SET_RETRY_COUNT', payload: state.retryCount + 1 });
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <StarWarsContext.Provider value={{
      state,
      dispatch,
      addFavorite,
      removeFavorite,
      isFavorite,
      getFavoritesByType,
      clearFavorites,
      searchEntities,
      clearCache,
      retryOperation
    }}>
      {children}
    </StarWarsContext.Provider>
  );
};

export const useStarWars = () => {
  const context = useContext(StarWarsContext);
  if (context === undefined) {
    throw new Error('useStarWars must be used within a StarWarsProvider');
  }
  return context;
};