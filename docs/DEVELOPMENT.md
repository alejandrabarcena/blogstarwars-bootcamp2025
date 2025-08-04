# 🛠️ Development Guide - Star Wars Blog

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd star-wars-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
```

## 🏗️ Project Structure

```
star-wars-blog/
├── src/
│   ├── components/          # React components
│   │   ├── EntityCard.jsx   # Reusable entity card
│   │   ├── HomePage.jsx     # Main homepage
│   │   ├── Navbar.jsx       # Navigation component
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── StarWarsContext.jsx
│   ├── hooks/               # Custom hooks
│   │   ├── useApi.js        # API data fetching
│   │   ├── useLocalStorage.js
│   │   └── useSearch.js
│   ├── services/            # External services
│   │   ├── swapi.js         # SWAPI integration
│   │   └── backendApi.js    # Future backend
│   ├── utils/               # Utilities
│   │   ├── constants.js     # App constants
│   │   └── helpers.js       # Helper functions
│   └── test/                # Testing utilities
├── public/
│   └── images/              # Static images
│       ├── people/          # Character images
│       ├── planets/         # Planet images
│       ├── starships/       # Starship images
│       └── ...
├── backend/                 # Future backend API
├── docs/                    # Documentation
└── ...config files
```

## 🎨 Component Development

### Component Guidelines
1. **Functional Components**: Use function components with hooks
2. **Props Validation**: Use PropTypes or TypeScript
3. **Naming**: Use PascalCase for components
4. **File Structure**: One component per file
5. **Exports**: Use default exports for components

### Example Component
```jsx
import React from 'react';
import { Heart } from 'lucide-react';

const EntityCard = ({ entity, onFavorite, isFavorite }) => {
  return (
    <div className="card">
      <h3>{entity.name}</h3>
      <button onClick={() => onFavorite(entity)}>
        <Heart fill={isFavorite ? 'red' : 'none'} />
      </button>
    </div>
  );
};

export default EntityCard;
```

## 🪝 Custom Hooks

### Hook Development Guidelines
1. **Naming**: Start with 'use' prefix
2. **Single Responsibility**: One concern per hook
3. **Reusability**: Make hooks generic when possible
4. **Error Handling**: Include proper error handling

### Example Hook
```javascript
import { useState, useEffect } from 'react';

export const useApi = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
```

## 🎯 State Management

### Context Usage
```javascript
// Provider setup
<StarWarsProvider>
  <App />
</StarWarsProvider>

// Consumer usage
const { state, addFavorite, removeFavorite } = useStarWars();
```

### State Updates
```javascript
// Add to favorites
const handleAddFavorite = (entity) => {
  addFavorite(entity);
};

// Remove from favorites
const handleRemoveFavorite = (uid, type) => {
  removeFavorite(uid, type);
};
```

## 🔧 API Integration

### SWAPI Service
```javascript
import { fetchCharacters, fetchPlanets } from '../services/swapi';

// Fetch data
const characters = await fetchCharacters();
const planets = await fetchPlanets();

// Get entity details
const character = await fetchEntityDetails('people', '1');
```

### Error Handling
```javascript
try {
  const data = await fetchCharacters();
  setCharacters(data);
} catch (error) {
  console.error('Failed to fetch characters:', error);
  setError(error.message);
}
```

## 🖼️ Image Management

### Image Structure
```
public/images/
├── people/1.jpg      # Luke Skywalker
├── planets/1.jpg     # Tatooine
├── starships/2.jpg   # CR90 corvette
└── vehicles/4.jpg    # Sand Crawler
```

### Image Component Usage
```jsx
<ImageWithFallback
  type="people"
  uid="1"
  name="Luke Skywalker"
  className="card-img-top"
  style={{ height: '250px' }}
/>
```

## 🎨 Styling Guidelines

### CSS Classes
- Use Bootstrap classes for layout
- Use Tailwind for utilities
- Custom CSS for specific styling

### Example Styling
```jsx
<div className="card bg-dark text-white h-100 shadow-sm border-secondary hover-card">
  <div className="card-body">
    <h5 className="card-title text-warning">{entity.name}</h5>
  </div>
</div>
```

## 🧪 Testing

### Component Testing
```javascript
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../test/utils/testUtils';
import EntityCard from '../components/EntityCard';

test('renders entity card', () => {
  const mockEntity = {
    uid: '1',
    name: 'Luke Skywalker',
    type: 'people'
  };

  renderWithProviders(<EntityCard entity={mockEntity} />);
  
  expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
});
```

### Hook Testing
```javascript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

test('useLocalStorage hook', () => {
  const { result } = renderHook(() => useLocalStorage('test', 'initial'));
  
  expect(result.current[0]).toBe('initial');
  
  act(() => {
    result.current[1]('updated');
  });
  
  expect(result.current[0]).toBe('updated');
});
```

## 🚀 Performance

### Optimization Techniques
1. **Memoization**: Use React.memo, useMemo, useCallback
2. **Code Splitting**: Dynamic imports for routes
3. **Image Optimization**: Lazy loading, proper formats
4. **Caching**: API response caching, localStorage

### Example Optimization
```javascript
import React, { memo, useMemo } from 'react';

const EntityCard = memo(({ entity, onFavorite }) => {
  const formattedName = useMemo(() => {
    return entity.name.toUpperCase();
  }, [entity.name]);

  return (
    <div className="card">
      <h3>{formattedName}</h3>
    </div>
  );
});
```

## 🔍 Debugging

### Development Tools
1. **React DevTools**: Component inspection
2. **Redux DevTools**: State debugging (if using Redux)
3. **Network Tab**: API request monitoring
4. **Console Logs**: Strategic logging

### Debug Logging
```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 📦 Build & Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build locally
npm run preview

# Analyze bundle
npm run analyze
```

### Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

## 🔧 Configuration Files

### Vite Config
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          bootstrap: ['bootstrap'],
        }
      }
    }
  }
});
```

### ESLint Config
```javascript
// .eslintrc.js
module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error'
  }
};
```

## 🤝 Contributing

### Git Workflow
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push branch: `git push origin feature/new-feature`
4. Create Pull Request

### Commit Messages
```
feat: add new entity card component
fix: resolve image loading issue
docs: update development guide
style: format code with prettier
refactor: improve API service structure
test: add component tests
```

## 🐛 Troubleshooting

### Common Issues

1. **API Rate Limiting**
   - Solution: Implement request queuing
   - Check: Network tab for 429 errors

2. **Image Loading Failures**
   - Solution: Check image paths and fallbacks
   - Debug: Console logs in ImageWithFallback

3. **State Not Updating**
   - Solution: Check context provider wrapping
   - Debug: React DevTools state inspection

4. **Build Failures**
   - Solution: Check for TypeScript errors
   - Run: `npm run type-check`

### Debug Commands
```bash
# Clear cache
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for updates
npm outdated
```

---

Happy coding! May the Force be with you! 🌟