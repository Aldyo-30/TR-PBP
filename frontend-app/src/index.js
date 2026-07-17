/**
 * ============================================
 * index.js — Application Entry Point
 * ============================================
 * React 19 createRoot pattern.
 * Imports global styles from styles/ directory.
 * ============================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
