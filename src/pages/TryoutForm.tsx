import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Tryout, TryoutInput } from '../types';

const TryoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<TryoutInput>({
    title: '',
    description: '',
    category: '',
    duration: 30
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts/filter/options`);
        if (response.data.categories) {
          const categoryList = response.data.categories.map((cat: any) => cat.category);
          setCategories(categoryList);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // If in edit mode, fetch the tryout details
  useEffect(() => {
    if (isEditMode) {
      const fetchTryout = async () => {
        try {
          setIsLoading(true);
          const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
          const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}`);
          const tryout: Tryout = response.data;
          
          setFormData({
            title: tryout.title,
            description: tryout.description,
            category: tryout.category,
            duration: tryout.duration
          });
          
          setError(null);
        } catch (err) {
          console.error('Error fetching tryout details:', err);
          setError('Failed to load tryout details. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTryout();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      
      if (isEditMode) {
        // Update existing tryout
        await axios.put(`${API_BASE_URL}/api/v1/tryouts/${id}`, formData);
      } else {
        // Create new tryout
        await axios.post(`${API_BASE_URL}/api/v1/tryouts`, formData);
      }
      
      navigate('/');
    } catch (err: any) {
      console.error('Error saving tryout:', err);
      setError(err.response?.data?.error || 'Failed to save tryout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return <div className="loading">Loading tryout details...</div>;
  }

  return (
    <div className="tryout-form-container">
      <h1>{isEditMode ? 'Edit Tryout' : 'Create New Tryout'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="tryout-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            min="1"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Tryout' : 'Create Tryout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TryoutForm;