import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tryout, Question } from '../types';

const TryoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchTryoutData = async () => {
      if (!id) {
        setError("Tryout ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log(`Fetching tryout with ID: ${id}`);
        
        // Fetch tryout details
        const tryoutResponse = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}`);
        console.log("Tryout data received:", tryoutResponse.data);
        setTryout(tryoutResponse.data);
        
        // Fetch questions
        const questionsResponse = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}/questions`);
        console.log("Questions data received:", questionsResponse.data);
        setQuestions(questionsResponse.data);
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to load tryout details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTryoutData();
  }, [id, API_BASE_URL]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString || "Invalid date";
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/tryouts/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Error deleting tryout:', err);
      setError('Failed to delete tryout. Please try again later.');
    }
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
        <div className="error-message">Tryout not found or failed to load.</div>
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
          <p><strong>Has Submissions:</strong> {tryout.hasSubmission ? 'Yes' : 'No'}</p>
        </div>

        <div className="tryout-description">
          <h2>Description</h2>
          <p>{tryout.description}</p>
        </div>

        <div className="tryout-questions">
          <h2>Questions ({questions.length})</h2>
          
          {!tryout.hasSubmission && (
            <Link to={`/tryout/${id}/questions/new`} className="add-question-btn">
              Add New Question
            </Link>
          )}
          
          {questions.length === 0 ? (
            <p>No questions available for this tryout.</p>
          ) : (
            <div className="question-list">
              {questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    <h3>Question {index + 1}</h3>
                    {!tryout.hasSubmission && (
                      <div className="question-actions">
                        <Link to={`/tryout/${id}/questions/${question.id}/edit`} className="edit-btn">
                          Edit
                        </Link>
                        <button 
                          onClick={async () => {
                            try {
                              await axios.delete(`${API_BASE_URL}/api/v1/tryouts/${id}/questions/${question.id}`);
                              setQuestions(questions.filter(q => q.id !== question.id));
                            } catch (err) {
                              console.error('Error deleting question:', err);
                              setError('Failed to delete question. Please try again later.');
                            }
                          }}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p>{question.text}</p>
                  <p><strong>Answer:</strong> {question.isTrue ? 'True' : 'False'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tryout-actions">
          <Link to="/" className="back-btn">Back to Tryouts</Link>
          
          <div className="manage-actions">
            <Link to={`/tryout/${id}/edit`} className="edit-btn">
              Edit Tryout
            </Link>
            
            {deleteConfirm ? (
              <>
                <button onClick={() => setDeleteConfirm(false)} className="cancel-delete-btn">
                  Cancel
                </button>
                <button onClick={handleDelete} className="confirm-delete-btn">
                  Confirm Delete
                </button>
              </>
            ) : (
              <button onClick={handleDelete} className="delete-btn">
                Delete Tryout
              </button>
            )}
            
            <button className="start-btn" disabled={questions.length === 0}>
              Start Tryout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryoutDetail;