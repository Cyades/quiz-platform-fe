import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tryout, Question } from '../types';

const TryoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingTryout, setIsLoadingTryout] = useState<boolean>(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const [tryoutError, setTryoutError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Fetch tryout details
  useEffect(() => {
    const fetchTryoutDetails = async () => {
      if (!id) {
        setTryoutError("Tryout ID is missing");
        setIsLoadingTryout(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}`);
        console.log("Tryout data received:", response.data);
        setTryout(response.data);
        setTryoutError(null);
      } catch (err: any) {
        console.error('Error fetching tryout details:', err);
        setTryoutError(err.response?.data?.error || 'Failed to load tryout details. Please try again later.');
      } finally {
        setIsLoadingTryout(false);
      }
    };

    fetchTryoutDetails();
  }, [id, API_BASE_URL]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) {
        setIsLoadingQuestions(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/tryouts/${id}/questions`);
        console.log("Questions data received:", response.data);
        setQuestions(Array.isArray(response.data) ? response.data : []);
        setQuestionError(null);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setQuestions([]);
        setQuestionError(err.response?.data?.error || 'Failed to load questions. The tryout may not have any questions yet.');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    if (!isLoadingTryout && tryout) {
      fetchQuestions();
    }
  }, [isLoadingTryout, tryout, id, API_BASE_URL]);

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
    } catch (err: any) {
      console.error('Error deleting tryout:', err);
      setTryoutError('Failed to delete tryout. Please try again later.');
    }
  };

  // Only show loading for tryout data
  if (isLoadingTryout) {
    return (
      <div className="tryout-detail-container">
        <div className="loading">Loading tryout details...</div>
      </div>
    );
  }

  // Handle tryout load error
  if (tryoutError) {
    return (
      <div className="tryout-detail-container">
        <div className="error-message">{tryoutError}</div>
        <Link to="/" className="back-btn">Back to Tryouts</Link>
      </div>
    );
  }

  // Handle missing tryout data
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
          <h2>Questions {isLoadingQuestions ? '(Loading...)' : `(${questions.length})`}</h2>
          
          {!tryout.hasSubmission && (
            <Link to={`/tryout/${id}/questions/new`} className="add-question-btn">
              Add New Question
            </Link>
          )}
          
          {isLoadingQuestions ? (
            <p>Loading questions...</p>
          ) : questionError ? (
            <div>
              <p>Unable to load questions: {questionError}</p>
              <p>You can try to add a new question.</p>
            </div>
          ) : questions.length === 0 ? (
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
                            } catch (err: any) {
                              console.error('Error deleting question:', err);
                              setQuestionError('Failed to delete question. Please try again later.');
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