import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StarWarsProvider } from '../../contexts/StarWarsContext';

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  const { initialEntries = ['/'], ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <StarWarsProvider>
        {children}
      </StarWarsProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock data for tests
export const mockCharacter = {
  uid: '1',
  name: 'Luke Skywalker',
  type: 'people',
  properties: {
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male'
  }
};

export const mockPlanet = {
  uid: '1',
  name: 'Tatooine',
  type: 'planets',
  properties: {
    diameter: '10465',
    rotation_period: '23',
    orbital_period: '304',
    gravity: '1 standard',
    population: '200000',
    climate: 'arid',
    terrain: 'desert'
  }
};

export const mockFilm = {
  uid: '1',
  name: 'A New Hope',
  type: 'films',
  properties: {
    title: 'A New Hope',
    episode_id: 4,
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25'
  }
};

// Mock API responses
export const mockApiResponse = {
  results: [mockCharacter, mockPlanet, mockFilm],
  count: 3,
  next: null,
  previous: null
};

// Helper to create mock fetch responses
export const createMockFetch = (data, ok = true, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data)
  });
};

// Helper to wait for async operations
export const waitFor = (callback, options = {}) => {
  return new Promise((resolve, reject) => {
    const { timeout = 1000, interval = 50 } = options;
    const startTime = Date.now();

    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
          return;
        }
      } catch (error) {
        // Continue checking
      }

      if (Date.now() - startTime >= timeout) {
        reject(new Error('Timeout waiting for condition'));
        return;
      }

      setTimeout(check, interval);
    };

    check();
  });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';