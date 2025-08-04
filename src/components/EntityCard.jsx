import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ExternalLink } from 'lucide-react';
import { useStarWars } from '../contexts/StarWarsContext';
import ImageWithFallback from './ImageWithFallback';

const EntityCard = ({ entity, showDetails = true }) => {
  const { addFavorite, removeFavorite, isFavorite } = useStarWars();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(entity.uid)) {
      removeFavorite(entity.uid);
    } else {
      addFavorite(entity);
    }
  };

  const getEntityInfo = () => {
    if (!entity.properties) return null;
    
    switch (entity.type) {
      case 'films':
        return (
          <>
            <p className="text-muted mb-1">Episode: {entity.properties.episode_id || 'Unknown'}</p>
            <p className="text-muted mb-1">Director: {entity.properties.director || 'Unknown'}</p>
          </>
        );
      case 'people':
        return (
          <>
            <p className="text-muted mb-1">Gender: {entity.properties.gender || 'Unknown'}</p>
            <p className="text-muted mb-1">Birth Year: {entity.properties.birth_year || 'Unknown'}</p>
          </>
        );
      case 'planets':
        return (
          <>
            <p className="text-muted mb-1">Population: {entity.properties.population || 'Unknown'}</p>
            <p className="text-muted mb-1">Terrain: {entity.properties.terrain || 'Unknown'}</p>
          </>
        );
      case 'species':
        return (
          <>
            <p className="text-muted mb-1">Classification: {entity.properties.classification || 'Unknown'}</p>
            <p className="text-muted mb-1">Language: {entity.properties.language || 'Unknown'}</p>
          </>
        );
      case 'starships':
        return (
          <>
            <p className="text-muted mb-1">Model: {entity.properties.model || 'Unknown'}</p>
            <p className="text-muted mb-1">Class: {entity.properties.starship_class || 'Unknown'}</p>
          </>
        );
      case 'transports':
        return (
          <>
            <p className="text-muted mb-1">Model: {entity.properties.model || 'Unknown'}</p>
          </>
        );
      case 'vehicles':
        return (
          <>
            <p className="text-muted mb-1">Model: {entity.properties.model || 'Unknown'}</p>
            <p className="text-muted mb-1">Class: {entity.properties.vehicle_class || 'Unknown'}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
      <div className="card bg-dark text-white h-100 shadow-sm border-secondary hover-card">
        <div className="position-relative">
          <ImageWithFallback
            type={entity.type}
            uid={entity.uid}
            name={entity.name}
            className="card-img-top"
            style={{ height: '250px', objectFit: 'cover' }}
            alt={entity.name}
          />
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-dark bg-opacity-75 text-capitalize">
              {entity.type === 'people' ? 'character' : entity.type}
            </span>
          </div>
          <button
            className={`btn position-absolute top-0 end-0 m-2 ${
              isFavorite(entity.uid) ? 'btn-warning' : 'btn-outline-light'
            }`}
            onClick={handleFavoriteClick}
            style={{ zIndex: 10 }}
          >
            <Heart size={16} fill={isFavorite(entity.uid) ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-warning">{entity.name}</h5>
          <div className="flex-grow-1 mb-3">
            {getEntityInfo()}
          </div>
          
          {showDetails && (
            <div className="mt-auto">
              <Link
                to={`/details/${entity.type}/${entity.uid}`}
                className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center"
              >
                <Eye size={16} className="me-2" />
                Learn More
                <ExternalLink size={14} className="ms-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityCard;