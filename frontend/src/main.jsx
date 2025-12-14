/**
 * Application Entry Point
 * 
 * This is the main entry point for the React application.
 * Renders the App component into the DOM root element.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Get root element and render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
