import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode library

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        // Decode the token
        const decodedToken = jwtDecode(token);
        
        // Check if the token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token'); // Remove expired token
            return <Navigate to="/login" />;  // Redirect to login
        }

        return children; // Token is valid, allow access
    }

    return <Navigate to="/login" />; // No token, redirect to login
};

export default PrivateRoute;
