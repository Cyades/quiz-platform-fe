import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Tryout } from '../types';

const TryoutList: React.FC = () => {
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state - filterInputs for current form values, appliedFilters for search execution
  const [filterInputs, setFilterInputs] = useState({
    title: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    title: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
  }, [API_BASE_URL]);

  // Fetch tryouts with filters - only when appliedFilters changes (via search button)
  useEffect(() => {
    const fetchTryouts = async () => {
      try {
        setIsLoading(true);
        
        // Build query params for filtering
        const params = new URLSearchParams();
        if (appliedFilters.title) params.append('title', appliedFilters.title);
        if (appliedFilters.category) params.append('category', appliedFilters.category);
        if (appliedFilters.startDate) params.append('startDate', new Date(appliedFilters.startDate).toISOString());
        if (appliedFilters.endDate) params.append('endDate', new Date(appliedFilters.endDate).toISOString());
        
        const url = Object.values(appliedFilters).some(val => val !== '') 
          ? `${API_BASE_URL}/api/v1/tryouts/filter?${params}`
          : `${API_BASE_URL}/api/v1/tryouts`;
        
        const response = await axios.get(url);
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
  }, [appliedFilters, API_BASE_URL]); // Only depends on appliedFilters, not filterInputs

  // Handle filter input changes - just updates the form, doesn't trigger search
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterInputs({
      ...filterInputs,
      [name]: value
    });
  };

  // Apply filters - triggered by search button
  const applyFilters = () => {
    setAppliedFilters({...filterInputs});
  };

  // Reset filters
  const resetFilters = () => {
    setFilterInputs({
      title: '',
      category: '',
      startDate: '',
      endDate: ''
    });
    setAppliedFilters({
      title: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading && tryouts.length === 0) {
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
      <div className="tryout-list-header">
        <h1>Available Tryouts</h1>
        <Link to="/tryout/new" className="create-tryout-btn">
          Create New Tryout
        </Link>
      </div>
      
      <div className="filter-container">
        <h2>Filter Tryouts</h2>
        <div className="filter-form">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={filterInputs.title}
                onChange={handleFilterChange}
                placeholder="Search by title"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={filterInputs.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="startDate">From Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filterInputs.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="endDate">To Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filterInputs.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="filter-actions">
            <button onClick={applyFilters} className="search-btn">
              Search
            </button>
            <button onClick={resetFilters} className="reset-filter-btn">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading">Searching...</div>
        </div>
      )}
      
      {!isLoading && tryouts.length === 0 ? (
        <p className="no-results">No tryouts found matching your criteria.</p>
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