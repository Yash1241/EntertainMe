import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Registration from './components/Auth/Registration';
import Login from './components/Auth/Login';
import EventList from './components/Events/EventList';
import EventCreator from './components/Events/EventCreator';
import PrivateRoute from './PrivateRoute';
import './App.css';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/events" element={
          <PrivateRoute>
            <EventList />
          </PrivateRoute>
        } />
        
        <Route path="/create-event" element={
          <PrivateRoute>
            <EventCreator />
          </PrivateRoute>
        } />
        
        <Route path="/" element={
          <>
            <h2>Home Page</h2>
            <p>Welcome to the Entertain Me app! Navigate to register or login.</p>
          </>
        } />
      </Routes>
    </div>
  );
};

export default App;
