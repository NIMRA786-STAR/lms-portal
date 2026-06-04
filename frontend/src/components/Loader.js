import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ message = "Loading...", fullPage = false }) => {
  if (fullPage) {
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
        style={{ zIndex: 9999 }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-primary fw-bold">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loader d-flex flex-column justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

// Alternative simple loader without Bootstrap
export const SimpleLoader = () => {
  return (
    <div className="text-center py-5">
      <div className="spinner-grow text-primary me-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow text-secondary me-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Please wait...</p>
    </div>
  );
};

// Button loader component
export const ButtonLoader = () => {
  return (
    <span>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Loading...
    </span>
  );
};

// Card skeleton loader
export const CardSkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="row">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-img-top bg-secondary" style={{ height: '200px' }}></div>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="placeholder col-8 mb-2"></div>
                <div className="placeholder col-6 mb-2"></div>
                <div className="placeholder col-10"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;