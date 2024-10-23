import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import UserProvider from './components/Auth/UserContext'; // Adjust path accordingly

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root

root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
