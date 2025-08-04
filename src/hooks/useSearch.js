import { useState, useEffect, useMemo } from 'react';
import { debounce, filterEntitiesBySearch } from '../utils/helpers.js';
import { UI_CONFIG } from '../utils/constants.js';

/**
 * Custom hook for search functionality
 * @param {Array} data - Data to search through
 * @param {Object} options - Search options
 * @returns {Object} Search state and functions
 */
export const useSearch = (data = [], options = {}) => {
  const {
    searchFields = ['name'],
    minSearchLength = 1,
    maxResults = UI_CONFIG.MAX_SEARCH_RESULTS,
    debounceDelay = UI_CONFIG.SEARCH_DEBOUNCE,
    caseSensitive = false
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term
  const debouncedSetSearchTerm = useMemo(
    () => debounce((term) => {
      setDebouncedSearchTerm(term);
      setIsSearching(false);
    }, debounceDelay),
    [debounceDelay]
  );

  // Update debounced search term when search term changes
  useEffect(() => {
    if (searchTerm.length >= minSearchLength) {
      setIsSearching(true);
      debouncedSetSearchTerm(searchTerm);
    } else {
      setDebouncedSearchTerm('');
      setIsSearching(false);
    }
  }, [searchTerm, minSearchLength, debouncedSetSearchTerm]);

  // Perform search
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < minSearchLength) {
      return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const term = caseSensitive ? debouncedSearchTerm : debouncedSearchTerm.toLowerCase();
    
    const filtered = data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (!fieldValue) return false;
        
        const value = caseSensitive ? fieldValue : fieldValue.toLowerCase();
        return value.includes(term);
      });
    });

    return filtered.slice(0, maxResults);
  }, [data, debouncedSearchTerm, searchFields, minSearchLength, maxResults, caseSensitive]);

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  };

  // Search statistics
  const searchStats = useMemo(() => ({
    totalResults: searchResults.length,
    hasResults: searchResults.length > 0,
    isActive: debouncedSearchTerm.length >= minSearchLength,
    isTruncated: searchResults.length === maxResults
  }), [searchResults.length, debouncedSearchTerm.length, minSearchLength, maxResults]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    searchResults,
    isSearching,
    clearSearch,
    searchStats
  };
};

/**
 * Hook for advanced search with filters
 * @param {Array} data - Data to search through
 * @param {Object} options - Search options
 * @returns {Object} Advanced search state and functions
 */
export const useAdvancedSearch = (data = [], options = {}) => {
  const {
    searchFields = ['name'],
    filterFields = [],
    sortOptions = ['name'],
    ...searchOptions
  } = options;

  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(sortOptions[0] || 'name');
  const [sortOrder, setSortOrder] = useState('asc');

  const searchHook = useSearch(data, { searchFields, ...searchOptions });

  // Apply filters to search results
  const filteredResults = useMemo(() => {
    let results = searchHook.searchResults.length > 0 
      ? searchHook.searchResults 
      : (searchHook.debouncedSearchTerm ? [] : data);

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value && value !== 'all') {
        results = results.filter(item => {
          const itemValue = item[field];
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      results = [...results].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        
        const comparison = aValue.toString().localeCompare(bValue.toString());
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return results;
  }, [searchHook.searchResults, searchHook.debouncedSearchTerm, data, filters, sortBy, sortOrder]);

  // Update filter
  const updateFilter = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Clear everything
  const clearAll = () => {
    searchHook.clearSearch();
    clearFilters();
    setSortBy(sortOptions[0] || 'name');
    setSortOrder('asc');
  };

  // Get unique values for filter field
  const getFilterOptions = (field) => {
    if (!Array.isArray(data)) return [];
    
    const values = data
      .map(item => item[field])
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();
    
    return values;
  };

  return {
    ...searchHook,
    filteredResults,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    clearAll,
    getFilterOptions,
    hasActiveFilters: Object.values(filters).some(value => value && value !== 'all')
  };
};