import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
  const [fetchingQuestion, setFetchingQuestion] = useState<boolean>(isEditMode);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // If in edit mode, fetch the question details
  useEffect(() => {
    if (isEditMode && questionId) {
      const fetchQuestion = async () => {
        try {
          setFetchingQuestion(true);
          console.log(`Fetching question with ID: ${questionId} for tryout ${id}`);
          
          // First check if the tryout exists
          try {
            await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}`);
          } catch (tryoutErr) {
            console.error('Error fetching tryout:', tryoutErr);
            setError('Unable to find the specified tryout.');
            setFetchingQuestion(false);
            return;
          }
          
          // Then fetch the question details
          const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}/questions/${questionId}`);
          console.log("Question data received:", response.data);
          
          const question: Question = response.data;
          
          // Ensure isTrue is explicitly a boolean value
          const isTrue = question.isTrue === true;
          
          setFormData({
            text: question.text,
            isTrue: isTrue
          });
          
          console.log("Form data set to:", { text: question.text, isTrue: isTrue });
          setError(null);
        } catch (err: any) {
          console.error('Error fetching question details:', err);
          if (err.response && err.response.status === 404) {
            setError('Question not found. It may have been deleted.');
          } else {
            setError('Failed to load question details. Please try again later.');
          }
        } finally {
          setFetchingQuestion(false);
        }
      };

      fetchQuestion();
    }
  }, [id, questionId, isEditMode, API_BASE_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Ensure the boolean value is explicitly set
  const handleRadioChange = (value: boolean) => {
    setFormData({
      ...formData,
      isTrue: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Ensure we're sending a valid boolean value for isTrue
      const questionData = {
        text: formData.text,
        isTrue: formData.isTrue === true // Force it to be a boolean true/false
      };
      
      console.log("Submitting question data:", questionData);
      
      if (isEditMode && questionId) {
        // Update existing question
        await axios.put(`${API_BASE_URL}/api/v1/tryouts/${id}/questions/${questionId}`, questionData);
      } else {
        // Create new question
        await axios.post(`${API_BASE_URL}/api/v1/tryouts/${id}/questions`, questionData);
      }
      
      navigate(`/tryout/${id}`);
    } catch (err: any) {
      console.error('Error saving question:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError('Invalid input data. Please ensure all fields are filled correctly.');
      } else {
        setError('Failed to save question. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchingQuestion) {
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
            placeholder="Enter your question here..."
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Correct Answer</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.isTrue === true}
                onChange={() => handleRadioChange(true)}
                required
              />
              True
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.isTrue === false}
                onChange={() => handleRadioChange(false)}
                required
              />
              False
            </label>
          </div>
          <p className="help-text">Please select the correct answer for this question. This field is required.</p>
        </div>
        
        <div className="form-actions">
          <Link to={`/tryout/${id}`} className="cancel-btn">
            Cancel
          </Link>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;