import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Application entry point - creates the React root and renders the App component
 * in strict mode for better development experience and early problem detection
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measurement API integration point
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
