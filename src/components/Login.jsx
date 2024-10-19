import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserIcon, LockIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-input-group">
          <label htmlFor="email" className="login-label">
            Email
          </label>
          <div className="login-input-wrapper">
            <UserIcon className="login-input-icon" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="login-input-group">
          <label htmlFor="password" className="login-label">
            Password
          </label>
          <div className="login-input-wrapper">
            <LockIcon className="login-input-icon" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
        </div>
        <button
          type="submit"
          className="login-button"
        >
          Login
        </button>
      </form>
      <p className="login-register-link">
        Don't have an account?{' '}
        <Link to="/register" className="login-link">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;