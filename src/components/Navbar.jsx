import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, UploadIcon, BarChartIcon, UserIcon, LogOutIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">FinanceTracker</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link"><HomeIcon className="navbar-icon" />Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="navbar-link"><UploadIcon className="navbar-icon" />Upload</Link>
              <Link to="/dashboard" className="navbar-link"><BarChartIcon className="navbar-icon" />Dashboard</Link>
              <button onClick={logout} className="navbar-link"><LogOutIcon className="navbar-icon" />Logout</button>
            </>
          ) : (
            <Link to="/login" className="navbar-link"><UserIcon className="navbar-icon" />Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;