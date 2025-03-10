import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Tryout } from '../types';

const TryoutList: React.FC = () => {
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTryouts = async () => {
      try {
        setIsLoading(true);
        // Get the API base URL from environment or use default
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts`);
        setTryouts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tryouts:', err);
        setError('Failed to load tryouts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTryouts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="tryout-list-container">
        <div className="loading">Loading tryouts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tryout-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="tryout-list-container">
      <h1>Available Tryouts</h1>
      
      {tryouts.length === 0 ? (
        <p>No tryouts available at the moment.</p>
      ) : (
        <div className="tryout-grid">
          {tryouts.map((tryout) => (
            <div key={tryout.id} className="tryout-card">
              <h2>{tryout.title}</h2>
              <p className="category">{tryout.category}</p>
              <p className="description">{tryout.description.substring(0, 100)}...</p>
              <div className="tryout-details">
                <span>Duration: {tryout.duration} minutes</span>
                <span>Created: {formatDate(tryout.createdAt)}</span>
              </div>
              <Link to={`/tryout/${tryout.id}`} className="view-tryout-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TryoutList;