import React from 'react';
import { Loader2, Star } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="mb-4">
          <Star className="text-warning mb-3" size={48} />
        </div>
        <div className="spinner-border text-warning spinner-border-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-4">
          <h4 className="text-warning">Loading the Galaxy...</h4>
          <p className="text-muted">Fetching data from a galaxy far, far away</p>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <Loader2 className="text-warning me-2" size={16} />
            <small className="text-muted">This may take a few moments</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;