import React, { useState } from 'react';
import { getImageUrl } from '../services/swapi';

const ImageWithFallback = ({ 
  type, 
  uid, 
  name, 
  className = '', 
  style = {}, 
  alt,
  showSpinner = true 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrls = getImageUrl(type, uid, name);
  
  // Array de URLs en orden de prioridad (LOCAL PRIMERO)
  const urlArray = [
    imageUrls.local,      // Imagen local (MÁXIMA PRIORIDAD)
    imageUrls.primary,    // Visual Guide
    imageUrls.secondary,  // SWAPI Gallery  
    imageUrls.wikia,      // Wikia/Fandom
    imageUrls.placeholder, // Imagen aleatoria
    imageUrls.fallback    // Placeholder final
  ];

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      const sources = ['Local Image', 'Visual Guide', 'SWAPI Gallery', 'Wikia/Fandom', 'Random Image', 'Final Placeholder'];
      console.log(`✅ ${name} (ID: ${uid}) loaded from: ${sources[currentImageIndex]}`);
    }
  };

  const handleImageError = () => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      const sources = ['Local Image', 'Visual Guide', 'SWAPI Gallery', 'Wikia/Fandom', 'Random Image', 'Final Placeholder'];
      console.log(`❌ ${name} (ID: ${uid}) failed from: ${sources[currentImageIndex]}`);
    }
    
    if (currentImageIndex < urlArray.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageLoaded(false);
    }
  };

  return (
    <div className="position-relative">
      <img
        src={urlArray[currentImageIndex]}
        className={className}
        style={style}
        alt={alt || name}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {!imageLoaded && showSpinner && (
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-secondary"
          style={{ minHeight: '250px' }}
        >
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;