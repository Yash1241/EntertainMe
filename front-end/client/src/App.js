import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Registration from './components/Auth/Registration'; 
import Login from './components/Auth/Login'; 
import EventList from './components/Events/EventList'; 
import EventCreator from './components/Events/EventCreator';
import './App.css';

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className="App-header">
      <h1>Welcome to Entertain Me</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/events">Events</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

const App = () => {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/" element={
          <>
            <h2>Home Page</h2>
            <p>Welcome to the Entertain Me app! Navigate to register or login.</p>
          </>
        } />
        <Route path="/create-event" element={<EventCreator />} />
      </Routes>
    </div>
  );
};

export default App;
