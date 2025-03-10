import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import TryoutList from './pages/TryoutList';
import TryoutDetail from './pages/TryoutDetail';
import TryoutForm from './pages/TryoutForm';
import QuestionForm from './pages/QuestionForm';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TryoutList />} />
            <Route path="/tryout/new" element={<TryoutForm />} />
            <Route path="/tryout/:id" element={<TryoutDetail />} />
            <Route path="/tryout/:id/edit" element={<TryoutForm />} />
            <Route path="/tryout/:id/questions/new" element={<QuestionForm />} />
            <Route path="/tryout/:id/questions/:questionId/edit" element={<QuestionForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;