import React from 'react';
import { Link } from 'react-router-dom';
import { BarChartIcon, UploadIcon } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to FinanceTracker</h1>
      <p className="home-description">Track your finances with ease. Upload your bank statements and visualize your spending habits.</p>
      <div className="home-buttons">
        <Link to="/upload" className="home-button home-button-upload">
          <UploadIcon className="inline-block mr-2" />
          Upload Statement
        </Link>
        <Link to="/dashboard" className="home-button home-button-dashboard">
          <BarChartIcon className="inline-block mr-2" />
          View Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;