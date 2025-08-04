import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StarWarsProvider } from './contexts/StarWarsContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import EntityDetails from './components/EntityDetails';
import FavoritesPage from './components/FavoritesPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ErrorBoundary>
      <StarWarsProvider>
        <Router>
          <div className="min-vh-100 bg-dark text-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/details/:type/:id" element={<EntityDetails />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </div>
        </Router>
      </StarWarsProvider>
    </ErrorBoundary>
  );
}

export default App;