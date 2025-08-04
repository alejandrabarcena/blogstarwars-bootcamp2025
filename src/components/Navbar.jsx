import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, Star } from 'lucide-react';
import { useStarWars } from '../contexts/StarWarsContext';
import { searchCharacters } from '../services/swapi';
import ImageWithFallback from './ImageWithFallback';

const Navbar = () => {
  const { state, searchEntities } = useStarWars();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim()) {
        // First search in local data
        const localResults = searchEntities(searchTerm);
        
        // Then search in API for characters only (most common search)
        try {
          const apiResults = await searchCharacters(searchTerm);
          const formattedApiResults = apiResults.map((item) => ({
            uid: item.uid,
            name: item.name,
            type: 'people',
            properties: item.properties
          }));
          
          const allResults = [...localResults.slice(0, 5)]; // Limit local results
          formattedApiResults.forEach((apiResult) => {
            if (!allResults.find(r => r.uid === apiResult.uid && r.type === apiResult.type)) {
              allResults.push(apiResult);
            }
          });
          
          setSearchResults(allResults.slice(0, 10));
        } catch (error) {
          setSearchResults(localResults.slice(0, 10));
        }
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 200); // Faster response
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchEntities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (entity) => {
    setSearchTerm('');
    setShowResults(false);
    navigate(`/details/${entity.type}/${entity.uid}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Star className="text-warning me-2" size={28} />
          <span className="fw-bold">Star Wars Galaxy</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <div className="position-relative" ref={searchRef}>
            <div className="input-group">
              <span className="input-group-text bg-secondary border-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control bg-secondary border-secondary text-white"
                placeholder="Search the galaxy... (characters, planets, ships)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '250px' }}
              />
            </div>
            
            {showResults && searchResults.length > 0 && (
              <div className="position-absolute w-100 mt-1 bg-dark border border-secondary rounded shadow-lg" style={{ zIndex: 1050, maxHeight: '400px', overflowY: 'auto' }}>
                {searchResults.map((entity) => (
                  <button
                    key={`${entity.type}-${entity.uid}`}
                    className="w-100 btn btn-outline-secondary d-flex align-items-center p-3 border-0 rounded-0"
                    onClick={() => handleSearchSelect(entity)}
                  >
                    <ImageWithFallback
                      type={entity.type}
                      uid={entity.uid}
                      name={entity.name}
                      className="rounded me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      showSpinner={false}
                    />
                    <div className="text-start">
                      <div className="text-white">{entity.name}</div>
                      <small className="text-muted text-capitalize">{entity.type === 'people' ? 'character' : entity.type}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchTerm && showResults && searchResults.length === 0 && (
            <div className="position-absolute w-100 mt-1 bg-dark border border-secondary rounded shadow-lg p-3" style={{ zIndex: 1050 }}>
              <div className="text-muted text-center">
                <small>No results found for "{searchTerm}"</small>
              </div>
            </div>
          )}

          <Link to="/favorites" className="btn btn-outline-warning position-relative">
            <Heart size={18} />
            <span className="ms-2 d-none d-md-inline">Favorites</span>
            {state.favorites.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                {state.favorites.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;