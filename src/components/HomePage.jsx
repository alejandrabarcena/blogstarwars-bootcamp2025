import React, { useEffect } from 'react';
import { Users, Globe, Rocket, Car, Film, Zap, Truck, TrendingUp, Clock, Star } from 'lucide-react';
import { useStarWars } from '../contexts/StarWarsContext';
import { fetchCharacters, fetchFilms, fetchPlanets, fetchSpecies, fetchStarships, fetchVehicles } from '../services/swapi';
import LoadingSpinner from './LoadingSpinner';
import EntityCard from './EntityCard';
import { mockFilms, mockCharacters, mockPlanets, mockStarships, mockVehicles, mockSpecies } from '../data/mockData';

const HomePage = () => {
  const { state, dispatch } = useStarWars();

  useEffect(() => {
    const loadData = async () => {
      // Load mock data INSTANTLY first
      console.log('⚡ Loading mock data instantly...');
      dispatch({ type: 'SET_FILMS', payload: mockFilms });
      dispatch({ type: 'SET_CHARACTERS', payload: mockCharacters });
      dispatch({ type: 'SET_PLANETS', payload: mockPlanets });
      dispatch({ type: 'SET_STARSHIPS', payload: mockStarships });
      dispatch({ type: 'SET_VEHICLES', payload: mockVehicles });
      dispatch({ type: 'SET_SPECIES', payload: mockSpecies });
      dispatch({ type: 'SET_TRANSPORTS', payload: [] });
      dispatch({ type: 'SET_LOADING', payload: false });
      console.log('✅ Mock data loaded INSTANTLY!');

      // Check if real data is already cached
      if (state.lastFetch && (Date.now() - state.lastFetch < 300000)) { // 5 minutes cache
        console.log('📦 Using cached real data');
        return;
      }

      // Load real data in background (optional)
      console.log('🔄 Loading real data in background...');
      try {
        const [films, characters, planets, species, starships, vehicles] = await Promise.allSettled([
          fetchFilms(),
          fetchCharacters(),
          fetchPlanets(),
          fetchSpecies(),
          fetchStarships(),
          fetchVehicles()
        ]);

        const getResultValue = (promiseResult) => {
          if (promiseResult.status === 'fulfilled') {
            return Array.isArray(promiseResult.value) ? promiseResult.value : [];
          }
          console.warn('Promise rejected:', promiseResult.reason);
          return [];
        };

        const formatEntities = (data, type) => {
          if (!Array.isArray(data)) return [];
          return data.map(item => ({
            uid: item.uid,
            name: item.name || item.properties?.title || 'Unknown',
            type: type,
            properties: item.properties
          }));
        };

        const filmsData = formatEntities(getResultValue(films), 'films');
        const charactersData = formatEntities(getResultValue(characters), 'people');
        const planetsData = formatEntities(getResultValue(planets), 'planets');
        const speciesData = formatEntities(getResultValue(species), 'species');
        const starshipsData = formatEntities(getResultValue(starships), 'starships');
        const vehiclesData = formatEntities(getResultValue(vehicles), 'vehicles');

        // Only update if we got real data, otherwise keep mock data
        if (filmsData.length > 0) {
          dispatch({ type: 'SET_FILMS', payload: filmsData });
        }
        dispatch({ type: 'SET_CHARACTERS', payload: charactersData });
        dispatch({ type: 'SET_PLANETS', payload: planetsData });
        dispatch({ type: 'SET_SPECIES', payload: speciesData });
        dispatch({ type: 'SET_STARSHIPS', payload: starshipsData });
        dispatch({ type: 'SET_VEHICLES', payload: vehiclesData });
        dispatch({ type: 'SET_LAST_FETCH', payload: new Date().getTime() });
        
        console.log('🎉 All real data loaded and updated!');
      } catch (error) {
        console.warn('Real data loading failed, using mock data:', error);
      }
    };

    loadData();
  }, [dispatch]);

  if (state.loading) {
    return <LoadingSpinner />;
  }

  // Debug: Check if data is loaded
  const totalItems = state.films.length + state.characters.length + state.planets.length + 
                    state.species.length + state.starships.length + state.vehicles.length;

  if (totalItems === 0 && !state.loading) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-warning">Loading Star Wars data...</h2>
        <p className="text-muted">Please wait while we fetch the galaxy's information.</p>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'Films',
      icon: <Film size={24} />,
      data: state.films.slice(0, 12),
      color: 'text-danger'
    },
    {
      title: 'Characters',
      icon: <Users size={24} />,
      data: state.characters.slice(0, 12),
      color: 'text-primary'
    },
    {
      title: 'Planets',
      icon: <Globe size={24} />,
      data: state.planets.slice(0, 12),
      color: 'text-success'
    },
    {
      title: 'Species',
      icon: <Zap size={24} />,
      data: state.species.slice(0, 12),
      color: 'text-purple'
    },
    {
      title: 'Starships',
      icon: <Rocket size={24} />,
      data: state.starships.slice(0, 12),
      color: 'text-info'
    },
    {
      title: 'Vehicles',
      icon: <Car size={24} />,
      data: state.vehicles.slice(0, 12),
      color: 'text-warning'
    }
  ];

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <div className="position-relative py-5">
          <h1 className="display-2 text-warning fw-bold mb-4">
            <Star className="me-3" size={32} />
            Star Wars Galaxy
          </h1>
          <p className="lead text-light mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Explore <span className="text-warning fw-bold">{totalItems}</span> entities from the galaxy far, far away
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card bg-dark border-warning text-center">
            <div className="card-body py-3">
              <TrendingUp className="text-warning mb-2" size={24} />
              <div className="text-warning fw-bold fs-3">{state.favorites.length}</div>
              <h6 className="text-light mb-0">Favorites</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-warning text-center">
            <div className="card-body py-3">
              <Clock className="text-warning mb-2" size={24} />
              <div className="text-warning fw-bold fs-4">
                {state.lastFetch ? new Date(state.lastFetch).toLocaleDateString() : 'Today'}
              </div>
              <h6 className="text-light mb-0">Last Updated</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-warning text-center">
            <div className="card-body py-3">
              <Globe className="text-warning mb-2" size={24} />
              <div className="text-warning fw-bold fs-3">6</div>
              <h6 className="text-light mb-0">Categories</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="row mb-4 g-2">
        {sections.map((section, index) => (
          <div key={section.title} className="col-lg-2 col-md-4 col-sm-6">
            <div className="card bg-secondary border-warning h-100">
              <div className="card-body text-center py-2">
                <div className="text-warning mb-2">
                  {section.icon}
                </div>
                <h6 className="text-warning mb-1">{section.title}</h6>
                <div className="text-white fw-bold">{section.data.length}</div>
                <small className="text-muted">items</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.title} className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <span className="text-warning me-3">{section.icon}</span>
              <h3 className="mb-0 text-warning">{section.title}</h3>
              <span className="badge bg-warning text-dark ms-2">{section.data.length}</span>
            </div>
          </div>
          
          <div className="row g-4">
            {section.data.map((entity) => (
              <EntityCard key={`${entity.type}-${entity.uid}`} entity={entity} />
            ))}
          </div>
          
          {section.data.length === 0 && (
            <div className="text-center py-5">
              <div className="card bg-secondary border-0 py-4">
                <div className="card-body">
                  <span className="text-warning mb-3 d-block">{section.icon}</span>
                  <h5 className="text-light">No {section.title.toLowerCase()} available</h5>
                  <small className="text-muted">Data will appear here when loaded from the API</small>
                </div>
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Footer Info */}
      <footer className="mt-5 pt-5">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card bg-secondary border-warning h-100 text-center">
              <div className="card-body py-3">
                <div className="text-warning mb-2 fs-2">🚀</div>
                <h6 className="text-warning mb-2">Powered by SWAPI</h6>
                <p className="text-light mb-0">
                  Real-time data from the 
                  <a href="https://swapi.tech" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none ms-1">
                    Star Wars API
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card bg-secondary border-warning h-100 text-center">
              <div className="card-body py-3">
                <div className="text-warning mb-2 fs-2">🖼️</div>
                <h6 className="text-warning mb-2">Smart Images</h6>
                <p className="text-light mb-0">
                  Multiple fallbacks ensure perfect visuals every time
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card bg-secondary border-warning h-100 text-center">
              <div className="card-body py-3">
                <div className="text-warning mb-2 fs-2">❤️</div>
                <h6 className="text-warning mb-2">Built with Passion</h6>
                <p className="text-light mb-0">
                  Created by Star Wars fans, for Star Wars fans
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card bg-secondary border-warning h-100 text-center">
              <div className="card-body py-3">
                <div className="text-warning mb-2 fs-2">⚡</div>
                <h6 className="text-warning mb-2">Lightning Fast</h6>
                <p className="text-light mb-0">
                  Optimized for speed and production ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;