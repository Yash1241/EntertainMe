import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('You have logged out successfully!'); // Feedback for the user
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className="App-header">
      <h1>Welcome to Entertain Me</h1>
      <nav>
        <Link to="/">Home</Link>
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {!isAuthenticated && <Link to="/login">Login</Link>}
        <Link to="/events">Events</Link>
        {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
};

export default Navigation;
