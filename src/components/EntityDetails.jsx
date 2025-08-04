import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, MapPin, Users, Cog, Film, Zap, Truck } from 'lucide-react';
import { useStarWars } from '../contexts/StarWarsContext';
import { fetchEntityDetails } from '../services/swapi';
import LoadingSpinner from './LoadingSpinner';
import ImageWithFallback from './ImageWithFallback';

const EntityDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useStarWars();
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntity = async () => {
      if (!type || !id) return;
      
      setLoading(true);
      try {
        const data = await fetchEntityDetails(type, id);
        if (data) {
          setEntity({
            uid: id,
            name: data.properties.name,
            type: type,
            properties: data.properties,
            description: data.description
          });
        }
      } catch (error) {
        console.error('Error loading entity details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntity();
  }, [type, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!entity) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-warning">Entity not found</h2>
        <button className="btn btn-outline-warning mt-3" onClick={() => navigate('/')}>
          <ArrowLeft size={16} className="me-2" />
          Back to Home
        </button>
      </div>
    );
  }

  const handleFavoriteClick = () => {
    if (isFavorite(entity.uid)) {
      removeFavorite(entity.uid);
    } else {
      addFavorite(entity);
    }
  };

  const getEntityDescription = () => {
    const props = entity.properties;
    
    switch (entity.type) {
      case 'films':
        return `${entity.name} is Episode ${props.episode_id || 'Unknown'} of the Star Wars saga. Directed by ${props.director || 'unknown'} and produced by ${props.producer || 'unknown'}, this film was released on ${props.release_date || 'unknown'}. The opening crawl reads: "${props.opening_crawl ? props.opening_crawl.substring(0, 200) + '...' : 'No opening crawl available'}"`;
      
      case 'people':
        return `${entity.name} is a ${props.gender || 'unknown'} character from the Star Wars universe. Born in ${props.birth_year || 'unknown'}, this individual stands ${props.height || 'unknown'} cm tall and weighs ${props.mass || 'unknown'} kg. With ${props.hair_color || 'unknown'} hair, ${props.skin_color || 'unknown'} skin, and ${props.eye_color || 'unknown'} eyes, ${entity.name} represents one of the many diverse beings that populate the galaxy far, far away.`;
      
      case 'planets':
        return `${entity.name} is a fascinating world in the Star Wars galaxy. This ${props.climate || 'unknown'} planet features ${props.terrain || 'unknown'} terrain and spans ${props.diameter || 'unknown'} km in diameter. With a population of ${props.population || 'unknown'}, it completes one rotation every ${props.rotation_period || 'unknown'} hours and orbits its star every ${props.orbital_period || 'unknown'} days. The planet's unique characteristics make it an important location in the Star Wars universe.`;
      
      case 'species':
        return `${entity.name} is a sentient species in the Star Wars galaxy. This ${props.classification || 'unknown'} species has an average lifespan of ${props.average_lifespan || 'unknown'} years and stands ${props.average_height || 'unknown'} cm tall on average. They communicate primarily in ${props.language || 'unknown'} and are known for their ${props.skin_colors || 'various'} skin tones. Their homeworld is ${props.homeworld || 'unknown'}.`;
      
      case 'starships':
        return `The ${entity.name} is a ${props.starship_class || 'unknown'} manufactured by ${props.manufacturer || 'unknown'}. This impressive vessel measures ${props.length || 'unknown'} meters in length and can accommodate a crew of ${props.crew || 'unknown'} with space for ${props.passengers || 'unknown'} passengers. With a maximum atmospheric speed of ${props.max_atmosphering_speed || 'unknown'} and a hyperdrive rating of ${props.hyperdrive_rating || 'unknown'}, it represents the advanced technology of the Star Wars galaxy.`;
      
      case 'transports':
        return `The ${entity.name} is a ${props.vehicle_class || 'unknown'} transport manufactured by ${props.manufacturer || 'unknown'}. This reliable transport measures ${props.length || 'unknown'} meters in length and can accommodate a crew of ${props.crew || 'unknown'} with space for ${props.passengers || 'unknown'} passengers. With a maximum speed of ${props.max_atmosphering_speed || 'unknown'}, it serves as an essential transport vehicle across the Star Wars galaxy.`;
      
      case 'vehicles':
        return `The ${entity.name} is a ${props.vehicle_class || 'unknown'} manufactured by ${props.manufacturer || 'unknown'}. This versatile vehicle measures ${props.length || 'unknown'} meters in length and can accommodate a crew of ${props.crew || 'unknown'} with space for ${props.passengers || 'unknown'} passengers. With a maximum speed of ${props.max_atmosphering_speed || 'unknown'}, it serves various purposes across the Star Wars galaxy.`;
      
      default:
        return entity.description || `Learn more about ${entity.name} from the Star Wars universe.`;
    }
  };

  const renderProperties = () => {
    const props = entity.properties;
    
    switch (entity.type) {
      case 'films':
        return (
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Film size={16} className="me-2" />
                    Film Information
                  </h6>
                  <p><strong>Episode:</strong> {props.episode_id || 'Unknown'}</p>
                  <p><strong>Director:</strong> {props.director || 'Unknown'}</p>
                  <p><strong>Producer:</strong> {props.producer || 'Unknown'}</p>
                  <p><strong>Release Date:</strong> {props.release_date || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'people':
        return (
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Users size={16} className="me-2" />
                    Personal Information
                  </h6>
                  <p><strong>Height:</strong> {props.height || 'Unknown'} cm</p>
                  <p><strong>Mass:</strong> {props.mass || 'Unknown'} kg</p>
                  <p><strong>Gender:</strong> {props.gender || 'Unknown'}</p>
                  <p><strong>Birth Year:</strong> {props.birth_year || 'Unknown'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Cog size={16} className="me-2" />
                    Physical Attributes
                  </h6>
                  <p><strong>Hair Color:</strong> {props.hair_color || 'Unknown'}</p>
                  <p><strong>Skin Color:</strong> {props.skin_color || 'Unknown'}</p>
                  <p><strong>Eye Color:</strong> {props.eye_color || 'Unknown'}</p>
                  <p><strong>Homeworld:</strong> {props.homeworld || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'planets':
        return (
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <MapPin size={16} className="me-2" />
                    Geography
                  </h6>
                  <p><strong>Diameter:</strong> {props.diameter || 'Unknown'} km</p>
                  <p><strong>Climate:</strong> {props.climate || 'Unknown'}</p>
                  <p><strong>Terrain:</strong> {props.terrain || 'Unknown'}</p>
                  <p><strong>Surface Water:</strong> {props.surface_water || 'Unknown'}%</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Calendar size={16} className="me-2" />
                    Orbital Data
                  </h6>
                  <p><strong>Population:</strong> {props.population || 'Unknown'}</p>
                  <p><strong>Rotation Period:</strong> {props.rotation_period || 'Unknown'} hours</p>
                  <p><strong>Orbital Period:</strong> {props.orbital_period || 'Unknown'} days</p>
                  <p><strong>Gravity:</strong> {props.gravity || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'species':
        return (
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Zap size={16} className="me-2" />
                    Species Information
                  </h6>
                  <p><strong>Classification:</strong> {props.classification || 'Unknown'}</p>
                  <p><strong>Designation:</strong> {props.designation || 'Unknown'}</p>
                  <p><strong>Average Height:</strong> {props.average_height || 'Unknown'} cm</p>
                  <p><strong>Average Lifespan:</strong> {props.average_lifespan || 'Unknown'} years</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <MapPin size={16} className="me-2" />
                    Physical Attributes
                  </h6>
                  <p><strong>Skin Colors:</strong> {props.skin_colors || 'Unknown'}</p>
                  <p><strong>Hair Colors:</strong> {props.hair_colors || 'Unknown'}</p>
                  <p><strong>Eye Colors:</strong> {props.eye_colors || 'Unknown'}</p>
                  <p><strong>Language:</strong> {props.language || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'starships':
        return (
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Cog size={16} className="me-2" />
                    Specifications
                  </h6>
                  <p><strong>Model:</strong> {props.model || 'Unknown'}</p>
                  <p><strong>Class:</strong> {props.starship_class || 'Unknown'}</p>
                  <p><strong>Manufacturer:</strong> {props.manufacturer || 'Unknown'}</p>
                  <p><strong>Length:</strong> {props.length || 'Unknown'} meters</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Users size={16} className="me-2" />
                    Capacity & Performance
                  </h6>
                  <p><strong>Crew:</strong> {props.crew || 'Unknown'}</p>
                  <p><strong>Passengers:</strong> {props.passengers || 'Unknown'}</p>
                  <p><strong>Max Speed:</strong> {props.max_atmosphering_speed || 'Unknown'}</p>
                  <p><strong>Hyperdrive Rating:</strong> {props.hyperdrive_rating || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'vehicles':
        return (
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Cog size={16} className="me-2" />
                    Specifications
                  </h6>
                  <p><strong>Model:</strong> {props.model || 'Unknown'}</p>
                  <p><strong>Class:</strong> {props.vehicle_class || 'Unknown'}</p>
                  <p><strong>Manufacturer:</strong> {props.manufacturer || 'Unknown'}</p>
                  <p><strong>Length:</strong> {props.length || 'Unknown'} meters</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-secondary mb-3">
                <div className="card-body">
                  <h6 className="card-title text-warning">
                    <Users size={16} className="me-2" />
                    Capacity & Performance
                  </h6>
                  <p><strong>Crew:</strong> {props.crew || 'Unknown'}</p>
                  <p><strong>Passengers:</strong> {props.passengers || 'Unknown'}</p>
                  <p><strong>Max Speed:</strong> {props.max_atmosphering_speed || 'Unknown'}</p>
                  <p><strong>Cost:</strong> {props.cost_in_credits || 'Unknown'} credits</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="me-2" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="position-sticky" style={{ top: '100px' }}>
            <div className="card bg-dark border-secondary">
              <ImageWithFallback
                type={entity.type}
                uid={entity.uid}
                name={entity.name}
                className="card-img-top"
                style={{ height: '400px', objectFit: 'cover' }}
                alt={entity.name}
              />
              <div className="card-body text-center">
                <h3 className="card-title text-warning">{entity.name}</h3>
                <p className="text-muted text-capitalize mb-3">{entity.type}</p>
                <button
                  className={`btn w-100 ${
                    isFavorite(entity.uid) ? 'btn-warning' : 'btn-outline-warning'
                  }`}
                  onClick={handleFavoriteClick}
                >
                  <Heart size={16} className="me-2" fill={isFavorite(entity.uid) ? 'currentColor' : 'none'} />
                  {isFavorite(entity.uid) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <h4 className="text-warning mb-4">About {entity.name}</h4>
              <div className="mb-4">
                <p className="text-light fs-6 lh-lg">{getEntityDescription()}</p>
              </div>
              <h5 className="text-warning mb-3">Detailed Information</h5>
              {renderProperties()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDetails;