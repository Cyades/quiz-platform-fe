import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Question, QuestionInput } from '../types';

const QuestionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id, questionId } = useParams<{ id: string; questionId: string }>();
  const isEditMode = !!questionId;
  
  const [formData, setFormData] = useState<QuestionInput>({
    text: '',
    isTrue: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // If in edit mode, fetch the question details
  useEffect(() => {
    if (isEditMode && questionId) {
      const fetchQuestion = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}/questions/${questionId}`);
          const question: Question = response.data;
          
          setFormData({
            text: question.text,
            isTrue: question.isTrue
          });
          
          setError(null);
        } catch (err) {
          console.error('Error fetching question details:', err);
          setError('Failed to load question details. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuestion();
    }
  }, [id, questionId, isEditMode, API_BASE_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (isEditMode && questionId) {
        // Update existing question
        await axios.put(`${API_BASE_URL}/api/v1/tryouts/${id}/questions/${questionId}`, formData);
      } else {
        // Create new question
        await axios.post(`${API_BASE_URL}/api/v1/tryouts/${id}/questions`, formData);
      }
      
      navigate(`/tryout/${id}`);
    } catch (err: any) {
      console.error('Error saving question:', err);
      setError(err.response?.data?.error || 'Failed to save question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return <div className="loading">Loading question details...</div>;
  }

  return (
    <div className="question-form-container">
      <h1>{isEditMode ? 'Edit Question' : 'Add New Question'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <label htmlFor="text">Question Text</label>
          <textarea
            id="text"
            name="text"
            rows={5}
            value={formData.text}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isTrue"
              checked={formData.isTrue}
              onChange={handleChange}
            />
            Correct Answer is "True"
          </label>
          <p className="help-text">If unchecked, the correct answer is "False"</p>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/tryout/${id}`)} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;