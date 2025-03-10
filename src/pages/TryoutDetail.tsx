import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Tryout } from '../types';

const TryoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTryout = async () => {
      try {
        setIsLoading(true);
        // Get the API base URL from environment or use default
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}`);
        setTryout(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tryout:', err);
        setError('Failed to load tryout details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTryout();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="tryout-detail-container">
        <div className="loading">Loading tryout details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tryout-detail-container">
        <div className="error-message">{error}</div>
        <Link to="/" className="back-btn">Back to Tryouts</Link>
      </div>
    );
  }

  if (!tryout) {
    return (
      <div className="tryout-detail-container">
        <div className="error-message">Tryout not found.</div>
        <Link to="/" className="back-btn">Back to Tryouts</Link>
      </div>
    );
  }

  return (
    <div className="tryout-detail-container">
      <div className="tryout-detail-card">
        <div className="tryout-header">
          <h1>{tryout.title}</h1>
          <span className="category-badge">{tryout.category}</span>
        </div>
        
        <div className="tryout-info">
          <p><strong>Duration:</strong> {tryout.duration} minutes</p>
          <p><strong>Created:</strong> {formatDate(tryout.createdAt)}</p>
          <p><strong>Last Updated:</strong> {formatDate(tryout.updatedAt)}</p>
        </div>

        <div className="tryout-description">
          <h2>Description</h2>
          <p>{tryout.description}</p>
        </div>

        <div className="tryout-actions">
          <Link to="/" className="back-btn">Back to Tryouts</Link>
          <button className="start-btn" disabled>Start Tryout</button>
        </div>
      </div>
    </div>
  );
};

export default TryoutDetail;