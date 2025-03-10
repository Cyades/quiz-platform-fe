import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            Quiz Platform
          </Link>
          <ul className="nav-menu">
            <li>
              <Link to="/">Tryouts</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;