import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStarWars } from '../contexts/StarWarsContext';
import EntityCard from './EntityCard';

const FavoritesPage = () => {
  const { state } = useStarWars();

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <Link to="/" className="btn btn-outline-secondary mb-4">
            <ArrowLeft size={16} className="me-2" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-warning d-flex align-items-center justify-content-center">
          <Heart size={32} className="me-3" />
          My Favorites
        </h1>
        <p className="text-muted">Your saved Star Wars entities</p>
      </div>

      {state.favorites.length === 0 ? (
        <div className="text-center py-5">
          <Heart size={64} className="text-muted mb-3" />
          <h3 className="text-muted">No favorites yet</h3>
          <p className="text-muted">Start exploring and add your favorite characters, planets, and vehicles!</p>
          <Link to="/" className="btn btn-warning mt-3">
            Explore Star Wars Blog
          </Link>
        </div>
      ) : (
        <div className="row">
          {state.favorites.map((entity) => (
            <EntityCard key={`favorite-${entity.type}-${entity.uid}`} entity={entity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;