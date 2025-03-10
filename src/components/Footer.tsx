import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {year} Quiz Platform</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;