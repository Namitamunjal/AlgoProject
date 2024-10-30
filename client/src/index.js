import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import './index.css';
import { ThresholdProvider } from './thresholdcontext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ThresholdProvider>
        <App />
      </ThresholdProvider>
    </Router>
  </React.StrictMode>
);

